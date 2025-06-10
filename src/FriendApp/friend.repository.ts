import { client } from "../client/prismaClient";

async function findFriendRequestBetweenUsers(
	fromUser: number,
	toUser: number
) {
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

const friendRepository = {
    findFriendRequestBetweenUsers: findFriendRequestBetweenUsers,
    createFriendRequest: createFriendRequest
}

export default friendRepository