import { Request, Response } from "express";
import friendService from "./chat.service";


async function getPersonalChats(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const chat = await friendService.getPersonalChats(userId);
		res.json({
			status: "success",
			chats: JSON.parse(
				JSON.stringify(chat, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(500).json({ status: "error", message: e.message });
	}
}

async function getMessages(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const chatId = req.params.chatId
		const chat = await friendService.getMessages(+chatId);
		res.json({
			status: "success",
			messages: JSON.parse(
				JSON.stringify(chat, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(500).json({ status: "error", message: e.message });
	}
}


async function createChat(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const data = req.body

		

		// const chat = await friendService.getMessages(+chatId);
		// res.json({
		// 	status: "success",
		// 	messages: JSON.parse(
		// 		JSON.stringify(chat, (_, v) =>
		// 			typeof v === "bigint" ? Number(v) : v
		// 		)
		// 	),
		// });
	} catch (e: any) {
		res.status(500).json({ status: "error", message: e.message });
	}
}



const friendController = {
	getPersonalChats,
	getMessages,
};

export default friendController;
