import * as Stream from "stream";

export const streamToBuffer = async (stream: Stream): Promise<Buffer> => {
    return new Promise<Buffer>((resolve, reject) => {

        const chunks = [];

        stream.on('data', (data) => chunks.push(data));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', (err) => reject(err));
    });
}
