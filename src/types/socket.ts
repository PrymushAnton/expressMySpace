import { Socket } from "socket.io"
import { IChatClientEvents, IChatServerEvents, IMessageClientEvents, IMessageServerEvents } from "../ChatApp/types"

export type AppServerEvents = IMessageServerEvents & IChatServerEvents
export type AppClientEvents = IMessageClientEvents & IChatClientEvents

export type AuthenticatedSocket = Socket<AppClientEvents, AppServerEvents, {}, SocketData>

export interface SocketData {
    userId: number
}
