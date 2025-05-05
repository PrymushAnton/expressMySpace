import express, {Express} from 'express';
import cors from 'cors';
import userRouter from './userApp/user.router';

const app: Express = express()
const PORT = 3001
const HOST = '192.168.3.11'
// const HOST = 'localhost'


// app.use(cors({
//     origin: ['http://localhost:3000']
// }))
app.use(cors())
app.use(express.json())

app.use("/user/", userRouter)


app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}`)
})