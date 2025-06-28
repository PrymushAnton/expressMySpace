import { UserAuthPayload, UserRegPayload } from "./types";
import userRepository from "./user.repository";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { SECRET_KEY } from "../config/token";
import nodemailer from "nodemailer";
import { UserValidation } from "./user.validate";
import { ValidationError } from "yup";
import { Response, IReturnError } from "../types/types";
import isEmail from "validator/lib/isEmail"; //для валидации почты
import { uploadImage } from "../tools/upload-image";

async function reg(data: UserRegPayload): Promise<Response<string>> {
	try {
		await UserValidation.register.validate(data, { abortEarly: false });
	} catch (error) {
		if (error instanceof ValidationError) {
			const fieldErrors: IReturnError[] = [];
			for (const err of error.inner) {
				if (
					err.path &&
					err.message &&
					!fieldErrors.some((e) => e.path === err.path)
				) {
					fieldErrors.push({
						path: err.path,
						message: err.message,
					});
				}
			}
			return { status: "error-validation", data: fieldErrors };
		}
	}

	const { email, password } = data;

	const userEmail = await userRepository.getUserByEmail(email);
	if (userEmail)
		return {
			status: "error-validation",
			data: [
				{
					path: "email",
					message: "Користувач з такою поштою вже існує",
				},
			],
		};

	return { status: "success", data: "" };
}

async function auth(data: UserAuthPayload): Promise<Response<string>> {
	let requestData;
	try {
		requestData = await UserValidation.login.validate(data, {
			abortEarly: false,
		});
	} catch (error) {
		const fieldErrors: IReturnError[] = [];
		for (const err of (error as ValidationError).inner) {
			if (
				err.path &&
				err.message &&
				!fieldErrors.some((e) => e.path === err.path)
			) {
				fieldErrors.push({
					path: err.path,
					message: err.message,
				});
			}
		}
		return { status: "error-validation", data: fieldErrors };
	}

	const { email, password } = requestData;

	const user = await userRepository.getUserByEmail(email);

	if (!user)
		return {
			status: "error-validation",
			data: [{ path: "email", message: "Такого користувача не існує" }],
		};

	if (typeof user === "string")
		return { status: "error", message: "Помилка на сервері" };

	const isPasswordValid = await compare(password, user.password);

	if (!isPasswordValid)
		return {
			status: "error-validation",
			data: [{ path: "password", message: "Невірний пароль" }],
		};
	const token = sign({ id: user.id }, SECRET_KEY, { expiresIn: "7d" });
	return { status: "success", data: token };
}

const emailVerificationCodes = new Map<string, number>();

async function registerEmail(email: string): Promise<Response<null>> {
	if (!isEmail(email)) {
		return {
			status: "error-validation",
			data: [{ path: "email", message: "Некоректна email адреса" }],
		};
	}

	const code = Math.floor(100000 + Math.random() * 900000);

	emailVerificationCodes.set(email, code);
	setTimeout(() => emailVerificationCodes.delete(email), 10 * 60 * 1000);

	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: parseInt(process.env.SMTP_PORT || "587"),
		secure: false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	try {
		await transporter.sendMail({
			from: `"mySpace App" <${process.env.SMTP_USER}>`,
			to: email,
			subject: "Код підтвердження електронної пошти",
			text: `Ваш код: ${code}`,
		});

		return { status: "success", data: null };
	} catch (error) {
		console.error("Email send error:", error);
		return { status: "error", message: "Не вдалося надіслати листа" };
	}
}

