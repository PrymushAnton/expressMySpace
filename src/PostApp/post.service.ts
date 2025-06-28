import { CreatePost, FindPost, UpdatePost } from "./types";
import postRepository from "./post.repository";
import { Response } from "../types/types";

async function createPost(
	data: CreatePost,
	userId: number
): Promise<Response<string>> {
	const result = await postRepository.createPost(data, userId);

	if (!result)
		return { status: "error", message: "Помилка при створенні посту" };
	if (typeof result === "string") return { status: "error", message: result };
	return { status: "success", data: "Пост було успішно створено" };
}

async function updatePost(data: UpdatePost): Promise<Response<string>> {
	const result = await postRepository.updatePost(data);

	if (!result)
		return { status: "error", message: "Помилка при видаленні посту" };
	if (typeof result === "string") return { status: "error", message: result };
	return { status: "success", data: "Пост було успішно відредаговано" };
}

async function deletePost(postId: number): Promise<Response<string>> {
	const result = await postRepository.deletePost(postId);

	if (!result)
		return { status: "error", message: "Помилка при видаленні посту" };
	if (typeof result === "string") return { status: "error", message: result };
	return { status: "success", data: "Пост було успішно видалено" };
}

async function findPostsByUserId(
	userId: number
): Promise<Response<FindPost[]>> {
	const result = await postRepository.findPostsByUserId(userId);

	if (!result)
		return { status: "error", message: "Помилка при отриманні постів" };
	if (typeof result === "string") return { status: "error", message: result };

	return {
		status: "success",
		data: JSON.parse(
			JSON.stringify(result, (_, v) =>
				typeof v === "bigint" ? Number(v) : v
			)
		),
	};
}

async function findAllPosts(): Promise<Response<FindPost[]>> {
	const result = await postRepository.findAllPosts();

	if (!result)
		return { status: "error", message: "Помилка при отриманні постів" };
	if (typeof result === "string") return { status: "error", message: result };
    return {
		status: "success",
		data: JSON.parse(
			JSON.stringify(result, (_, v) =>
				typeof v === "bigint" ? Number(v) : v
			)
		),
	};
}

async function findPostById(id: number): Promise<Response<FindPost>> {
	const result = await postRepository.findPostById(id);

	if (!result)
		return { status: "error", message: "Помилка при отриманні посту" };
	if (typeof result === "string") return { status: "error", message: result };
	return {
		status: "success",
		data: JSON.parse(
			JSON.stringify(result, (_, v) =>
				typeof v === "bigint" ? Number(v) : v
			)
		),
	};
}

async function findAllTags() {
	const result = await postRepository.findAllTags();

	if (!result)
		return { status: "error", message: "Помилка при отриманні постів" };
	if (typeof result === "string") return { status: "error", message: result };
	return {
		status: "success",
		data: JSON.parse(
			JSON.stringify(result, (_, v) =>
				typeof v === "bigint" ? Number(v) : v
			)
		),
	};
}


const userService = {
	createPost: createPost,
	updatePost: updatePost,
	deletePost: deletePost,
	findPostsByUserId: findPostsByUserId,
	findAllPosts: findAllPosts,
	findAllTags: findAllTags,
	findPostById: findPostById,
};

export default userService;
