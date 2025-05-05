import { Request, Response } from "express";
import userService from "./user.service"


async function reg(req: Request, res: Response){
    const data = req.body
    const result = await userService.reg(data)

    res.json(result)
}


async function auth(req: Request, res: Response){
    const data = req.body
    const result = await userService.auth(data)
    
    res.json(result)
}


async function me(req: Request, res: Response){
    const id = res.locals.userId
    const result = await userService.me(id)

    res.json(result)
}

const userController = {
    reg: reg,
    auth:auth,
    me:me
}

export default userController