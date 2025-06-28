import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import postController from "./post.controller";

const postRouter = Router()


postRouter.get("/find-posts-by-user-id/:id", postController.findPostsByUserId)
postRouter.get("/find-all-posts", postController.findAllPosts)
postRouter.get("/find-all-tags", postController.findAllTags)
postRouter.get("/find-post-by-id/:id", postController.findPostById)

postRouter.get("/get-base64-from-url/:url", postController.getBase64FromUrl)




postRouter.use(authTokenMiddleware)
postRouter.post("/create", postController.createPost)
postRouter.post("/update", postController.updatePost)
postRouter.post("/delete", postController.deletePost)


export default postRouter