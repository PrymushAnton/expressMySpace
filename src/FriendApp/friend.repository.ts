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

async function getRecommendedUsers(currentUserId: number) {
	return client.user.findMany({
		where: {
			AND: [
				{ id: { not: currentUserId } },
				{
					NOT: {
						OR: [
							{
								sentRequests: {
									some: {
										toUser: currentUserId,
									},
								},
							},
							{
								receivedRequests: {
									some: {
										fromUser: currentUserId,
									},
								},
							},
						],
					},
				},
			],
		},
		select: {
			id: true,
			name: true,
			surname: true,
			username: true,
			image: true,
		},
	});
}

async function getAllFriends(userId: number) {
	return client.user.findMany({
		where: {
			OR: [
				{
					sentRequests: {
						some: {
							toUser: userId,
							isAccepted: true,
						},
					},
				},
				{
					receivedRequests: {
						some: {
							fromUser: userId,
							isAccepted: true,
						},
					},
				},
			],
		},
		select: {
			id: true,
			name: true,
			surname: true,
			username: true,
			image: true,
		},
	});
}

async function deleteFriend(fromUser: number, toUser: number) {
	const existing = await findFriendRequestBetweenUsers(fromUser, toUser);
	if (!existing || !existing.isAccepted) {
		throw new Error("Friendship does not exist");
	}

	return client.friendRequest.delete({
		where: {
			id: existing.id,
		},
	});
}

const friendRepository = {
	findFriendRequestBetweenUsers,
	createFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	getPendingRequests,
	getRecommendedUsers,
	getAllFriends,
	deleteFriend,
};

export default friendRepository;
