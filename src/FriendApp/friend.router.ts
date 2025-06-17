import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import friendController from "./friend.controller";
import { client } from "../client/prismaClient";

const friendRouter = Router();

friendRouter.post("/send-friend-request", authTokenMiddleware, friendController.sendFriendRequestHandler);
friendRouter.post("/accept-request", authTokenMiddleware, friendController.acceptRequestHandler);
friendRouter.post("/reject-request", authTokenMiddleware, friendController.rejectRequestHandler);
friendRouter.get("/pending-requests", authTokenMiddleware, friendController.getPendingRequestsHandler);
friendRouter.get("/all-users", authTokenMiddleware, friendController.getAllUsersHandler);
friendRouter.get("/all-friends", authTokenMiddleware, friendController.getAllFriendsHandler);
friendRouter.post("/delete-friend", authTokenMiddleware, friendController.deleteFriendHandler);
friendRouter.get("/check/:from/:to", async (req, res) => {
	const { from, to } = req.params;
	const friendship = await client.friendRequest.findFirst({
		where: {
			isAccepted: true,
			OR: [
				{ fromUser: +from, toUser: +to },
				{ fromUser: +to, toUser: +from },
			],
		},
	});
	res.json({ isFriend: !!friendship });
});

export default friendRouter;