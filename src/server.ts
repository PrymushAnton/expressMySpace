import express, {Express} from 'express';
import cors from 'cors';
import userRouter from './userApp/user.router';
import postRouter from './PostApp/post.router';
import friendRouter from './FriendApp/friend.router'
import chatRouter from './ChatApp/chat.router'
import { SECRET_KEY } from './config/token';
import path from "path"
import {HOST, PORT} from "./config/server-info"
import { createServer } from 'http';
import { initSocketServer } from './socket';

const app: Express = express()
// const HOST = 'localhost'
const httpServer = createServer(app)

initSocketServer(httpServer)

// app.use(cors({
//     origin: ['http://localhost:3000']
// }))
app.use(cors());

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use("/media", express.static(path.join(__dirname, "..", "media")));

app.use("/user/", userRouter)
app.use("/post/", postRouter)
app.use("/friend/", friendRouter)
app.use("/chat/", chatRouter)

httpServer.listen(PORT, HOST, () => {
	console.log(`server is running at http://${HOST}:${PORT}`);
});