import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import postController from "./post.controller";

const postRouter = Router()


postRouter.get("/find-by-user-id/:id", postController.findPostByUserId)
postRouter.get("/find-all-posts", postController.findAllPosts)


postRouter.use(authTokenMiddleware)
postRouter.post("/create", postController.createPost)
postRouter.post("/update", postController.updatePost)
postRouter.post("/delete", postController.deletePost)


export default postRouter