import Stream from "stream";
import {isDocumentContent, isDocumentRef} from "../models";
import {urlToStream} from "./url-to-stream.ts";
import {streamToBuffer} from "./stream-to-buffer.ts";

export const loadDocument = async (document: {url: string} | {content: Buffer} | {stream: Stream}): Promise<Buffer> => {
    if (isDocumentContent(document)) {
        return document.content;
    }

    const stream: Stream = isDocumentRef(document)
        ? await urlToStream(document.url)
        : document.stream;

    return streamToBuffer(stream);
}
