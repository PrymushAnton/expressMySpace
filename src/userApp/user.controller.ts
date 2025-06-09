import { Request, Response } from "express";
import userService from "./user.service";
import { UserRegPayload } from "./types";

async function reg(req: Request, res: Response) {
	const data = req.body;
	const result = await userService.reg(data);

	res.json(result);
}

async function auth(req: Request, res: Response) {
	const data = req.body;
	const result = await userService.auth(data);

	res.json(result);
}

async function me(req: Request, res: Response) {
	const id = res.locals.userId;
	const result = await userService.me(id);

	res.json(result);
}

async function sendEmailCode(req: Request, res: Response): Promise<any> {
	const { email } = req.body;

	if (!email) {
		return res
			.status(400)
			.json({ status: "error", message: "Email обов'язковий" });
	}

	const result = await userService.registerEmail(email);

	if (result.status === "error-validation") {
		return res.status(400).json(result);
	}

	res.status(200).json({ data: "Код відправлено", status: "success" });
}

async function checkEmailCode(req: Request, res: Response): Promise<any> {
	const { code, ...otherData } = req.body;
	if (!(otherData as UserRegPayload).email || !code) {
		return res
			.status(400)
			.json({ status: "error", message: "Email і код обов'язкові" });
	}

	const result = await userService.verifyEmailCode(
		otherData as UserRegPayload,
		code
	);

	if (result.status !== "success") {
		return res.status(400).json(result);
	}

	res.status(200).json(result);
}

async function update(req: Request, res: Response) {
	const { ...data } = req.body;
	const id = res.locals.userId
	if (!data.birthDate) data.birthDate = new Date()
	data.birthDate = new Date(data.birthDate)
	const result = await userService.update(+id, data);
	res.json(result);
}

const userController = {
	reg: reg,
	auth: auth,
	me: me,
	sendEmailCode: sendEmailCode,
	checkEmailCode: checkEmailCode,
	update: update,
};

export default userController;
