import { client } from "../client/prismaClient";
import { deleteImage } from "../tools/delete-image";

async function getPersonalChats(currentUserId: number) {
	const profile = await client.user_app_profile.findUnique({
		where: {
			user_id: currentUserId,
		},
	});

	if (!profile) console.log("profile");

	const chat = await client.chat_app_chatgroup.findMany({
		where: {
			is_personal_chat: true,
			members: {
				some: {
					profile_id: profile?.id,
				},
			},
		},
		select: {
			id: true,
			members: {
				where: {
					NOT: {
						profile_id: profile?.id,
					},
				},
				include: {
					profile: {
						select: {
							user: {
								select: {
									id: true,
									username: true,
									first_name: true,
									last_name: true,
									email: true,
								},
							},
							avatars: {
								where: {
									active: true,
								},
								select: {
									image: true,
								},
							},
						},
					},
				},
				omit: {
					chatgroup_id: true,
					id: true,
				},
			},
			messages: {
				orderBy: {
					sent_at: "desc",
				},
				take: 1,
				include: {
					author: {
						select: {
							user_id: true,
							id: true,
						},
					},
				},
			},
		},
	});

	if (!chat) console.log("chat");

	return chat;
}

async function getChatInfo(userId: number, chatId: number) {
	const profile = await client.user_app_profile.findUnique({
		where: {
			user_id: userId,
		},
	});

	const chat = await client.chat_app_chatgroup.findUnique({
		where: {
			id: chatId,
		},
		select: {
			name: true,
			avatar: true,
			members: {
				where: {
					NOT: {
						profile_id: profile?.id,
					},
				},
				include: {
					profile: {
						select: {
							user: {
								select: {
									id: true,
									username: true,
									first_name: true,
									last_name: true,
									email: true,
								},
							},
							avatars: {
								where: {
									active: true,
								},
								select: {
									image: true,
								},
							},
						},
					},
				},
				omit: {
					chatgroup_id: true,
					id: true,
				},
			},
		},
	});

	if (!chat) console.log("chat");

	return chat;
}

async function getGroupChats(currentUserId: number) {
	const profile = await client.user_app_profile.findUnique({
		where: {
			user_id: currentUserId,
		},
	});

	if (!profile) console.log("profile");

	const chat = await client.chat_app_chatgroup.findMany({
		where: {
			is_personal_chat: false,
			members: {
				some: {
					profile_id: profile?.id,
				},
			},
		},
		select: {
			id: true,
			name: true,
			avatar: true,
			admin_id: true,
			members: {
				where: {
					NOT: {
						profile_id: profile?.id,
					},
				},
				include: {
					profile: {
						select: {
							user: {
								select: {
									id: true,
									username: true,
									first_name: true,
									last_name: true,
									email: true,
								},
							},
							avatars: {
								where: {
									active: true,
								},
								select: {
									image: true,
								},
							},
						},
					},
				},
				omit: {
					chatgroup_id: true,
					id: true,
				},
			},
			messages: {
				orderBy: {
					sent_at: "desc",
				},
				take: 1,
				include: {
					author: {
						select: {
							user_id: true,
							id: true,
						},
					},
				},
			},
		},
	});

	if (!chat) console.log("chat");

	return chat;
}

async function getMessages(chatId: number) {
	try {
		const messages = await client.chat_app_chatmessage.findMany({
			where: {
				chat_group_id: chatId,
			},
			include: {
				author: {
					select: {
						user: {
							select: {
								id: true,
								first_name: true,
								last_name: true,
								email: true,
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
						},
					},
				},
			},
		});

		return messages;
	} catch (error) {
		console.log((error as Error).message);
	}
}

async function createMessage(
	message: string,
	chatId: number,
	userId: number,
	image: string
) {
	try {
		const profile = await client.user_app_profile.findUnique({
			where: {
				user_id: userId,
			},
		});

		if (!profile) throw Error("Не знайдено профіль");

		const newMessage = await client.chat_app_chatmessage.create({
			data: {
				chat_group_id: chatId,
				content: message,
				author_id: profile.id,
				attached_image: image !== "" ? image : null,
				sent_at: new Date(),
			},
			include: {
				author: {
					select: {
						user: {
							select: {
								id: true,
								first_name: true,
								last_name: true,
								email: true,
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
						},
					},
				},
			},
		});

		return newMessage;
	} catch (error) {
		console.log((error as Error).message);
	}
}

async function createChatGroup(
	userId: number,
	name: string,
	participants: number[],
	avatar?: string
) {
	try {
		const profile = await client.user_app_profile.findUnique({
			where: {
				user_id: userId,
			},
		});

		if (!profile) throw Error("Не знайдено профіль");

		const chatGroup = await client.chat_app_chatgroup.create({
			data: {
				name: name,
				avatar: avatar,
				admin_id: profile.id,
				is_personal_chat: false,
			},
		});

		const members = await client.chat_app_chatgroup_members.createMany({
			data: [
				...participants.map((participant) => {
					return {
						chatgroup_id: chatGroup.id,
						profile_id: participant,
					};
				}),
				{
					chatgroup_id: chatGroup.id,
					profile_id: Number(profile.id),
				},
			],
		});

		return chatGroup;
	} catch (error) {
		console.log((error as Error).message);
	}
}

async function updateChatGroup(
	chatId: number,
	userId: number,
	name: string,
	participants: number[],
	avatar?: string
) {
	try {
		console.log(avatar);
		console.log(typeof avatar);
		const profile = await client.user_app_profile.findUnique({
			where: {
				user_id: userId,
			},
		});

		if (!profile) throw Error("Не знайдено профіль");

		const chatGroup = await client.chat_app_chatgroup.update({
			where: {
				id: chatId,
			},
			data: {
				name: name,
				avatar: avatar ? avatar : null,
			},
		});

		const oldMembers = await client.chat_app_chatgroup_members.deleteMany({
			where: {
				chatgroup_id: chatId,
			},
		});

		const newMembers = await client.chat_app_chatgroup_members.createMany({
			data: [
				...participants.map((participant) => {
					return {
						chatgroup_id: chatGroup.id,
						profile_id: participant,
					};
				}),
				{
					chatgroup_id: chatGroup.id,
					profile_id: Number(profile.id),
				},
			],
		});

		return chatGroup;
	} catch (error) {
		console.log((error as Error).message);
	}
}

async function deleteChatGroup(chatId: number) {
	try {
		await client.chat_app_chatmessage.deleteMany({
			where: {
				chat_group_id: chatId
			},
		});

		await client.chat_app_chatgroup_members.deleteMany({
			where: {
				chatgroup_id: chatId,
			},
		});

		const chatGroup = await client.chat_app_chatgroup.delete({
			where: {
				id: chatId,
			},
		});

		if (chatGroup.avatar) {
			await deleteImage(chatGroup.avatar);
		}

		return chatGroup;
	} catch (error) {
		console.log((error as Error).message);
	}
}

async function findChatGroupAvatar(chatId: number) {
	try {
		const chat = await client.chat_app_chatgroup.findUnique({
			where: {
				id: chatId,
			},
		});

		return chat?.avatar;
	} catch (error) {
		console.log((error as Error).message);
	}
}

const friendRepository = {
	getPersonalChats,
	getMessages,
	createMessage,
	createChatGroup,
	getGroupChats,
	getChatInfo,
	findChatGroupAvatar,
	updateChatGroup,
	deleteChatGroup
};

export default friendRepository;
