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

async function sendEmailCode(req: Request, res: Response): Promise<any>{
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ message: "Email обов'язковий" });
	}

	const result = await userService.registerEmail(email);

	if (result.status === "error-validation") {
		return res.status(400).json(result);
	}

	res.status(200).json(result);
};

// 2. Проверка кода
async function checkEmailCode(req: Request, res: Response): Promise<any> {
	const { email, code } = req.body;

	if (!email || !code) {
		return res.status(400).json({ message: "Email і код обов'язкові" });
	}

	const result = await userService.verifyEmailCode(email, code);

	if (result.status !== "success") {
		return res.status(400).json(result);
	}

	res.status(200).json(result);
};

const userController = {
    reg: reg,
    auth: auth,
    me: me,
    sendEmailCode: sendEmailCode,
    checkEmailCode: checkEmailCode
}

export default userController