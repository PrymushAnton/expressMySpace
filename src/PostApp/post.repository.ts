import { client } from "../client/prismaClient";
import { CreatePost, UpdatePost } from "./types";

function extractFilename(url: string) {
  return url.split('/').pop() || 'unknown';
}

async function createPost(data: CreatePost, userId: number) {
	const {
		existingTags = [],
		newTags = [],
		images = [], // массив строк с url картинок
		link = [], // массив строк с url ссылок
		...otherData
	} = data;

	try {
		const post = await client.post.create({
			data: {
				...otherData,
				authorId: userId,
				tags: {
					connect: existingTags.map((name) => ({ name })),
					create: newTags.map((name) => ({ name })),
				},
				links: {
					create: link.map((url) => ({ url })),
				},
			},
			include: {
				tags: true,
				images: true,
				links: true,
			},
		});

		if (images.length > 0) {
			await client.image.createMany({
				data: images.map((url) => ({
					url,
					postId: post.id,
					file: url,
					filename: extractFilename(url)
				})),
			});
		}

		const fullPost = await client.post.findUnique({
			where: { id: post.id },
			include: {
				tags: true,
				images: true,
				links: true,
			},
		});

		return fullPost;
	} catch (error) {
		console.log("CreatePost error:", (error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

async function updatePost(data: UpdatePost) {
	const {
		existingTags = [],
		newTags = [],
		images = [], // массив url картинок
		link = [], // массив url ссылок
		id,
		...otherData
	} = data;

	try {
		const post = await client.post.update({
			where: { id },
			data: {
				...otherData,
				tags: {
					set: [],
					connect: existingTags.map((name) => ({ name })),
					create: newTags.map((name) => ({ name })),
				},
			},
		});

		await client.image.deleteMany({ where: { postId: post.id } });

		if (images.length > 0) {
			await client.image.createMany({
				data: images.map((url) => ({
					url,
					postId: post.id,
					file: url,
					filename: extractFilename(url)
				})),
			});
		}

		await client.link.deleteMany({ where: { postId: post.id } });

		if (link.length > 0) {
			await client.link.createMany({
				data: link.map((url) => ({ url, postId: post.id })),
			});
		}

		const fullPost = await client.post.findUnique({
			where: { id: post.id },
			include: {
				tags: true,
				images: true,
				links: true,
			},
		});

		return fullPost;
	} catch (error) {
		console.log("UpdatePost error:", (error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

const userRepository = {
	createPost,
	updatePost,
	deletePost: async function (postId: number) {
		try {
			await client.image.deleteMany({ where: { postId } });
			await client.link.deleteMany({ where: { postId } });

			// Если есть необходимость, можно удалить связи с тегами, но в модели их нет явно
			// await client.post.update({ where: { id: postId }, data: { tags: { set: [] } } });

			const post = await client.post.delete({ where: { id: postId } });
			return post;
		} catch (error) {
			console.log("DeletePost error:", (error as Error).message);
			return "Помилка при роботі з базою даних";
		}
	},
	findPostsByUserId: async function (userId: number) {
		try {
			const posts = await client.post.findMany({
				where: { authorId: userId },
				include: {
					tags: true,
					images: true,
					links: true,
					author: true,
				},
			});

			return posts.map((post) => ({
				...post,
				tags: post.tags.map((t) => t.name),
				images: post.images.map((img) => img.file),
				links: post.links.map((l) => l.url),
			}));
		} catch (error) {
			console.log("findPostsByUserId error:", (error as Error).message);
			return "Помилка при роботі з базою даних";
		}
	},
	findAllPosts: async function () {
		try {
			const posts = await client.post.findMany({
				include: {
					tags: true,
					images: true,
					links: true,
					author: true,
				},
			});

			return posts.map((post) => ({
				...post,
				tags: post.tags.map((t) => t.name),
				images: post.images.map((img) => img.file),
				links: post.links.map((l) => l.url),
			}));
		} catch (error) {
			console.log("findAllPosts error:", (error as Error).message);
			return "Помилка при роботі з базою даних";
		}
	},
	findPostById: async function (id: number) {
		try {
			const post = await client.post.findUnique({
				where: { id },
				include: {
					tags: true,
					images: true,
					links: true,
					author: true,
				},
			});

			if (!post) return "Такого посту не існує";

			return {
				...post,
				tags: post.tags.map((t) => t.name),
				images: post.images.map((img) => img.file),
				links: post.links.map((l) => l.url),
			};
		} catch (error) {
			console.log("findPostById error:", (error as Error).message);
			return "Помилка при роботі з базою даних";
		}
	},
	findAllTags: async function () {
		try {
			return await client.tag.findMany({
				select: { id: true, name: true },
			});
		} catch (error) {
			console.log("findAllTags error:", (error as Error).message);
			return "Помилка при роботі з базою даних";
		}
	},
};

export default userRepository;
