import { date } from "yup";
import { client } from "../client/prismaClient";
import { ProfileInfo, UserAdditionalInfo, UserAuthPayload, UserAvatarPayload, UserInfo, UserRegPayload } from "./types";

async function getUserById(id: number) {
	try {

		const user = await client.auth_user.findUnique({
			where: {
				id: id
			},
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				username: true,
				password: true,
				profile: {
					select: {
						date_of_birth: true,
						avatars: true
					}
				}
			}
		})

		// const user = await client.user.findUnique({
		// 	where: { id },
		// 	select: {
		// 		id: true,
		// 		first_name: true,
		// 		last_name: true,
		// 		email: true,
		// 		username: true,
		// 		// image: true,
		// 		profile: {
		// 			select: {
		// 				dateOfBirth: true,
		// 				avatars: true,
		// 			},
		// 		},
		// 	},
		// });

		return user;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

async function getUserByEmail(email: string) {
	try {
		const user = await client.auth_user.findFirst({
			where: {
				email: email
			},
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				username: true,
				password: true,
				profile: {
					select: {
						date_of_birth: true,
						avatars: true
					}
				}
			}
		});
		return user;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

// async function getUserByPhoneNumber(phone: string) {
// 	try {
// 		const user = await client.user.findUnique({
// 			where: { phone },
// 		});
// 		return user;
// 	} catch (error) {
// 		console.log((error as Error).message);
// 		return "Помилка при роботі з базою даних";
// 	}
// }

async function getUserByUsername(username: string) {
	try {
		const user = await client.auth_user.findUnique({
			where: {
				username: username,
			},
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				username: true,
				password: true,
				profile: {
					select: {
						date_of_birth: true,
						avatars: true
					}
				}
			}
		});
		return user;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

async function createUser(data: UserRegPayload) {
	try {
		const user = await client.auth_user.create({
			data: {
				email: data.email,
				password: data.password,
				username: "",
				first_name: "",
				last_name: "",
			}
		});
		const profile = await client.user_app_profile.create({
			data: {
				user_id: user.id,
				date_of_birth: new Date()
			}
		})
		return profile;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}


async function createAvatar(user_id: number, imagePath: string) {
	try {
		const profile = await client.user_app_profile.findUnique({
			where: {
				user_id: user_id
			}
		})

		if (!profile) return "Помилка при знаходженні профілю"

		const avatars = await client.user_app_avatar.updateMany({
			where: {
				profile_id: profile.id
			},
			data: {
				active: false
			}
		})

		const avatar = await client.user_app_avatar.create({
			data: {
				image: imagePath,
				active: true,
				shown: true,
				profile_id: profile.id
			}
		});

		return avatar;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при роботі з базою даних";
	}
}

// async function auth(data: any) {
// 	try {
// 		const user = await client.auth_user.create({
// 			data: data,
// 		});
// 		return user;
// 	} catch (error) {
// 		console.log((error as Error).message);
// 		return "Помилка при роботі з базою даних";
// 	}
// }

async function update(id: number, dataUser?: UserInfo, dataProfile?: ProfileInfo) {
	try {
		let result = null;
		if (dataUser) {
			const user = await client.auth_user.update({
				where: { id: id },
				data: dataUser
			});
			result = user
		}
		
		if (dataProfile) {
			const profile = await client.user_app_profile.update({
				where: {
					user_id: id
				},
				data: dataProfile
			})
			result = profile
		}

		
		return result;
	} catch (error) {
		console.log((error as Error).message);
		return "Помилка при оновленні користувача";
	}
}

const userRepository = {
	getUserById: getUserById,
	getUserByEmail: getUserByEmail,
	// getUserByPhoneNumber: getUserByPhoneNumber,
	getUserByUsername: getUserByUsername,
	createUser: createUser,
	createAvatar: createAvatar,
	// auth: auth,
	update: update,
};

export default userRepository;
