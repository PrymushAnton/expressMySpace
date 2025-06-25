import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import friendController from "./chat.controller";

const chatRouter = Router();

chatRouter.get(
	"/personal-chats",
	authTokenMiddleware,
	friendController.getPersonalChats
);
chatRouter.get(
	"/all-messages/:chatId",
	authTokenMiddleware,
	friendController.getMessages
);

chatRouter.post(
	"/create-chat",
	authTokenMiddleware,
	friendController.getMessages
);

export default chatRouter