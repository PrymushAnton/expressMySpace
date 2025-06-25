import { client } from "../client/prismaClient";

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
	image?: string
) {
	try {
		const profile = await client.user_app_profile.findUnique({
			where: {
				user_id: userId
			}
		})

		if (!profile) throw Error("Не знайдено профіль")

		const newMessage = await client.chat_app_chatmessage.create({
			data: {
				chat_group_id: chatId,
				content: message,
				author_id: profile.id,
				attached_image: image ? image : null,
				sent_at: new Date()
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
		})
			
		return newMessage;
	} catch (error) {
		console.log((error as Error).message);
	}
}

async function createChatGroup(
	userId: number,
) {

	try {
		const profile = await client.user_app_profile.findUnique({
			where: {
				user_id: userId
			}
		})

		if (!profile) throw Error("Не знайдено профіль")

		const newMessage = await client.chat_app_chatmessage.create({
			data: {
				chat_group_id: chatId,
				content: message,
				author_id: profile.id,
				attached_image: image ? image : null,
				sent_at: new Date()
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
		})
			
		return newMessage;
	} catch (error) {
		console.log((error as Error).message);
	}
}

const friendRepository = {
	getPersonalChats,
	getMessages,
	createMessage
};

export default friendRepository;
