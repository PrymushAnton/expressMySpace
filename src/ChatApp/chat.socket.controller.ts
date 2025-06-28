import chatService from "./chat.service"

async function createMessage(
	message: string,
	chatId: number,
	userId: number,
	image: string
) {
    const newMessage = await chatService.createMessage(message, chatId, userId, image)
    return newMessage
}


const chatSocketController = {
    createMessage
}
export default chatSocketController