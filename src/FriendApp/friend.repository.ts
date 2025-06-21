import { client } from "../client/prismaClient";

async function findFriendRequestBetweenUsers(fromUserId: number, toUserId: number) {
	
	const fromProfile = await client.user_app_profile.findFirst({
		where: { user_id: fromUserId },
	});
	const toProfile = await client.user_app_profile.findFirst({
		where: { user_id: toUserId },
	});
	if (!fromProfile || !toProfile) {
		throw new Error('Профіль не знайдено');
	}
	return client.user_app_friendship.findFirst({
		where: {
			OR: [
				{ profile1: { id: fromProfile.id }, profile2: { id: toProfile.id } },
				{ profile1: { id: toProfile.id }, profile2: { id: fromProfile.id } },
			],
		},
	});
}

async function createFriendRequest(fromUserId: number, toUserId: number) {

	const fromProfile = await client.user_app_profile.findFirst({
		where: { user_id: fromUserId },
	});
	const toProfile = await client.user_app_profile.findFirst({
		where: { user_id: toUserId },
	});

	if (!fromProfile || !toProfile) {
		throw new Error('Профіль не знайдено');
	}
	return client.user_app_friendship.create({
		data: {
			profile1_id: fromProfile.id,
			profile2_id: toProfile.id,
			accepted: false,
		},
	});
}

async function acceptFriendRequest(id: number) {
	return client.user_app_friendship.update({
		where: { id },
		data: { accepted: true },
	});
}

async function rejectFriendRequest(id: number) {
	return client.user_app_friendship.delete({ where: { id } });
}

async function getPendingRequests(userId: number) {

	const fromProfile = await client.user_app_profile.findFirst({
		where: { user_id: userId },
	});


	if (!fromProfile) {
		throw new Error('Профіль не знайдено');
	}
	return client.user_app_friendship.findMany({
		where: {
			profile2_id: fromProfile.id,
			accepted: false,
		},
		include: {
			profile1: {
				select: {
					user: {
						select: {
							id: true,
							first_name: true,
							last_name: true,
							username: true
						}
					},
					avatars: {
						where: {
							active: true
						},
						select: {
							image: true
						},
						take: 1
					}
				}
			},
		},
	});
}

async function getRecommendedUsers(currentUserId: number) {
	return client.user_app_profile.findMany({
		where: {
			AND: [
				{ id: { not: currentUserId } },
				{
					NOT: {
						OR: [
							{
								friendships_sent: {
									some: {
										profile2: { id: currentUserId },
									},
								},
							},
							{
								friendships_received: {
									some: {
										profile1: { id: currentUserId },
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
					id: true,
					first_name: true,
					last_name: true,
					username: true,
				},
			},
			// Например, взять первый avatar (если хочешь картинку профиля)
			avatars: {
				where: {
					active: true
				},
				select: {
					image: true, // или как у тебя называется поле с картинкой
				},
				take: 1,
			},
		},
	});
}

async function getAllFriends(userId: number) {
	const profile = await client.user_app_profile.findFirst({
		where: { user_id: userId },
	});


	if (!profile) {
		throw new Error('Профіль не знайдено');
	}
	return client.user_app_profile.findMany({
		where: {
			OR: [
				{
					friendships_sent: {
						some: {
							profile2: { id: profile.id },
							accepted: true,
						},
					},
				},
				{
					friendships_received: {
						some: {
							profile1: { id: profile.id },
							accepted: true,
						},
					},
				},
			],
		},
		select: {
			id: true,
			user: {
				select: {
					id: true,
					first_name: true,
					last_name: true,
					username: true,
				},
			},
			avatars: {
				where: {
					active: true
				},
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
	if (!existing || !existing.accepted) {
		throw new Error("Friendship does not exist");
	}

	return client.user_app_friendship.delete({
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
