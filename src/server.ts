import express, {Express} from 'express';
import cors from 'cors';
import userRouter from './userApp/user.router';
import postRouter from './PostApp/post.router';
import friendRouter from './FriendApp/friend.router'
import { SECRET_KEY } from './config/token';
import path from "path"
import {HOST, PORT} from "./config/server-info"

const app: Express = express()
// const HOST = 'localhost'
const Secr = SECRET_KEY

// app.use(cors({
//     origin: ['http://localhost:3000']
// }))
app.use(cors())

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use("/media", express.static(path.join(__dirname, "..", "media")));

app.use("/user/", userRouter)
app.use("/post/", postRouter)
app.use("/friend/", friendRouter)

app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}`)
})