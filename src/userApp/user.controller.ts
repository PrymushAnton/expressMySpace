import { Request, Response } from "express";
import userService from "./user.service";
import { UserRegPayload } from "./types";
import parsePhoneNumberFromString from "libphonenumber-js";
import userRepository from "./user.repository";

async function reg(req: Request, res: Response) {
	const data = req.body;
	const result = await userService.reg(data);

	res.json(result);
}

async function createUser(req: Request, res: Response) {
	const data = req.body;
	const result = await userService.createUser(data);
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

async function updateFirstLogin(req: Request, res: Response) {
	const { ...data } = req.body;
	const id = res.locals.userId;
	console.log(data, id)
	Object.entries(data).forEach(([key, object]) => {
		if (data[key] === "") {
			data[key] = null;
		}
	});

	const result = await userService.update(+id, data);
	res.json(result);
}

async function update(req: Request, res: Response) {
	const { ...data } = req.body;
	const id = res.locals.userId;
	console.log(data, id);

	if (data.date_of_birth) {
		data.date_of_birth = new Date(data.date_of_birth);
	}

	Object.entries(data).forEach(([key, object]) => {
		if (data[key] === "") {
			data[key] = null;
		}
	});

	const result = await userService.update(+id, data);

	res.json(result);
}

async function updateAvatar(req: Request, res: Response) {
	const data = req.body;
	const id = res.locals.userId;

	Object.entries(data).forEach(([key, object]) => {
		if (data[key] === "") {
			data[key] = null;
		}
	});

	const result = await userService.updateAvatar(+id, data);

	res.json(result);
}

async function updatePassword(req: Request, res: Response) {
	const data = req.body;
	const id = res.locals.userId;
	console.log(data)

	const result = await userService.updatePassword(+id, data);

	res.json(result);
}

async function getUserById(req: Request, res: Response) {
	const id = Number(req.params.id);
	if (isNaN(id))
		res.status(400).json({ status: "error", message: "Некоректний ID" });

	const result = await userService.getUserById(id);
	if (result.status === "error") {
		res.status(404).json(result);
	}

	res.json(result);
}

const userController = {
	reg: reg,
	auth: auth,
	me: me,
	sendEmailCode: sendEmailCode,
	checkEmailCode: checkEmailCode,
	update: update,
	updateAvatar: updateAvatar,
	updateFirstLogin: updateFirstLogin,
	getUserById: getUserById,
	updatePassword: updatePassword,
	createUser
};

export default userController;
