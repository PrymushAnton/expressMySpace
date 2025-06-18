import { Prisma } from "../generated/prisma"


export type UserRegPayload = Prisma.UserGetPayload<{
    select: {
        email: true
        password: true
    }
}>


export type UserAuthPayload = Partial<Prisma.UserGetPayload<{
    select: {
        email: true
        phoneNumber: true
    }
}>> & Prisma.UserGetPayload<{
    select: {
        password: true
    }
}>

export type UserAdditionalInfo = Prisma.UserGetPayload<{
    select: {
        first_name: true,
        last_name: true,
        username: true
    }
}> & {
    dateOfBirth?: string | Date | null;
}
