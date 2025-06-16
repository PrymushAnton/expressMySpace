import { Prisma } from "../generated/prisma"


export type CreatePost = Prisma.PostGetPayload<{
    omit: {
        id: true
        userId: true,
        views: true,
        likes: true
    }
}> & {
    existingTags: string[]
    newTags: string[]
    images: string[]
    link: string[]
}


export type UpdatePost = Prisma.PostGetPayload<{
    omit: {
        userId: true,
        views: true,
        likes: true
    }
}> & {
    existingTags: string[]
    newTags: string[]
    images: string[]
    link: string[] 
}

    
export type FindPost = Prisma.PostGetPayload<{}> & {
    tags: string[]
    images: string[]
}