import { Request, Response } from "express";
import userService from "./userService"


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
    const data = req.body
    const result = await userService.me(data)

    res.json(result)
}

const userController = {
    reg: reg,
    auth:auth,
    me:me
}

export default userController