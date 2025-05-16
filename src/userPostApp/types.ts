import { Prisma } from "@prisma/client";
import { User } from "../generated/prisma";

const defaultTags = [
  "відпочинок", "натхнення", "життя", "природа", "читання",
  "спокій", "гармонія", "музика", "фільми", "подорожі"
];

export type tag = {
    name: string,
    default: boolean,
};

export type userPost = {
    name: string,
    topic: string,
    content: string,
    views: postView[],
    likes: postLike[],
    tags: postTag[],
    images: image[],
    users: User[]
};

export type image = {
    base64: string,
    posts: userPost[]
}

export type postTag = {
    name: string,
    posts: userPost[]
}

export type postView = {
    userId: number,
    postId: number,
    user: User,
    post: userPost,
}

export type postLike = {
    userId: number,
    postId: number,
    user: User,
    post: userPost,
}

export type CreatePost = Prisma.PostUncheckedCreateInput