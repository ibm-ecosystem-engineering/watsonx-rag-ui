import {fileListUtil} from "./file-list.ts";

export interface AddDocumentParams {
    collectionId?: string;
    fileContent: File;
    filename: string;
    metadata?: Record<string, any>
}

export interface AddDocumentResult {
    documentId: string;
    collectionId: string;
}

export interface FileUploadApi {
    addDocument(params: AddDocumentParams): Promise<AddDocumentResult>;
}

export const fileUploadHandler = (service: FileUploadApi, collectionId: string, handleNewDocuments: (newDocuments: AddDocumentResult[]) => void, setFileStatus: (status: unknown) => void) => {
    return (event: {target: {files: FileList, filenameStatus: string}}) => {
        const fileList: FileList = event.target.files;
        const files: File[] = fileListUtil(fileList);

        console.log('File uploader: ', {event, files: fileList, fileNames: files.map(f => f.name)});

        setFileStatus('uploading')

        // TODO handle document remove
        Promise.all(files.map(f => service.addDocument({collectionId, fileContent: f, filename: f.name,})))
            .then((result: AddDocumentResult[]) => {
                setFileStatus('complete');

                return result.filter(doc => !!doc);
            })
            .then(handleNewDocuments)
            .catch(err => {
                console.log('Error uploading file: ', {err})
                setFileStatus('error')
            })
    }
}
