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