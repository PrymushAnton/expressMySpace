import { Prisma } from "../generated/prisma"


export type UserRegPayload = Prisma.UserGetPayload<{
    omit: {
        id: true
        image: true
        name: true
        surname: true
        birthDate: true
        phoneNumber: true
        username: true
    }
}>

export type UserRegPayloadTwoPasswords = {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    password: string;
    confirmPassword: string;
    username: string
}

export type UserRegData = Prisma.UserGetPayload<{
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