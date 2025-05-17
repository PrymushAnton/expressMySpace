import { Request, Response } from "express";
import postService from "./post.service"
import { CreatePost, UpdatePost } from "./types";


async function createPost(req: Request, res: Response){
    const data: CreatePost = req.body
    const userId: number = res.locals.userId

    const result = await postService.createPost(data, userId)

    res.json(result)
}


async function updatePost(req: Request, res: Response){
    const data: UpdatePost = req.body

    const result = await postService.updatePost(data)

    res.json(result)
}


async function deletePost(req: Request, res: Response){
    const {id}: {id: number} = req.body

    const result = await postService.deletePost(id)

    res.json(result)
}


async function findPostByUserId(req: Request, res: Response){
    const id = req.params.id
    const result = await postService.findPostByUserId(+id)

    res.json(result)
}

async function findAllPosts(req: Request, res: Response){
    const result = await postService.findAllPosts()

    res.json(result)
}


const userController = {
    createPost: createPost,
    updatePost: updatePost,
	deletePost: deletePost,
	findPostByUserId: findPostByUserId,
    findAllPosts: findAllPosts
}

export default userController