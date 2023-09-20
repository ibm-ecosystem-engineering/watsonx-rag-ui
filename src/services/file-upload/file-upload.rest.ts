import axios from "axios";

import {FileUploadApi} from "./file-upload.api";
import {DocumentModel} from "../../models";

export class FileUploadRest implements FileUploadApi {
    uploadFile(caseId: string, name: string, file: File): Promise<DocumentModel> {
        const url = '/api/document/upload'

        const form = new FormData();
        form.append('name', name);
        form.append('parentId', caseId);
        form.append('file', file);

        return axios
            .post<DocumentModel>(url, form)
            .then(response => {
                return response.data;
            });
    }

}
