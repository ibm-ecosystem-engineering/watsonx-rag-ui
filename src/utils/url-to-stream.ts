import * as Stream from "stream";
import axios from "axios";

export const urlToStream = async (url: string): Promise<Stream> => {
    return axios.get(url, {
        responseType: 'stream',
    })
        .then(response => response.data)
}
