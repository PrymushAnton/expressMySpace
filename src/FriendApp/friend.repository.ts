import { client } from "../client/prismaClient";

async function findFriendRequestBetweenUsers(fromId: number, toId: number) {
	return client.friendship.findFirst({
		where: {
			OR: [
				{ from: { id: fromId }, to: { id: toId } },
				{ from: { id: toId }, to: { id: fromId } },
			],
		},
	});
}

async function createFriendRequest(fromId: number, toId: number) {
	return client.friendship.create({
		data: {
			from: { connect: { id: fromId } },
			to: { connect: { id: toId } },
			isAccepted: false,
		},
	});
}

async function acceptFriendRequest(id: number) {
	return client.friendship.update({
		where: { id },
		data: { isAccepted: true },
	});
}

async function rejectFriendRequest(id: number) {
	return client.friendship.delete({ where: { id } });
}

async function getPendingRequests(userId: number) {
	return client.friendship.findMany({
		where: {
			to: { id: userId },
			isAccepted: false,
		},
		include: {
			from: true,
		},
	});
}

async function getRecommendedUsers(currentUserId: number) {
	return client.profile.findMany({
		where: {
			AND: [
				{ id: { not: currentUserId } },
				{
					NOT: {
						OR: [
							{
								sentFriendRequests: {
									some: {
										to: { id: currentUserId },
									},
								},
							},
							{
								receivedFriendRequests: {
									some: {
										from: { id: currentUserId },
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
			user: {
				select: {
					first_name: true,
					last_name: true,
					username: true,
					// email, id и т.п. можно добавить, если нужно
				},
			},
			// Например, взять первый avatar (если хочешь картинку профиля)
			avatars: {
				select: {
					image: true, // или как у тебя называется поле с картинкой
				},
				take: 1,
			},
		},
	});
}

async function getAllFriends(userId: number) {
	return client.profile.findMany({
		where: {
			OR: [
				{
					sentFriendRequests: {
						some: {
							to: { id: userId },
							isAccepted: true,
						},
					},
				},
				{
					receivedFriendRequests: {
						some: {
							from: { id: userId },
							isAccepted: true,
						},
					},
				},
			],
		},
		select: {
			id: true,
			user: {
				select: {
					first_name: true,
					last_name: true,
					username: true,
				},
			},
			avatars: {
				select: {
					image: true,
				},
				take: 1,
			},
		},
	});
}

async function deleteFriend(fromUserId: number, toUserId: number) {
	const existing = await findFriendRequestBetweenUsers(fromUserId, toUserId);
	if (!existing || !existing.isAccepted) {
		throw new Error("Friendship does not exist");
	}

	return client.friendship.delete({
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
