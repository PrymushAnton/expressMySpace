import { client } from "../client/prismaClient";

async function findFriendRequestBetweenUsers(
	fromUserId: number,
	toUserId: number
) {
	const fromProfile = await client.user_app_profile.findFirst({
		where: { user_id: fromUserId },
	});
	const toProfile = await client.user_app_profile.findFirst({
		where: { user_id: toUserId },
	});
	if (!fromProfile || !toProfile) {
		throw new Error("Профіль не знайдено");
	}
	return client.user_app_friendship.findFirst({
		where: {
			OR: [
				{
					profile1: { id: fromProfile.id },
					profile2: { id: toProfile.id },
				},
				{
					profile1: { id: toProfile.id },
					profile2: { id: fromProfile.id },
				},
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
		throw new Error("Профіль не знайдено");
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
	const friendship = await client.user_app_friendship.update({
		where: { id },
		data: { accepted: true },
	});
	const randomSuffix = Math.random().toString(36).slice(2, 8);
	const chatName = `${Date.now()}-${randomSuffix}`;
	const personalChat = await client.chat_app_chatgroup.create({
		data: {
			name: chatName,
			is_personal_chat: true,
			avatar: null,
			admin_id: friendship.profile1_id,
		},
	});

	const members = await client.chat_app_chatgroup_members.createMany({
		data: [
			{
				chatgroup_id: personalChat.id,
				profile_id: friendship.profile1_id,
			},
			{
				chatgroup_id: personalChat.id,
				profile_id: friendship.profile2_id,
			},
		],
	});

	return friendship;
}

async function rejectFriendRequest(id: number) {
	return client.user_app_friendship.delete({ where: { id } });
}

async function getPendingRequests(userId: number) {
	const fromProfile = await client.user_app_profile.findFirst({
		where: { user_id: userId },
	});
	if (!fromProfile) {
		throw new Error("Профіль не знайдено");
	}
	return client.user_app_friendship.findMany({
		where: {
			profile2_id: fromProfile.id,
			accepted: false,
		},
		select: {
			id: true,
			profile1: {
				select: {
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
							active: true,
						},
						select: {
							image: true,
						},
						take: 1,
					},
				},
			},
		},
	});
}

async function getRecommendedUsers(currentUserId: number) {
	return client.user_app_profile.findMany({
		where: {
			AND: [
				{ user_id: { not: currentUserId } },
				{
					NOT: {
						OR: [
							{
								friendships_sent: {
									some: {
										profile2: { user_id: currentUserId },
									},
								},
							},
							{
								friendships_received: {
									some: {
										profile1: { user_id: currentUserId },
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
			avatars: {
				where: {
					active: true,
				},
				select: {
					image: true,
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
		throw new Error("Профіль не знайдено");
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
					active: true,
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

	const profile1 = await client.user_app_profile.findUnique({
		where: {
			user_id: fromUserId
		}
	})

	const profile2 = await client.user_app_profile.findUnique({
		where: {
			user_id: toUserId
		}
	})
	console.log("profile1_id", profile1?.id)
	console.log("profile2_id", profile2?.id)

	const personalChat = await client.chat_app_chatgroup.findFirst({
		where: {
			is_personal_chat: true,
			members: {
				some: {
					profile_id: profile1?.id
				}
			},
			AND: {
				members: {
					some: {
						profile_id: profile2?.id
					}
				}
			}
		},
	});

	if (!personalChat) {
		throw new Error("Personal chat not found");
	}

	await client.chat_app_chatgroup_members.deleteMany({
		where: {
			chatgroup_id: personalChat.id,
			profile_id: { in: [Number(profile1?.id), Number(profile2?.id)] },
		},
	});

	await client.chat_app_chatgroup.delete({
		where: {
			id: personalChat.id,
		},
	});


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
