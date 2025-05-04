import { Prisma } from "../../prisma/generated/prisma"


export type UserRegPayload = Prisma.UserGetPayload<{
    omit: {
        id: true
        image: true
    }
}>


export type UserRegPayloadTwoPasswords = Prisma.UserGetPayload<{
    omit: {
        id: true
        image: true
    }
}> & {confirmPassword: string}


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