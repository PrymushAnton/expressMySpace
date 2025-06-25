import { Request, Response } from "express";
import friendService from "./friend.service";

async function sendFriendRequestHandler(req: Request, res: Response) {
	try {
		const from = res.locals.userId;
		const { to } = req.body;

		if (!to || typeof to !== "number") {
			res.status(400).json({
				status: "error",
				message: "Invalid toUser",
			});
			return;
		}

		const friendRequest = await friendService.sendFriendRequest(from, to);

		if (typeof friendRequest === "string") {
			res.json({
				status: "success",
				data: friendRequest
			});
		} else {
			res.json({
			status: "success",
			friendRequest: JSON.parse(
				JSON.stringify(friendRequest, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
		}
		
	} catch (e: any) {
		res.status(400).json({ status: "error", message: e.message });
	}
}

async function acceptRequestHandler(req: Request, res: Response) {
	try {
		const { requestId } = req.body;
		const result = await friendService.acceptRequest(requestId);
		res.json({
			status: "success",
			friendRequest: JSON.parse(
				JSON.stringify(result, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(400).json({ status: "error", message: e.message });
	}
}

async function rejectRequestHandler(req: Request, res: Response) {
	try {
		const { requestId } = req.body;
		const result = await friendService.rejectRequest(requestId);
		res.json({
			status: "success",
			friendRequest: JSON.parse(
				JSON.stringify(result, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(400).json({ status: "error", message: e.message });
	}
}

async function getPendingRequestsHandler(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const requests = await friendService.getPendingRequests(userId);
		res.json({
			status: "success",
			requests: JSON.parse(
				JSON.stringify(requests, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(400).json({ status: "error", message: e.message });
	}
}

async function getAllUsersHandler(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const users = await friendService.getRecommendedUsers(userId);
		res.json({
			status: "success",
			users: JSON.parse(
				JSON.stringify(users, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(400).json({ status: "error", message: e.message });
	}
}

async function getAllFriendsHandler(req: Request, res: Response) {
	try {
		const userId = res.locals.userId;
		const friends = await friendService.getAllFriends(userId);
		res.json({
			status: "success",
			friends: JSON.parse(
				JSON.stringify(friends, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		res.status(500).json({ status: "error", message: e.message });
	}
}

async function deleteFriendHandler(req: Request, res: Response): Promise<void> {
	try {
		const currentUserId = res.locals.userId;
		const { friendId } = req.body;

		if (!friendId || typeof friendId !== "number") {
			res.status(400).json({
				status: "error",
				message: "Invalid friendId",
			});
			return;
		}

		const result = await friendService.deleteFriend(
			currentUserId,
			friendId
		);

		res.json({
			status: "success",
			friendRequest: JSON.parse(
				JSON.stringify(result, (_, v) =>
					typeof v === "bigint" ? Number(v) : v
				)
			),
		});
	} catch (e: any) {
		console.log(1)
		res.status(400).json({ status: "error", message: e.message });
	}
}

const friendController = {
	sendFriendRequestHandler,
	acceptRequestHandler,
	rejectRequestHandler,
	getPendingRequestsHandler,
	getAllUsersHandler,
	getAllFriendsHandler,
	deleteFriendHandler,
};

export default friendController;
