import { CreatePost, FindPost, UpdatePost } from "./types";
import postRepository from "./post.repository";
import { Response } from "../types/types";


async function createPost(data: CreatePost, userId: number): Promise<Response<string>>{

    const result = await postRepository.createPost(data, userId)

    if (!result) return {status: "error", message: "Помилка при створенні посту"}
    if (typeof(result) === "string") return {status: "error", message: result}
    return {status: "success", data: "Пост було успішно створено"}
}

async function updatePost(data: UpdatePost): Promise<Response<string>>{
    const result = await postRepository.updatePost(data)

 	if (!result) return {status: "error", message: "Помилка при видаленні посту"}
    if (typeof(result) === "string") return {status: "error", message: result}
    return {status: "success", data: "Пост було успішно відредаговано"}
}


async function deletePost(postId: number): Promise<Response<string>>{
    const result = await postRepository.deletePost(postId)

 	if (!result) return {status: "error", message: "Помилка при видаленні посту"}
    if (typeof(result) === "string") return {status: "error", message: result}
    return {status: "success", data: "Пост було успішно видалено"}
}


async function findPostByUserId(userId: number): Promise<Response<FindPost>>{
    const result = await postRepository.findPostByUserId(userId)

 	if (!result) return {status: "error", message: "Помилка при отриманні постів"}
    if (typeof(result) === "string") return {status: "error", message: result}
    return {status: "success", data: result}
}


async function findAllPosts(): Promise<Response<FindPost[]>>{

    const result = await postRepository.findAllPosts()

 	if (!result) return {status: "error", message: "Помилка при отриманні постів"}
    if (typeof(result) === "string") return {status: "error", message: result}
    return {status: "success", data: result}
}



const userService = {
	createPost: createPost,
	updatePost: updatePost,
	deletePost: deletePost,
	findPostByUserId: findPostByUserId,
	findAllPosts: findAllPosts
};

export default userService;