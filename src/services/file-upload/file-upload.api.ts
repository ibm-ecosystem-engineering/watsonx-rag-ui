import {DocumentModel, DocumentStatusModel} from "../../models";

export type FileUploadContext = 'data-extraction' | 'kyc-case';

export const isFileUploadContext = (value: unknown): value is FileUploadContext => {
    return value === 'data-extraction' || value === 'kyc-case';
}

export interface ListFileRequest {
    context?: FileUploadContext,
    statuses?: string[],
}

export abstract class FileUploadApi {
    abstract uploadFile(caseId: string, name: string, file: File, context?: FileUploadContext, standalone?: boolean): Promise<DocumentModel>;
    abstract listFiles(request?: ListFileRequest): Promise<DocumentStatusModel[]>;
}
