import express, {Express} from 'express';
import { join } from 'path'
import cors from 'cors';

const app: Express = express()
const PORT = 3001
const HOST = 'localhost'

app.use(cors({
    origin: ['http://localhost:3000']
}))

app.set('views', join(__dirname, 'templates'))
app.use('/static/', express.static(join(__dirname, 'static')))
app.use(express.json())



app.listen(PORT, HOST, ()=>{
    console.log(`http://${HOST}:${PORT}`)
})