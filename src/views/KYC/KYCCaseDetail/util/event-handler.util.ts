import {DocumentModel} from "../../../../models";
import {fileUploadApi, FileUploadApi, FileUploadContext} from "../../../../services";
import {fileListUtil} from "../../../../utils";

export const handleFileUploaderChange = (id: string, handleNewDocuments: (newDocuments: DocumentModel[]) => void, setFileStatus: (status: unknown) => void, context: FileUploadContext = 'kyc-case') => {
    const fileUploadService: FileUploadApi = fileUploadApi();

    return (event: {target: {files: FileList, filenameStatus: string}}) => {
        const fileList: FileList = event.target.files;
        const files: File[] = fileListUtil(fileList);

        console.log('File uploader: ', {event, files: fileList, fileNames: files.map(f => f.name)});

        setFileStatus('uploading')

        // TODO handle document remove
        Promise.all(files.map(f => fileUploadService.uploadFile(id, f.name, f, context)))
            .then((result: DocumentModel[]) => {
                setFileStatus('complete');

                return result.filter(doc => !!doc);
            })
            .then(handleNewDocuments)
            .catch(() => setFileStatus('error'))
    }
}
