// Require Node Dependencies
import * as fs from "fs/promises";
import * as path from "path";

// Require External Dependencies
import fetch from "cross-fetch";

// Vars
const imageRegex = new RegExp("\.(gif|jpe?g|tiff?|png|webp|bmp|ico)$", "i");

export interface Image {
    path?: string,
    uri?: string,
}

export interface ResponsePayload {
    base64?: string
}

export async function imageToBase64(image: Image): Promise<ResponsePayload> {
    let base64: string = "";

    if (image.uri) {
        const uri = new URL(image.uri!);

        // @ts-ignore
        const imageBuffer = await (await fetch(uri)).buffer();

        base64 = imageBuffer.toString('base64');
    }
    else if (image.path && imageRegex.test(image.path)) {
        let isFile: boolean;

        isFile = (await fs.stat(image.path)).isFile();
        if (isFile!) {
            const imageBuffer = await fs.readFile(path.resolve(image.path));

            base64 = imageBuffer.toString('base64');
        }
    }
    else {
        throw new Error("Didn\'t get an image or a good uri for the appropriate param");
    }

    return { base64 };
}