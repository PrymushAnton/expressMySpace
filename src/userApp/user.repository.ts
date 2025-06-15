import { client } from "../client/prismaClient";
import { UserAdditionalInfo, UserAuthPayload, UserRegPayload } from "./types";

async function getUserById(id: number) {
	try {
		const user = await client.user.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				name: true,
				surname: true,
				email: true,
				phoneNumber: true,
				birthDate: true,
				username: true,
				image: true
			},
		});
		return user;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

async function getUserByEmail(email: string) {
	try {
		const user = await client.user.findUnique({
			where: {
				email: email,
			},
		});
		return user;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}


async function getUserByPhoneNumber(phoneNumber: string) {
	try {
		const user = await client.user.findUnique({
			where: {
				phoneNumber: phoneNumber,
			},
		});
		return user;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

async function getUserByUsername(username: string) {
	try {
		const user = await client.user.findUnique({
			where: {
				username: username,
			},
		});
		return user;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

async function createUser(data: UserRegPayload) {
	try {
		const user = await client.user.create({
			data: data,
		});
		return user;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

async function auth(data: any) {
	try {
		const user = await client.user.create({
			data: data,
		});
		return user;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

async function update(id: number, data: UserAdditionalInfo) {
	try {
		const user = await client.user.update({
			where: { id },
			data: data,
		});
		return user;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при оновленні користувача";
	}
}

const userRepository = {
	getUserById: getUserById,
	getUserByEmail: getUserByEmail,
	getUserByPhoneNumber: getUserByPhoneNumber,
	getUserByUsername: getUserByUsername,
	createUser: createUser,
	auth: auth,
	update: update,
};

export default userRepository;
