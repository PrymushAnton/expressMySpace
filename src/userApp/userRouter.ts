import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";

const userRouter = Router()

userRouter.post("/reg", )
userRouter.post("/auth", )
userRouter.get("/me", authTokenMiddleware, )

export default userRouter