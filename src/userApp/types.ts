import { Prisma } from "../generated/prisma";

export type UserRegPayload = Prisma.auth_userGetPayload<{
	select: {
		email: true;
		password: true;
	};
}>;

export type UserAuthPayload = Prisma.auth_userGetPayload<{
	select: {
		email: true;
		password: true;
	};
}>;

export type UserAdditionalInfo = Partial<
	Prisma.user_app_profileGetPayload<{
		select: {
			date_of_birth: true;
		};
	}> &
		Prisma.auth_userGetPayload<{
			select: {
				first_name: true;
				last_name: true;
				username: true;
			};
		}>
>;

export type UserInfo = Partial<
	Prisma.auth_userGetPayload<{
		select: {
			first_name: true;
			last_name: true;
			username: true;
			password: true;
		};
	}>
>;

export type ProfileInfo = Partial<
	Prisma.user_app_profileGetPayload<{
		select: {
			date_of_birth: true;
		};
	}> &
		Prisma.user_app_avatarGetPayload<{
			select: {
				image: true;
			};
		}>
>;

export type UserAvatarPayload = Prisma.user_app_avatarGetPayload<{
	select: {
		image: true;
	};
}>;
// export type UserAdditionalInfo = Prisma.UserGetPayload<{
//     select: {
//         first_name: true,
//         last_name: true,
//         username: true
//     }
// }> & {
//     dateOfBirth?: string | Date | null;
// }
