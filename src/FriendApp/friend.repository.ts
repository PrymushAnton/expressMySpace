import { client } from "../client/prismaClient";

async function findFriendRequestBetweenUsers(fromUser: number, toUser: number) {
	return client.friendRequest.findFirst({
		where: {
			OR: [
				{ fromUser, toUser },
				{ fromUser: toUser, toUser: fromUser },
			],
		},
	});
}

async function createFriendRequest(fromUser: number, toUser: number) {
	return client.friendRequest.create({
		data: {
			fromUser,
			toUser,
			isAccepted: false,
		},
	});
}

async function acceptFriendRequest(id: number) {
	return client.friendRequest.update({
		where: { id },
		data: { isAccepted: true },
	});
}

async function rejectFriendRequest(id: number) {
	return client.friendRequest.delete({ where: { id } });
}

async function getPendingRequests(userId: number) {
	return client.friendRequest.findMany({
		where: {
			toUser: userId,
			isAccepted: false,
		},
		include: {
			fromUserDetails: true,
		},
	});
}

async function getAllUsers() {
	return client.user.findMany({});
}

const friendRepository = {
	findFriendRequestBetweenUsers,
	createFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	getPendingRequests,
	getAllUsers,
};

export default friendRepository;
