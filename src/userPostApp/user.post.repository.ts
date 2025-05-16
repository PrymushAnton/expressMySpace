import { client } from "../client/prismaClient"
import { CreatePost } from "./types"

//Post
async function deletePost(id: number){
    try{
        const post = await client.post.delete({
            where: {
                id: id
            },
            include:{
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return post
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}

async function getPostById(id:number){
    try{
        const post = await client.post.findUnique({
            where:{
                id:id
            },
            include:{
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return post
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}

async function createOnePost(data:CreatePost){
    try{
        const post = await client.post.create({
            data: data,
            include: {
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return post
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
    
}

async function changePost(id:number){
    try{
        const post = await client.post.findUnique({
            where:{
                id:id
            },
            include:{
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return post
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}
//Image
async function deleteImage(id: number){
    try{
        const image = await client.image.delete({
            where: {
                id: id
            },
            include:{
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return image
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}

async function getImageById(id:number){
    try{
        const image = await client.image.findUnique({
            where:{
                id:id
            },
            include:{
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return image
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}

async function createOneImage(data:CreatePost){
    try{
        const image = await client.image.create({
            data: data,
            include: {
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return image
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
    
}

async function changeImage(id:number){
    try{
        const image = await client.image.findUnique({
            where:{
                id:id
            },
            include:{
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return image
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}

//Tag
async function deleteTag(id: number){
    try{
        const tag = await client.tag.delete({
            where: {
                id: id
            },
            include:{
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return tag
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}

async function getTagById(id:number){
    try{
        const tag = await client.tag.findUnique({
            where:{
                id:id
            },
            include:{
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return tag
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}

async function createOneTag(data:CreatePost){
    try{
        const tag = await client.tag.create({
            data: data,
            include: {
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return tag
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
    
}

async function changeTag(id:number){
    try{
        const tag = await client.tag.findUnique({
            where:{
                id:id
            },
            include:{
                name: true,
                theme: true,
                tags: true,
                text: true,
                image: true
            }
        })
        return tag
    } catch (error) {
        console.log((error as Error).message)
        return "Помилка при роботі з базою даних"
    }
}


const postRepository = {
    getPostById:getPostById,
    createOnePost:createOnePost,
    deletePost: deletePost,
    changePost: changePost,
    getImageById: getImageById,
    createOneImage: createOneImage,
    deleteImage: deleteImage,
    changeImage: changeImage,
    getTagById: getTagById,
    createOneTag: createOneTag,
    deleteTag: deleteTag,
    changeTag: changeTag,
}
export default postRepository