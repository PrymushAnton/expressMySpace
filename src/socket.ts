import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import {
	AppClientEvents,
	AppServerEvents,
	AuthenticatedSocket,
	SocketData,
} from "./types/socket";
import { socketAuthMiddleware } from "./middlewares/authTokenMiddleware";
import chatSocketController from "./ChatApp/chat.socket.controller";

export function initSocketServer(httpServer: HttpServer) {
	const ioServer = new SocketServer<
		AppClientEvents,
		AppServerEvents,
		{},
		SocketData
	>(httpServer);
	ioServer.use(socketAuthMiddleware);

	ioServer.on("connection", (socket: AuthenticatedSocket) => {
		// console.log("Connected socket", socket.id);
		// socket.join(`user:${socket.data.userId}`);

		socket.on("joinChat", (data) => {
			console.log("joined chat", data.chatId);
			socket.join(`chat:${data.chatId}`);
		});

		socket.on("leaveChat", (data) => {
			console.log("left chat", data.chatId);
			socket.leave(`chat:${data.chatId}`);
		});

		socket.on("sendMessage", async (data) => {
			const { message, chatId, attachedImage } = data;
			const userId = socket.data.userId;
			try {
				const newMessage = await chatSocketController.createMessage(
					message,
					chatId,
					userId,
					attachedImage
				);
				console.log("send", chatId)
				ioServer.to(`chat:${chatId}`).emit("newMessage", {
					message: JSON.parse(
						JSON.stringify(newMessage, (_, v) =>
							typeof v === "bigint" ? Number(v) : v
						)
					),
				});
			} catch (error) {
				console.log(
					"Помилка при створенні повідомлення:",
					(error as Error).message
				);
			}
		});
	});
}
