import {client} from "../client/prismaClient"
import { CreatePost, UpdatePost } from "./types"

async function createPost(data: CreatePost, userId: number){

    const {existingTags, newTags, images, ...otherData} = data
    try{
        const post = await client.post.create({
            data: {
                ...otherData,
                userId: userId
            }
        })

        await client.tag.createMany({
            data: newTags.map((tag) => {
                return {name: tag}
            })
        })

        const foundTags = await client.tag.findMany({
            where: {
                name: {
                    in: [...existingTags, ...newTags]
                }
            }
        })


        await client.tagToPost.createMany({
            data: foundTags.map((tag) => {
                return {tagId: tag.id, postId: post.id}
            })
        })

        await client.image.createMany({
            data: images.map((image) => {
                return {base64: image, postId: post.id}
            })
        })

        const fullPost = await client.post.findUnique({
            where: {
                id: post.id
            },
            include: {
                tags: true,
                images: true
            }
        })

        return fullPost
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}


async function updatePost(data: UpdatePost){

    const {existingTags, newTags, images, id, ...otherData} = data
    try{
        const post = await client.post.update({
            where: {
                id: id
            },
            data: otherData
        })

        await client.tag.createMany({
            data: newTags.map((tag) => {
                return {name: tag}
            })
        })

        const foundTags = await client.tag.findMany({
            where: {
                name: {
                    in: [...existingTags, ...newTags]
                }
            }
        })

        await client.tagToPost.deleteMany({
            where: {
                postId: post.id
            }
        })

        await client.tagToPost.createMany({
            data: foundTags.map((tag) => {
                return {tagId: tag.id, postId: post.id}
            })
        })

        await client.image.deleteMany({
            where: {
                postId: post.id
            }
        })

        await client.image.createMany({
            data: images.map((image) => {
                return {base64: image, postId: post.id}
            })
        })

        const fullPost = await client.post.findUnique({
            where: {
                id: post.id
            },
            include: {
                tags: true,
                images: true
            }
        })

        return fullPost
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}


async function deletePost(postId: number){

    try{
        await client.tagToPost.deleteMany({
            where: {
                postId: postId
            }
        })

        await client.image.deleteMany({
            where: {
                postId: postId
            }
        })

        const post = await client.post.delete({
            where: {
                id: postId
            },
        })

        return post
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}

async function findPostsByUserId(userId: number){

    try{

        const posts = await client.post.findMany({
            where: {
                userId: userId
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                },
                images: true

            }
        })

        const formattedPosts = posts.map((post) => {
            return {
                ...post,
                tags: post.tags.map((tag) => tag.tag.name),
                images: post.images.map((image) => image.base64)
            }
        })

        return formattedPosts
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}



async function findAllPosts(){

    try{
        const posts = await client.post.findMany({
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                },
                images: true

            }
        })

        const formattedPosts = posts.map((post) => {
            return {
                ...post,
                tags: post.tags.map((tag) => tag.tag.name),
                images: post.images.map((image) => image.base64)
            }
        })

        return formattedPosts
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}


async function findPostById(id: number){

    try{
        const post = await client.post.findUnique({
            where: {
                id: id
            },
            include: {
                tags: {
                    include: {
                        tag: true
                    }
                },
                images: true
            }
        })

        if (!post) return "Такого посту не існує"

        const formattedPost = {
            ...post,
            tags: post.tags.map((tag) => tag.tag.name),
            images: post.images.map((image) => image.base64)
        }

        return formattedPost
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}


async function findAllTags(){

    try{
        const tags = await client.tag.findMany({
            select: {
                id: true,
                name: true
            }
        })

        return tags
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}


const userRepository = {
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost,
    findPostsByUserId: findPostsByUserId,
    findAllPosts: findAllPosts,
    findAllTags: findAllTags,
    findPostById: findPostById
}

export default userRepository;