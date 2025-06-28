


import { client } from '../src/client/prismaClient';



async function createBaseTags(){
    try{
        const tags = await client.post_app_tag.createMany({
            data: [
                { name: 'Відпочинок' },
                { name: 'Натхнення' },
                { name: 'Життя' },
                { name: 'Природа' },
                { name: 'Читання' },
                { name: 'Спокій' },
                { name: 'Гармонія' },
                { name: 'Музика' },
                { name: 'Фільми' },
                { name: 'Подорожі' },
            ]
        })
    } catch (error){

    }
}


// async function createMessages(){
//     try{
//         const messages = await client.chat_app_chatmessage.createMany({
//             data: [
//                 {
//                     content: "Привіт",
//                     sent_at: new Date('2025-06-23T18:31:00+03:00'),
//                     author_id: 7,
//                     chat_group_id: 2
//                 },
//                 {
//                     content: "Хелоу, як справи? що робиш?",
//                     sent_at: new Date('2025-06-23T18:32:00+03:00'),
//                     author_id: 8,
//                     chat_group_id: 2
//                 },
//                 {
//                     content: "Та нормас, сиджу граю)",
//                     sent_at: new Date('2025-06-23T18:35:00+03:00'),
//                     author_id: 7,
//                     chat_group_id: 2
//                 },
//                 {
//                     content: "А ти що робиш?",
//                     sent_at: new Date('2025-06-23T18:37:00+03:00'),
//                     author_id: 7,
//                     chat_group_id: 2
//                 },
//                 {
//                     content: "З тобою переисуюсь :)",
//                     sent_at: new Date('2025-06-23T18:38:00+03:00'),
//                     author_id: 8,
//                     chat_group_id: 2
//                 }
//             ]
//         })
//     } catch (error){

//     }
// }

createBaseTags()
	.then(() => {
		client.$disconnect();
	})
	.catch((err) => {
		console.log(err);
		client.$disconnect();
	});