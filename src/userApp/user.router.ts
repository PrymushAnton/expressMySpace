import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import userController from "./user.controller";


const userRouter = Router()

userRouter.post("/reg", userController.reg)
userRouter.post("/auth", userController.auth)
userRouter.post("/create-user", userController.createUser)
userRouter.get("/me", authTokenMiddleware, userController.me)
userRouter.post("/send-email-code", userController.sendEmailCode);
userRouter.post("/verify-email-code", userController.checkEmailCode);
userRouter.post("/update", authTokenMiddleware, userController.update)
userRouter.post("/update-first-login", authTokenMiddleware, userController.updateFirstLogin)
userRouter.post("/update-avatar", authTokenMiddleware, userController.updateAvatar)
userRouter.post("/update-password", authTokenMiddleware, userController.updatePassword)
userRouter.get("/me/profile", authTokenMiddleware, userController.getMeById)
userRouter.get("/profile/:id", authTokenMiddleware, userController.getAnotherUserById)
userRouter.get("/friend/:id", authTokenMiddleware, userController.getUserProfileById)
userRouter.get("/:id", authTokenMiddleware, userController.getUserById)




export default userRouter 