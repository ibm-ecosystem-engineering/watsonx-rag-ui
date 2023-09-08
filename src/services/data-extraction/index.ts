import {DataExtractionApi} from "./data-extraction.api.ts";
import {DataExtractionMock} from "./data-extraction.mock.ts";

export * from './data-extraction.api';

let _instance: DataExtractionApi;
export const dataExtractionApi = (): DataExtractionApi => {
    if (_instance) {
        return _instance;
    }

    return _instance = new DataExtractionMock();
}
