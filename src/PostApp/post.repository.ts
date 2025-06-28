import { client } from "../client/prismaClient";
import { uploadImage } from "../tools/upload-image";
import { CreatePost, UpdatePost } from "./types";
import { BASE_MEDIA_URL } from "../config/base-media-url";
import { deleteImage } from "../tools/delete-image";

async function createPost(data: CreatePost, userId: number) {
	const { existingTags, newTags, images, link, ...otherData } = data;
	const allTags = [...existingTags, ...newTags];
	try {
		const profile = await client.user_app_profile.findUnique({
			where: {
				user_id: userId,
			},
		});

		if (!profile) {
			throw new Error("Профіль не знайдено");
		}

		const post = await client.post_app_post.create({
			data: {
				...otherData,
				author_id: profile.id,
				tags: {
					create: allTags.map((name) => ({
						tag: {
							connectOrCreate: {
								where: { name },
								create: { name },
							},
						},
					})),
				},
				links: {
					create: link.map((url) => ({ url })),
				},
				topic: ""
			},
			include: {
				tags: true,
				images: true,
				links: true,
			},
		});

		if (images.length > 0) {
			const uploadedImages = await Promise.all(
				images.map((image) => uploadImage(image, "posts"))
			);

			for (const img of uploadedImages) {
				const image = await client.post_app_image.create({
					data: {
						file: img.file,
						filename: img.fileName,
						uploaded_at: new Date(),
					},
				});

				await client.post_app_post_images.create({
					data: {
						post_id: post.id,
						image_id: image.id,
					},
				});
			}
		}

		const fullPost = await client.post_app_post.findUnique({
			where: { id: post.id },
			include: {
				tags: {
					select: {
						tag: {
							select: {
								name: true,
							},
						},
					},
				},
				images: {
					select: {
						image: {
							select: {
								file: true,
							},
						},
					},
				},
				links: {
					select: {
						url: true,
					},
				},
			},
		});

		if (!fullPost) {
			throw new Error("Пост не знайдено");
		}

		const transformedPost = {
			...fullPost,
			tags: fullPost.tags.map((t) => t.tag.name),
			links: fullPost.links.map((l) => l.url),
			images: fullPost.images.map(
				(img) => `${BASE_MEDIA_URL}/${img.image.file}`
			),
		};

		return transformedPost;
	} catch (error) {
		console.log("CreatePost error:", (error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

async function updatePost(data: UpdatePost) {
	const { existingTags, newTags, images, link, id, ...otherData } = data;
	try {
		const post = await client.post_app_post.update({
			where: { id },
			data: {
				...otherData,
				tags: {
					deleteMany: {},
					create: [
						...existingTags.map((name) => ({
							tag: {
								connect: { name },
							},
						})),
						...newTags.map((name) => ({
							tag: {
								create: { name },
							},
						})),
					],
				},
			},
		});

		const existsingImages = await client.post_app_post_images.findMany({
			where: {
				post_id: id,
			},
			select: {
				image: {
					select: {
						file: true,
					},
				},
			},
		});

		await Promise.all(
			existsingImages.map((img) => deleteImage(img.image.file))
		);

		await client.post_app_post_images.deleteMany({
			where: {
				post_id: id,
			},
		});

		await client.post_app_image.deleteMany({
			where: {
				posts: {
					none: {},
				},
			},
		});

		if (images.length > 0) {
			const uploadedImages = await Promise.all(
				images.map((image) => uploadImage(image, "posts"))
			);
			for (const img of uploadedImages) {
				const image = await client.post_app_image.create({
					data: {
						file: img.file,
						filename: img.fileName,
						uploaded_at: new Date(),
					},
				});

				await client.post_app_post_images.create({
					data: {
						post_id: id,
						image_id: image.id,
					},
				});
			}
		}

		await client.post_app_link.deleteMany({ where: { post_id: id } });

		if (link.length > 0) {
			await client.post_app_link.createMany({
				data: link.map((url) => ({ url: url, post_id: id })),
			});
		}

		const fullPost = await client.post_app_post.findUnique({
			where: { id: id },
			include: {
				tags: {
					select: {
						tag: {
							select: {
								name: true,
							},
						},
					},
				},
				images: {
					select: {
						image: {
							select: {
								file: true,
							},
						},
					},
				},
				links: {
					select: {
						url: true,
					},
				},
			},
		});

		if (!fullPost) {
			throw new Error("Пост не знайдено");
		}

		const transformedPost = {
			...fullPost,
			tags: fullPost.tags.map((t) => t.tag.name),
			links: fullPost.links.map((l) => l.url),
			images: fullPost.images.map(
				(img) => `${BASE_MEDIA_URL}/${img.image.file}`
			),
		};

		return transformedPost;
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
			const existsingImages = await client.post_app_post_images.findMany({
				where: {
					post_id: postId,
				},
				select: {
					image: {
						select: {
							file: true,
						},
					},
				},
			});

			await Promise.all(
				existsingImages.map((img) => deleteImage(img.image.file))
			);

			await client.post_app_post_images.deleteMany({
				where: { post_id: postId },
			});
			await client.post_app_image.deleteMany({
				where: {
					posts: {
						none: {},
					},
				},
			});
			await client.post_app_link.deleteMany({
				where: { post_id: postId },
			});
			await client.post_app_post_tags.deleteMany({
				where: { post_id: postId },
			});
			const post = await client.post_app_post.delete({
				where: { id: postId },
			});
			return post;
		} catch (error) {
			console.log("DeletePost error:", (error as Error).message);
			return "Помилка при роботі з базою даних";
		}
	},
	findPostsByUserId: async function (userId: number) {
		try {
			const profile = await client.user_app_profile.findUnique({
				where: {
					user_id: userId,
				},
			});

			if (!profile) {
				throw new Error("Профіль не знайдено");
			}

			const posts = await client.post_app_post.findMany({
				where: { author_id: profile.id },
				orderBy: {
					id: "desc"
				},
				include: {
					tags: {
						select: {
							tag: {
								select: {
									name: true,
								},
							},
						},
					},
					images: {
						select: {
							image: {
								select: {
									file: true,
								},
							},
						},
					},
					links: true,
					author: {
						select: {
							user: {
								select: {
									first_name: true,
									last_name: true,
									username: true,
									id: true,
									profile: {
										select: {
											avatars: {
												where: {
													active: true
												},
												select: {
													image: true,
												},
											},
										},
									},
								},
							},
						},
					},
					likes: true,
					views: true,
				},
			});

			const transformedPosts = posts.map((fullPost) => ({
				...fullPost,
				tags: fullPost.tags.map((t) => t.tag.name),
				links: fullPost.links.map((l) => l.url),
				images: fullPost.images.map(
					(img) => `${BASE_MEDIA_URL}/${img.image.file}`
				),
				likes: fullPost.likes.length,
				views: fullPost.views.length,
			}));

			return transformedPosts;
		} catch (error) {
			console.log("findPostsByUserId error:", (error as Error).message);
			return "Помилка при роботі з базою даних";
		}
	},
	findAllPosts: async function () {
		try {
			const posts = await client.post_app_post.findMany({
				orderBy: {
					id: "desc"
				},
				include: {
					tags: {
						select: {
							tag: {
								select: {
									name: true,
								},
							},
						},
					},
					images: {
						select: {
							image: {
								select: {
									file: true,
								},
							},
						},
					},
					links: true,
					author: {
						select: {
							user: {
								select: {
									first_name: true,
									last_name: true,
									username: true,
									id: true,
									email: true,
									profile: {
										select: {
											avatars: {
												where: {
													active: true,
												},
												select: {
													image: true,
												},
												take: 1,
											},
										},
									},
								},
							},
						},
					},
					views: true,
					likes: true,
				},
			});

			const transformedPosts = posts.map((fullPost) => ({
				...fullPost,
				tags: fullPost.tags.map((t) => t.tag.name),
				links: fullPost.links.map((l) => l.url),
				images: fullPost.images.map(
					(img) => `${BASE_MEDIA_URL}/${img.image.file}`
				),
				likes: fullPost.likes.length,
				views: fullPost.views.length,
			}));

			return transformedPosts;
		} catch (error) {
			console.log("findAllPosts error:", (error as Error).message);
			return "Помилка при роботі з базою даних";
		}
	},
	findPostById: async function (id: number) {
		try {
			const post = await client.post_app_post.findUnique({
				where: { id },
				include: {
					tags: {
						select: {
							tag: {
								select: {
									name: true,
								},
							},
						},
					},
					images: {
						select: {
							image: {
								select: {
									file: true,
								},
							},
						},
					},
					links: true,
					author: true,
					views: true,
					likes: true,
				},
			});

			if (!post) {
				throw new Error("Пост не знайдено");
			}

			const transformedPost = {
				...post,
				tags: post.tags.map((t) => t.tag.name),
				links: post.links.map((l) => l.url),
				images: post.images.map(
					(img) => `${BASE_MEDIA_URL}/${img.image.file}`
				),
				likes: post.likes.length,
				views: post.views.length,
			};

			return transformedPost;
		} catch (error) {
			console.log("findPostById error:", (error as Error).message);
			return "Помилка при роботі з базою даних";
		}
	},
	findAllTags: async function () {
		try {
			return await client.post_app_tag.findMany({
				select: { id: true, name: true },
			});
		} catch (error) {
			console.log("findAllTags error:", (error as Error).message);
			return "Помилка при роботі з базою даних";
		}
	},
};

export default userRepository;
