import { Router } from 'express'
import userPostController from './user.post.controller'

const userPostRouter = Router()

userPostRouter.get("/find-post", userPostController.getPostById)
userPostRouter.post("/delete-post", userPostController.deletePost)
userPostRouter.post("/change-post", userPostController.changePost)
userPostRouter.post("/create-post", userPostController.createPost)

userPostRouter.get("/find-image", userPostController.getImageById)
userPostRouter.post("/delete-image", userPostController.deleteImage)
userPostRouter.post("/change-image", userPostController.changeImage)
userPostRouter.post("/create-image", userPostController.createImage)

userPostRouter.get("/find-tag", userPostController.getTagById)
userPostRouter.post("/delete-tag", userPostController.deleteTag)
userPostRouter.post("/change-tag", userPostController.changeTag)
userPostRouter.post("/create-tag", userPostController.createTag)