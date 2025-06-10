import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import friendController from "./friend.controller";

const friendRouter = Router()

friendRouter.post('/friend/send-friend-request', authTokenMiddleware, friendController.sendFriendRequestHandler)

export default friendRouter