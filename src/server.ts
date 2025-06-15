import express, {Express} from 'express';
import cors from 'cors';
import userRouter from './userApp/user.router';
import postRouter from './PostApp/post.router';
import friendRouter from './FriendApp/friend.router'


const app: Express = express()
const PORT = 3011
const HOST = '192.168.3.11'
// const HOST = 'localhost'


// app.use(cors({
//     origin: ['http://localhost:3000']
// }))
app.use(cors())

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use("/user/", userRouter)
app.use("/post/", postRouter)
app.use("/friend/", friendRouter)

app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}`)
})