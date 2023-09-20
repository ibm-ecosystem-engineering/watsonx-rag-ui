import {FileUploadApi} from "./file-upload.api";
import {FileUploadRest} from "./file-upload.rest";

export * from './file-upload.api'

let _instance: FileUploadApi;
export const fileUploadApi = (): FileUploadApi => {
    if (_instance) {
        return _instance;
    }

    return _instance = new FileUploadRest();
}
