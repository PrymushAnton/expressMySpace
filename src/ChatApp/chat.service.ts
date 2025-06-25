import chatRepository from "./chat.repository";

async function getPersonalChats(currentUserId: number) {
	return chatRepository.getPersonalChats(currentUserId);
}

async function getMessages(chatId: number) {
	return chatRepository.getMessages(chatId);
}

async function createMessage(
	message: string,
	chatId: number,
	userId: number,
	image?: string
) {
	return chatRepository.createMessage(message, chatId, userId, image);
}

const friendService = {
	getPersonalChats,
	getMessages,
	createMessage
};

export default friendService;
