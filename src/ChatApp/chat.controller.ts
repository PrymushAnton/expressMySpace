import { Request, Response } from "express";
import friendService from "./chat.service";
import fs from "fs";
import path from "path";

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

async function getChatInfo(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const chatId = req.params.chatId
		const chat = await friendService.getChatInfo(userId, +chatId);
		res.json({
			status: "success",
			chat: JSON.parse(
				JSON.stringify(chat, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(500).json({ status: "error", message: e.message });
	}
}

async function getGroupChats(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const chat = await friendService.getGroupChats(userId);
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
		const {
			name,
			avatar,
			participants
		} = req.body

		const chat = await friendService.createChatGroup(userId, name, participants, avatar);
		res.json({
			status: "success",
			chat: JSON.parse(
				JSON.stringify(chat, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(500).json({ status: "error", message: e.message });
	}
}

async function updateChat(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const {
			chatId,
			name,
			avatar,
			participants
		} = req.body

		const chat = await friendService.updateChatGroup(chatId, userId, name, participants, avatar);
		res.json({
			status: "success",
			chat: JSON.parse(
				JSON.stringify(chat, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(500).json({ status: "error", message: e.message });
	}
}

async function deleteChatGroup(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const {
			chatId
		} = req.body

		const chat = await friendService.deleteChatGroup(chatId);
		res.json({
			status: "success",
			chat: JSON.parse(
				JSON.stringify(chat, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(500).json({ status: "error", message: e.message });
	}
}


async function getBase64FromUrl(req: Request, res: Response){
	const url = decodeURIComponent(req.params.url)
	if (!url) {
		console.log(1)
		res.status(400).json({ status: "error", message: "Image URL is required" });
		return 
	}

	const mediaIndex = url.indexOf("/media/");
	if (mediaIndex === -1) {
		console.log(2)
		res.status(400).json({ status: "error", message: "Invalid media path" });
		return 
	}
	const relativeMediaPath = url.slice(mediaIndex + 1);

	const fullPath = path.resolve(relativeMediaPath);

	fs.readFile(fullPath, (err, data) => {
		if (err) {
			console.error("Read error:", err);
			return res.status(404).json({status: "error", message: "Image not found" });
		}

		const ext = path.extname(fullPath).slice(1);
		const mime = `image/${ext === "jpg" ? "jpeg" : ext}`;
		const base64 = `data:${mime};base64,${data.toString("base64")}`;

		res.json({status: "success", data: base64 });
	});
}


const friendController = {
	getPersonalChats,
	getMessages,
	createChat,
	getGroupChats,
	getChatInfo,
	updateChat,
	getBase64FromUrl,
	deleteChatGroup
};

export default friendController;
