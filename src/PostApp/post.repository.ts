import { client } from "../client/prismaClient";
import { CreatePost, UpdatePost } from "./types";

async function createPost(data: CreatePost, userId: number) {
	const {
		existingTags = [],
		newTags = [],
		images = [],
		link = [],
		...otherData
	} = data;

	try {
		const post = await client.post.create({
			data: {
				...otherData,
				userId,
				link: {
					create: link.map((url) => ({ url })),
				},
			},
		});

		if (newTags.length > 0) {
			await client.tag.createMany({
				data: newTags.map((tag) => ({ name: tag })),
			});
		}

		const foundTags = await client.tag.findMany({
			where: {
				name: {
					in: [...existingTags, ...newTags],
				},
			},
		});

		if (foundTags.length > 0) {
			await client.tagToPost.createMany({
				data: foundTags.map((tag) => ({
					tagId: tag.id,
					postId: post.id,
				})),
			});
		}

		if (images.length > 0) {
			await client.image.createMany({
				data: images.map((image) => ({
					base64: image,
					postId: post.id,
				})),
			});
		}

		const fullPost = await client.post.findUnique({
			where: { id: post.id },
			include: {
				tags: true,
				images: true,
				link: true,
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
		images = [],
		link = [],
		id,
		...otherData
	} = data;

	try {
		const post = await client.post.update({
			where: { id },
			data: otherData,
		});

		if (newTags.length > 0) {
			await client.tag.createMany({
				data: newTags.map((tag) => ({ name: tag })),
			});
		}

		const foundTags = await client.tag.findMany({
			where: {
				name: {
					in: [...existingTags, ...newTags],
				},
			},
		});

		await client.tagToPost.deleteMany({ where: { postId: post.id } });

		if (foundTags.length > 0) {
			await client.tagToPost.createMany({
				data: foundTags.map((tag) => ({
					tagId: tag.id,
					postId: post.id,
				})),
			});
		}

		await client.image.deleteMany({ where: { postId: post.id } });

		if (images.length > 0) {
			await client.image.createMany({
				data: images.map((image) => ({
					base64: image,
					postId: post.id,
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
				link: true,
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
			await client.tagToPost.deleteMany({ where: { postId } });
			await client.image.deleteMany({ where: { postId } });
			await client.link.deleteMany({ where: { postId } });

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
				where: { userId },
				include: {
					tags: { include: { tag: true } },
					images: true,
					link: true,
				},
			});

			return posts.map((post) => ({
				...post,
				tags: post.tags.map((t) => t.tag.name),
				images: post.images.map((img) => img.base64),
				link: post.link.map((l) => l.url),
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
					tags: { include: { tag: true } },
					images: true,
					link: true,
				},
			});

			return posts.map((post) => ({
				...post,
				tags: post.tags.map((t) => t.tag.name),
				images: post.images.map((img) => img.base64),
				link: post.link.map((l) => l.url),
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
					tags: { include: { tag: true } },
					images: true,
					link: true,
				},
			});

			if (!post) return "Такого посту не існує";

			return {
				...post,
				tags: post.tags.map((t) => t.tag.name),
				images: post.images.map((img) => img.base64),
				link: post.link.map((l) => l.url),
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
