import axios from "axios";

import {FileUploadApi, FileUploadContext, ListFileRequest} from "./file-upload.api";
import {DocumentModel, DocumentStatusModel} from "../../models";

interface ListFilesParams {
    context?: FileUploadContext;
    status?: string;
}

export class FileUploadRest implements FileUploadApi {
    uploadFile(caseId: string, name: string, file: File, context: FileUploadContext = 'kyc-case', standalone: boolean = false): Promise<DocumentModel> {
        const url = '/api/document/upload'

        const form = new FormData();
        form.append('name', name);
        form.append('parentId', caseId);
        form.append('context', context);
        form.append('file', file);
        form.append('standalone', '' + standalone);

        return axios
            .post<DocumentModel>(url, form)
            .then(response => {
                return response.data;
            });
    }

    async listFiles({context, statuses}: ListFileRequest = {context: 'kyc-case'}): Promise<DocumentStatusModel[]> {
        const url: string = '/api/document'

        const params: ListFilesParams = {context}
        if (statuses) {
            params.status = statuses.join(',')
        }

        return axios
            .get<DocumentStatusModel[]>(url, {params})
            .then(response => response.data)
    }

}
