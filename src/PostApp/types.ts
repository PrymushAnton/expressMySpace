import { Prisma } from "../generated/prisma"


export type CreatePost = Prisma.post_app_postGetPayload<{
    omit: {
        id: true
        author_id: true,
        views: true,
        likes: true
    }
}> & {
    existingTags: string[]
    newTags: string[]
    images: string[]
    link: string[]
}


export type UpdatePost = Prisma.post_app_postGetPayload<{
    omit: {
        author_id: true,
        views: true,
        likes: true
    }
}> & {
    existingTags: string[]
    newTags: string[]
    images: string[]
    link: string[] 
}

    
export type FindPost = Prisma.post_app_postGetPayload<{}> & {
    tags: string[]
    images: string[]
}