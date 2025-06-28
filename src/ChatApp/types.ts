export interface IChatServerEvents {
	chatUpdate: (data: any) => void;
}
export interface IChatClientEvents {
	joinChat: (data: any, callback: any) => void;
	leaveChat: (data: any, callback: any) => void;
}

export interface IMessageServerEvents {
    newMessage: (
        data: any
    ) => void
}
export interface IMessageClientEvents {
    sendMessage: (
        data: any
    ) => void
}


export interface ICreateChatData{
    name: string
}