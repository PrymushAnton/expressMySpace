import { writeFile } from "fs/promises";
import { join } from "path";

interface IUploadImageResult {
	fileName: string
	file: string;
}

export async function uploadImage(base64: string, toDir: string): Promise<IUploadImageResult> {

    const prefixArray = base64.split(";base64,")
    const typeArray = prefixArray[0].split('/')
    const type = typeArray[typeArray.length - 1]
	 
	const randomSuffix = Math.random().toString(36).slice(2, 8);
	const fileName = `${Date.now()}-${randomSuffix}.${type}`;
	const buffer = Buffer.from(prefixArray[1], "base64");

	try {
		await writeFile(
			join(__dirname, "../", "../", "media", "images", `${toDir}`, `${fileName}`),
			buffer
		);
	} catch (error) {
		console.log(error);
	}

	return { 
		fileName: fileName,
		file: `images/${toDir}/${fileName}`
	};
}