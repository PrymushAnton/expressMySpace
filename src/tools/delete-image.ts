import { unlink } from "fs/promises";
import { join } from "path";

export async function deleteImage(file: string): Promise<void> {

    try {
		const filePath = join(__dirname, "../", "../", "media", file);
		await unlink(filePath);
	} catch (error) {
		console.error("Error deleting image:", error);
	}
}