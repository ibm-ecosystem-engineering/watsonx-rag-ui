import {DataExtractionApi} from "./data-extraction.api";
import {DataExtractionGraphql} from "./data-extraction.graphql";

export * from './data-extraction.api';

let _instance: DataExtractionApi;
export const dataExtractionApi = (): DataExtractionApi => {
    if (_instance) {
        return _instance;
    }

    return _instance = new DataExtractionGraphql();
}
