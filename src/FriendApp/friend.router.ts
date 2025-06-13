import { Router } from "express";
import { authTokenMiddleware } from "../middlewares/authTokenMiddleware";
import friendController from "./friend.controller";

const friendRouter = Router();

friendRouter.post("/send-friend-request", authTokenMiddleware, friendController.sendFriendRequestHandler);
friendRouter.post("/accept-request", authTokenMiddleware, friendController.acceptRequestHandler);
friendRouter.post("/reject-request", authTokenMiddleware, friendController.rejectRequestHandler);
friendRouter.get("/pending-requests", authTokenMiddleware, friendController.getPendingRequestsHandler);
friendRouter.get("/all-users", authTokenMiddleware, friendController.getAllUsersHandler);
friendRouter.get("/all-friends", authTokenMiddleware, friendController.getAllFriendsHandler);
friendRouter.post("/delete-friend", authTokenMiddleware, friendController.deleteFriendHandler);

export default friendRouter;