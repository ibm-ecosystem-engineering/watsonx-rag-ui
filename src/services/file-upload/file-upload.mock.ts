import {FileUploadApi} from "./file-upload.api";
import {kycCaseManagementApi, KycCaseManagementApi} from "../kyc-case-management";
import {DocumentModel} from "../../models";

export class FileUploadMock implements FileUploadApi {
    service: KycCaseManagementApi;

    constructor() {
        this.service = kycCaseManagementApi();
    }

    async uploadFile(caseId: string, name: string): Promise<DocumentModel> {

        const content = Buffer.from('')
        return this.service.addDocumentToCase(caseId, name, {content})
    }

}
