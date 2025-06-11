import { Request, Response } from "express";
import friendService from "./friend.service";

async function sendFriendRequestHandler(req: Request, res: Response) {
	try {
		const fromUser = res.locals.userId;
		const { toUser } = req.body;

		if (!toUser || typeof toUser !== "number") {
			res.status(400).json({
				status: "error",
				message: "Invalid toUser",
			});
		}

		const friendRequest = await friendService.sendFriendRequest(
			fromUser,
			toUser
		);
		res.json({ status: "success", friendRequest });
	} catch (e: any) {
		res.status(400).json({ status: "error", message: e.message });
	}
}

async function acceptRequestHandler(req: Request, res: Response) {
	try {
		const { requestId } = req.body;
		const result = await friendService.acceptRequest(requestId);
		res.json({ status: "success", result });
	} catch (e: any) {
		res.status(400).json({ status: "error", message: e.message });
	}
}

async function rejectRequestHandler(req: Request, res: Response) {
	try {
		const { requestId } = req.body;
		const result = await friendService.rejectRequest(requestId);
		res.json({ status: "success", result });
	} catch (e: any) {
		res.status(400).json({ status: "error", message: e.message });
	}
}

async function getPendingRequestsHandler(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const requests = await friendService.getPendingRequests(userId);
		res.json({ status: "success", requests });
	} catch (e: any) {
		res.status(400).json({ status: "error", message: e.message });
	}
}

async function getAllUsersHandler(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const users = await friendService.getRecommendedUsers(userId);
		res.json({ status: "success", users });
	} catch (e: any) {
		res.status(400).json({ status: "error", message: e.message });
	}
}

async function getAllFriendsHandler(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const friends = await friendService.getAllFriends(userId);
		res.json({ status: "success", friends });
	} catch (e: any) {
		res.status(500).json({ status: "error", message: e.message });
	}
}

const friendController = {
	sendFriendRequestHandler,
	acceptRequestHandler,
	rejectRequestHandler,
	getPendingRequestsHandler,
	getAllUsersHandler,
	getAllFriendsHandler,
};

export default friendController;