async function verifyEmailCode(
	data: UserRegPayload,
	code: string
): Promise<Response<string>> {
	const { email, password } = data;

	const storedCode = emailVerificationCodes.get(email);

	if (!storedCode) {
		return {
			status: "error",
			message: "Код не знайдено або він протермінований",
		};
	}

	if (storedCode.toString() !== code.toString()) {
		return { status: "error", message: "Невірний код" };
	}

	emailVerificationCodes.delete(email);

	const hashedPassword = await hash(password, 10);
	const hashedData = {
		email: email,
		password: hashedPassword,
	};

	const user = await userRepository.createUser(hashedData);
	if (!user) return { status: "error", message: "Помилка при реєстрації" };
	if (typeof user === "string")
		return { status: "error", message: "Помилка на сервері" };

	const token = sign({ id: Number(user.user.id) }, SECRET_KEY, {
		expiresIn: "7d",
	});

	return { status: "success", data: token };
}

async function me(id: number) {
	const user = await userRepository.getUserById(id);
	if (!user)
		return { status: "error", message: "Такого користувача не існує" };
	return {
		status: "success",
		data: JSON.parse(
			JSON.stringify(user, (_, v) =>
				typeof v === "bigint" ? Number(v) : v
			)
		),
	};
}

async function update(id: number, data: any): Promise<Response<string>> {
	const userById = await userRepository.getUserById(id);
	if (!userById)
		return { status: "error", message: "Користувача не знайдено" };
	if (typeof userById === "string")
		return { status: "error", message: "Помилка на сервері" };

	let isEmailValid = true;
	if (data.email) {
		const userByEmail = await userRepository.getUserByEmail(data.email);
		if (typeof userByEmail === "string")
			return { status: "error", message: "Помилка на сервері" };
		if (userByEmail) {
			isEmailValid = userByEmail.id === userById.id;
		} else {
			isEmailValid = true;
		}
	}
	if (!isEmailValid) return { status: "error", message: "Помилка з поштою" };

	if (data && data.birthDate < new Date("1900-01-01"))
		return { status: "error", message: "Некоректна дата народження" };

	const { date_of_birth, ...otherData } = data;
	const updated = await userRepository.update(id, otherData, {
		date_of_birth,
	});
	if (!updated)
		return { status: "error", message: "Не вдалося оновити дані" };
	if (typeof updated === "string")
		return { status: "error", message: "Помилка на сервері" };

	return { status: "success", data: "Дані успішно оновлено" };
}

async function updateFirstLogin(
	id: number,
	data: any
): Promise<Response<string>> {
	const userById = await userRepository.getUserById(id);
	if (!userById)
		return { status: "error", message: "Користувача не знайдено" };
	if (typeof userById === "string")
		return { status: "error", message: "Помилка на сервері" };

	let isUsernameValid = true;
	if (data.username) {
		const userByUsername = await userRepository.getUserByUsername(
			data.username
		);
		if (typeof userByUsername === "string")
			return { status: "error", message: "Помилка на сервері" };
		if (userByUsername) {
			isUsernameValid = userByUsername.id === userById.id;
		} else {
			isUsernameValid = true;
		}
	}
	if (!isUsernameValid)
		return { status: "error", message: "Помилка з ніком" };

	const updated = await userRepository.update(id, data);
	if (!updated)
		return { status: "error", message: "Не вдалося оновити дані" };
	if (typeof updated === "string")
		return { status: "error", message: "Помилка на сервері" };

	return { status: "success", data: "Дані успішно оновлено" };
}

async function updateAvatar(id: number, data: any): Promise<Response<string>> {
	const userById = await userRepository.getUserById(id);
	if (!userById)
		return { status: "error", message: "Користувача не знайдено" };
	if (typeof userById === "string")
		return { status: "error", message: "Помилка на сервері" };

	let isUsernameValid = true;
	if (data.username) {
		const userByUsername = await userRepository.getUserByUsername(
			data.username
		);
		if (typeof userByUsername === "string")
			return { status: "error", message: "Помилка на сервері" };
		if (userByUsername) {
			isUsernameValid = userByUsername.id === userById.id;
		} else {
			isUsernameValid = true;
		}
	}
	if (!isUsernameValid)
		return { status: "error", message: "Помилка з ніком" };

	if (data.avatar) {
		const avatar = await uploadImage(data.avatar, "avatars");

		const avatarResult = await userRepository.createAvatar(id, avatar.file);
		if (!avatarResult)
			return { status: "error", message: "Аватарка не була створена" };
		if (typeof avatarResult === "string")
			return { status: "error", message: "Помилка на сервері" };
	}

	const updated = await userRepository.update(id, {
		username: data.username,
	});
	if (!updated)
		return { status: "error", message: "Не вдалося оновити дані" };
	if (typeof updated === "string")
		return { status: "error", message: "Помилка на сервері" };

	return { status: "success", data: "Дані успішно оновлено" };
}

