import friendRepository from "./friend.repository";

async function sendFriendRequest(fromUser: number, toUser: number) {
	if (toUser === fromUser)
		throw new Error("You can't send a request to yourself");

	const existing = await friendRepository.findFriendRequestBetweenUsers(
		fromUser,
		toUser
	);
	if (existing) throw new Error("Request already exists");

	return friendRepository.createFriendRequest(fromUser, toUser);
}

async function acceptRequest(requestId: number) {
	return friendRepository.acceptFriendRequest(requestId);
}

async function rejectRequest(requestId: number) {
	return friendRepository.rejectFriendRequest(requestId);
}

async function getPendingRequests(userId: number) {
	return friendRepository.getPendingRequests(userId);
}

async function getAllUsers() {
	return friendRepository.getAllUsers();
}

const friendService = {
	sendFriendRequest,
	acceptRequest,
	rejectRequest,
	getPendingRequests,
	getAllUsers,
};

export default friendService;
