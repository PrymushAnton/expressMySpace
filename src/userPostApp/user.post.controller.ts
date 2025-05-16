import { Request, Response } from "express";
import userPostService from "./user.post.service";

//Post
async function createPost(id: number, req: Request, res: Response) {
    const result = await userPostService.createPost(id);
    res.json(result);
}

async function getPostById(id: number, req: Request, res: Response) {
    const result = await userPostService.getPostById(id);
    res.json(result);
}

async function deletePost(id: number, req: Request, res: Response) {
    const result = await userPostService.deletePost(id);
    res.json(result);
}

async function changePost(id: number, req: Request, res: Response) {
    const result = await userPostService.changePost(id);
    res.json(result);
}

//Image
async function createImage(id: number, req: Request, res: Response) {
    const result = await userPostService.createImage(id);
    res.json(result);
}

async function getImageById(id: number, req: Request, res: Response) {
    const result = await userPostService.getImageById(id);
    res.json(result);
}

async function deleteImage(id: number, req: Request, res: Response) {
    const result = await userPostService.deleteImage(id);
    res.json(result);
}

async function changeImage(id: number, req: Request, res: Response) {
    const result = await userPostService.changeImage(id);
    res.json(result);
}

//Tag
async function createTag(id: number, req: Request, res: Response) {
    const result = await userPostService.createTag(id);
    res.json(result);
}

async function getTagById(id: number, req: Request, res: Response) {
    const result = await userPostService.getTagById(id);
    res.json(result);
}

async function deleteTag(id: number, req: Request, res: Response) {
    const result = await userPostService.deleteTag(id);
    res.json(result);
}

async function changeTag(id: number, req: Request, res: Response) {
    const result = await userPostService.changeTag(id);
    res.json(result);
}

const userPostController = {
    deletePost: deletePost,
    createPost: createPost,
    getPostById: getPostById,
    changePost: changePost,
    deleteImage: deleteImage,
    createImage: createImage,
    getImageById: getImageById,
    changeImage: changeImage,
    deleteTag: deleteTag,
    createTag: createTag,
    getTagById: getTagById,
    changeTag: changeTag,
};

export default userPostController;