async function updatePassword(
	id: number,
	data: any
): Promise<Response<string>> {
	const userById = await userRepository.getUserById(id);
	if (!userById)
		return { status: "error", message: "Користувача не знайдено" };
	if (typeof userById === "string")
		return { status: "error", message: "Помилка на сервері" };

	const hashedPassword = await hash(data.password, 10);

	const updated = await userRepository.update(id, {
		password: hashedPassword,
	});
	if (!updated)
		return { status: "error", message: "Не вдалося оновити дані" };
	if (typeof updated === "string")
		return { status: "error", message: "Помилка на сервері" };

	return { status: "success", data: "Дані успішно оновлено" };
}

async function getUserById(id: number) {
	const user = await userRepository.getUserById(id);
	if (!user) return { status: "error", message: "Користувача не знайдено" };
	if (typeof user === "string") return { status: "error", message: user };


	return {
		status: "success",
		data: JSON.parse(
			JSON.stringify(user, (_, v) =>
				typeof v === "bigint" ? Number(v) : v
			)
		),
	};
}

async function getUserProfileById(id: number, userId: number) {
	const user = await userRepository.getUserProfileById(id, userId);
	if (!user) return { status: "error", message: "Користувача не знайдено" };
	if (typeof user === "string") return { status: "error", message: user };


	return {
		status: "success",
		data: JSON.parse(
			JSON.stringify(user, (_, v) =>
				typeof v === "bigint" ? Number(v) : v
			)
		),
	};
}

async function getAnotherUserById(id: number) {
	const user = await userRepository.getAnotherUserById(id);
	if (!user) return { status: "error", message: "Користувача не знайдено" };
	if (typeof user === "string") return { status: "error", message: user };


	return {
		status: "success",
		data: JSON.parse(
			JSON.stringify(user, (_, v) =>
				typeof v === "bigint" ? Number(v) : v
			)
		),
	};
}

async function getMeById(id: number) {
	const user = await userRepository.getMeById(id);
	if (!user) return { status: "error", message: "Користувача не знайдено" };
	if (typeof user === "string") return { status: "error", message: user };


	return {
		status: "success",
		data: JSON.parse(
			JSON.stringify(user, (_, v) =>
				typeof v === "bigint" ? Number(v) : v
			)
		),
	};
}

async function createUser(data: UserRegPayload): Promise<Response<string>> {
	const { email, password } = data;

	const hashedPassword = await hash(password, 10);
	const hashedData = {
		email: email,
		password: hashedPassword,
	};

	const user = await userRepository.createUser(hashedData);
	if (!user) return { status: "error", message: "Помилка при реєстрації" };
	if (typeof user === "string")
		return { status: "error", message: "Помилка на сервері" };

	const token = sign({ id: Number(user.user.id) }, SECRET_KEY, {
		expiresIn: "7d",
	});

	return { status: "success", data: token };
}

const userService = {
	reg: reg,
	auth: auth,
	me: me,
	registerEmail: registerEmail,
	verifyEmailCode: verifyEmailCode,
	update: update,
	updateAvatar: updateAvatar,
	updateFirstLogin: updateFirstLogin,
	updatePassword: updatePassword,
	getUserById: getUserById,
	createUser,
	getMeById,
	getAnotherUserById,
	getUserProfileById
};

export default userService;
