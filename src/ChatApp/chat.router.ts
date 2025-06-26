import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import chatController from "./chat.controller";

const chatRouter = Router();

chatRouter.get(
	"/personal-chats",
	authTokenMiddleware,
	chatController.getPersonalChats
);

chatRouter.get(
	"/chat-info/:chatId",
	authTokenMiddleware,
	chatController.getChatInfo
);

chatRouter.get(
	"/group-chats",
	authTokenMiddleware,
	chatController.getGroupChats
);
chatRouter.get(
	"/all-messages/:chatId",
	authTokenMiddleware,
	chatController.getMessages
);

chatRouter.get("/get-base64-from-url/:url", chatController.getBase64FromUrl);

chatRouter.post(
	"/create-group-chat",
	authTokenMiddleware,
	chatController.createChat
);

chatRouter.post(
	"/update-group-chat",
	authTokenMiddleware,
	chatController.updateChat
);

chatRouter.post(
	"/delete-group-chat",
	authTokenMiddleware,
	chatController.deleteChatGroup
);

export default chatRouter;
