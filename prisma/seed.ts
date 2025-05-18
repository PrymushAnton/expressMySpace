


import { client } from '../src/client/prismaClient';



async function createBaseTags(){
    try{
        const tags = await client.tag.createMany({
            data: [
                { name: 'відпочинок' },
                { name: 'натхнення' },
                { name: 'життя' },
                { name: 'природа' },
                { name: 'читання' },
                { name: 'спокій' },
                { name: 'гармонія' },
                { name: 'музика' },
                { name: 'фільми' },
                { name: 'подорожі' },
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