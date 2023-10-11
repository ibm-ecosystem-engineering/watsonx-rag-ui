import {GenerativeApi} from "./generative.api.ts";
import {GenerativeGraphql} from "./generative.graphql.ts";

export * from './generative.api'

let _instance: GenerativeApi;
export const generativeApi = (): GenerativeApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new GenerativeGraphql();
}
