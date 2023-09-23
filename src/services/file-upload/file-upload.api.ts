import {DocumentModel} from "../../models";

export type FileUploadContext = 'data-extraction' | 'kyc-case';

export abstract class FileUploadApi {
    abstract uploadFile(caseId: string, name: string, file: File, context?: FileUploadContext): Promise<DocumentModel>;
}
