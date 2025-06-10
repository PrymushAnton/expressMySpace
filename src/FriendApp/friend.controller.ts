import { Request, Response } from "express";
import friendService from "./friend.service";

async function sendFriendRequestHandler(req: Request, res: Response) {
	try {
		const fromUser = res.locals.userId;
		const { toUser } = req.body;

		if (!toUser || typeof toUser !== "number") {
			res.status(400).json({
				status: "error",
				message: "wrong toUser",
			});
			return;
		}

		const friendRequest = await friendService.sendFriendRequest(
			fromUser,
			toUser
		);

		res.json({ status: "success", friendRequest });
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message || "error backend friend request",
		});
	}
}

const friendController = {
    sendFriendRequestHandler: sendFriendRequestHandler
}

export default friendController