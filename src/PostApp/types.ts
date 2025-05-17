import { Prisma } from "../generated/prisma"


export type CreatePost = Prisma.PostGetPayload<{
    omit: {
        id: true
        userId: true
    }
}> & {
    existingTags: string[]
    newTags: string[]
    images: string[]
}


export type UpdatePost = Prisma.PostGetPayload<{
    omit: {
        userId: true
    }
}> & {
    existingTags: string[]
    newTags: string[]
    images: string[]
}






export type FindPost = Prisma.PostGetPayload<{}> & {
    tags: string[]
    images: string[]
}