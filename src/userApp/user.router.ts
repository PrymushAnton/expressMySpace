import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import userController from "./user.controller";

const userRouter = Router()

userRouter.post("/reg", userController.reg)
userRouter.post("/auth", userController.auth)
userRouter.get("/me", authTokenMiddleware, userController.me)
userRouter.post("/send-email-code", userController.sendEmailCode);
userRouter.post("/verify-email-code", userController.checkEmailCode);
userRouter.post("/update", authTokenMiddleware, userController.update)
userRouter.post("/update-first-login", authTokenMiddleware, userController.updateFirstLogin)
userRouter.post("/update-avatar", authTokenMiddleware, userController.updateAvatar)


export default userRouter