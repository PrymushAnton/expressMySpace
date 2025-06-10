import friendRepository from "./friend.repository";

async function sendFriendRequest(fromUser: number, toUser: number) {
	if (toUser === fromUser) {
		throw new Error("You can't send a request to yourself");
	}

	const existing = await friendRepository.findFriendRequestBetweenUsers(
		fromUser,
		toUser
	);
	if (existing) {
		throw new Error("The request already exists");
	}

	const friendRequest = await friendRepository.createFriendRequest(
		fromUser,
		toUser
	);
	return friendRequest;
}

const friendService = {
    sendFriendRequest: sendFriendRequest
}

export default friendService