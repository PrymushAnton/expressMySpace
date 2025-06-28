import { deleteImage } from "../tools/delete-image";
import { uploadImage } from "../tools/upload-image";
import chatRepository from "./chat.repository";

async function getPersonalChats(currentUserId: number) {
	return chatRepository.getPersonalChats(currentUserId);
}

async function getChatInfo(userId: number, chatId: number) {
	return chatRepository.getChatInfo(userId, chatId);
}

async function getGroupChats(currentUserId: number) {
	return chatRepository.getGroupChats(currentUserId);
}

async function getMessages(chatId: number) {
	return chatRepository.getMessages(chatId);
}

async function createMessage(
	message: string,
	chatId: number,
	userId: number,
	image: string
) {
	let uploadedImage
	console.log(image)
	if (image !== "") {
		uploadedImage = (await uploadImage(image, "messages")).file;
	} else {
		uploadedImage = ""
	}

	return chatRepository.createMessage(
		message,
		chatId,
		userId,
		uploadedImage
	);
}

async function createChatGroup(
	userId: number,
	name: string,
	participants: number[],
	avatar?: string
) {
	let avatarUploaded;
	if (avatar) {
		avatarUploaded = await uploadImage(avatar, "group_avatars");
	}
	return chatRepository.createChatGroup(
		userId,
		name,
		participants,
		avatarUploaded?.file
	);
}

async function updateChatGroup(
	chatId: number,
	userId: number,
	name: string,
	participants: number[],
	avatar?: string
) {
	let avatarUploaded;
	const oldAvatar = await chatRepository.findChatGroupAvatar(chatId);
	if (oldAvatar) {
		const avatarOld = deleteImage(oldAvatar);
	}
	if (avatar) {
		avatarUploaded = await uploadImage(avatar, "group_avatars");
	}
	return chatRepository.updateChatGroup(
		chatId,
		userId,
		name,
		participants,
		avatarUploaded?.file
	);
}

async function deleteChatGroup(chatId: number) {
	return chatRepository.deleteChatGroup(chatId);
}

const friendService = {
	getPersonalChats,
	getMessages,
	createMessage,
	createChatGroup,
	getGroupChats,
	getChatInfo,
	updateChatGroup,
	deleteChatGroup,
};

export default friendService;
