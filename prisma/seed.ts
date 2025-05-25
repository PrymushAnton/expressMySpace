


import { client } from '../src/client/prismaClient';



async function createBaseTags(){
    try{
        const tags = await client.tag.createMany({
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

createBaseTags()
	.then(() => {
		client.$disconnect();
	})
	.catch((err) => {
		console.log(err);
		client.$disconnect();
	});