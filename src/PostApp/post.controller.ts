import { Request, Response } from "express";
import postService from "./post.service"
import { CreatePost, UpdatePost } from "./types";
import fs from "fs";
import path from "path";

async function createPost(req: Request, res: Response){
    const data = req.body
    const userId: number = res.locals.userId
    
    const result = await postService.createPost(data, +userId)

    res.json(result)
}


async function updatePost(req: Request, res: Response){
    const data: UpdatePost = req.body
    // data.id = +data.id

    const result = await postService.updatePost(data)

    res.json(result)
}


async function deletePost(req: Request, res: Response){
    const {id}: {id: number} = req.body

    const result = await postService.deletePost(+id)

    res.json(result)
}


async function findPostsByUserId(req: Request, res: Response){
    const id = req.params.id
    const result = await postService.findPostsByUserId(+id)

    res.json(result)
}

async function findPostById(req: Request, res: Response){
    const id = req.params.id
    const result = await postService.findPostById(+id)

    res.json(result)
}

async function findAllPosts(req: Request, res: Response){
    const result = await postService.findAllPosts()
    

    res.json(result)
}

async function findAllTags(req: Request, res: Response){
    const result = await postService.findAllTags()

    res.json(result)
}

async function getBase64FromUrl(req: Request, res: Response){
    const url = decodeURIComponent(req.params.url)
    if (!url) {
		res.status(400).json({ error: "Image URL is required" });
        return 
	}

	const mediaIndex = url.indexOf("/media/");
	if (mediaIndex === -1) {
		res.status(400).json({ error: "Invalid media path" });
        return 
	}
	const relativeMediaPath = url.slice(mediaIndex + 1);

	const fullPath = path.resolve(relativeMediaPath);

	fs.readFile(fullPath, (err, data) => {
		if (err) {
			console.error("Read error:", err);
			return res.status(404).json({ error: "Image not found" });
		}

		const ext = path.extname(fullPath).slice(1);
		const mime = `image/${ext === "jpg" ? "jpeg" : ext}`;
		const base64 = `data:${mime};base64,${data.toString("base64")}`;

		res.json({ base64 });
	});
}


const userController = {
    createPost: createPost,
    updatePost: updatePost,
	deletePost: deletePost,
	findPostsByUserId: findPostsByUserId,
    findAllPosts: findAllPosts,
    findAllTags: findAllTags,
    findPostById: findPostById,
    getBase64FromUrl: getBase64FromUrl
}

export default userController