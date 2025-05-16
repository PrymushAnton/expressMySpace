import userPostRepository from "./user.post.repository";
import { IError, ISuccess } from "../types/types";
import { userPost, CreatePost, image, tag } from "./types";

//Post
async function getPostById(id: number): Promise<ISuccess<userPost> | IError> {
    const post = await userPostRepository.getPostById(id);

    if (!post) {
        return { status: "error", message: "Post was not found" };
    }

    return { status: "success", data: post };
}

async function createPost(
    data: CreatePost
): Promise<ISuccess<userPost> | IError> {
    const post = await userPostRepository.createOnePost(data);

    if (!post) {
        return { status: "error", message: "Error when creating a post" };
    }

    return { status: "success", data: post };
}

async function deletePost(id: number): Promise<ISuccess<userPost> | IError> {
    const post = await userPostRepository.deletePost(id);

    if (!post) {
        return { status: "error", message: "Error when deleting a post" };
    }

    return { status: "success", data: post };
}

async function changePost(id: number): Promise<ISuccess<userPost> | IError> {
    const post = await userPostRepository.deletePost(id);

    if (!post) {
        return { status: "error", message: "Error when deleting a post" };
    }

    return { status: "success", data: post };
}

//Image
async function getImageById(id: number): Promise<ISuccess<image> | IError> {
    const image = await userPostRepository.getImageById(id);

    if (!image) {
        return { status: "error", message: "Image was not found" };
    }

    return { status: "success", data: image };
}

async function createImage(data: CreatePost): Promise<ISuccess<image> | IError> {
    const image = await userPostRepository.createOneImage(data);

    if (!image) {
        return { status: "error", message: "Error when creating a Image" };
    }

    return { status: "success", data: image };
}

async function deleteImage(id: number): Promise<ISuccess<image> | IError> {
    const image = await userPostRepository.deleteImage(id);

    if (!image) {
        return { status: "error", message: "Error when deleting a Image" };
    }

    return { status: "success", data: image };
}

async function changeImage(id: number): Promise<ISuccess<image> | IError> {
    const image = await userPostRepository.deleteImage(id);

    if (!image) {
        return { status: "error", message: "Error when deleting a Image" };
    }

    return { status: "success", data: image };
}

//Tag
async function getTagById(id: number): Promise<ISuccess<tag> | IError> {
    const tag = await userPostRepository.getTagById(id);

    if (!tag) {
        return { status: "error", message: "Tag was not found" };
    }

    return { status: "success", data: tag };
}

async function createTag(data: CreatePost): Promise<ISuccess<tag> | IError> {
    const tag = await userPostRepository.createOneTag(data);

    if (!tag) {
        return { status: "error", message: "Error when creating a Tag" };
    }

    return { status: "success", data: tag };
}

async function deleteTag(id: number): Promise<ISuccess<tag> | IError> {
    const tag = await userPostRepository.deleteTag(id);

    if (!tag) {
        return { status: "error", message: "Error when deleting a Tag" };
    }

    return { status: "success", data: tag };
}

async function changeTag(id: number): Promise<ISuccess<tag> | IError> {
    const tag = await userPostRepository.changeTag(id);

    if (!tag) {
        return { status: "error", message: "Error when deleting a Tag" };
    }

    return { status: "success", data: tag };
}

const userPostService = {
    getPostById: getPostById,
    createPost: createPost,
    deletePost: deletePost,
    changePost: changePost,
    getImageById: getImageById,
    createImage: createImage,
    deleteImage: deleteImage,
    changeImage: changeImage,
    getTagById: getTagById,
    createTag: createTag,
    deleteTag: deleteTag,
    changeTag: changeTag,
};

export default userPostService;
