import {DocumentModel} from "../../models";

export abstract class FileUploadApi {
    abstract uploadFile(caseId: string, name: string, file: File): Promise<DocumentModel>;
}
