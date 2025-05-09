import {client} from "../client/prismaClient"
import { UserAuthPayload, UserRegPayload } from "./types"


async function getUserById(id: number){
    try{
        const user = await client.user.findUnique({
            where: {
                id: id
            },
            select: {
                name: true,
                surname: true,
                email: true,
                phoneNumber: true,
                birthDate: true,
                username: true
            }
        })
        return user
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}


async function getUserByEmail(email: string){
    try{
        const user = await client.user.findUnique({
            where: {
                email: email
            }
        })
        return user
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}

async function getUserByPhoneNumber(phoneNumber: string){
    try{
        const user = await client.user.findUnique({
            where: {
                phoneNumber: phoneNumber
            }
        })
        return user
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}


async function createUser(data: UserRegPayload){
    try{
        const user = await client.user.create({
            data: {
                ...data,
                name: "",
                surname: "",
                birthDate: new Date(2000, 12, 12),
                phoneNumber: "+1 (234) 567 89 011"
            }
            
        })
        return user
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}

async function auth(data: any){
    try{
        const user = await client.user.create({
            data: data
        })
        return user
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}



const userRepository = {
    getUserById: getUserById,
    getUserByEmail: getUserByEmail,
    getUserByPhoneNumber: getUserByPhoneNumber,
    createUser: createUser,
    auth: auth
}

export default userRepository;