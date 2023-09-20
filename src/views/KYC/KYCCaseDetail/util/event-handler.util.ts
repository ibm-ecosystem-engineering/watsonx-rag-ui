import {DocumentedCase, DocumentModel} from "../../../../models";
import {fileUploadApi, FileUploadApi} from "../../../../services";
import {fileListUtil} from "../../../../utils";

export const handleFileUploaderChange = <T extends DocumentedCase> (caseId: string, updatedCase: T, setUpdatedCase, setFileStatus) => {
    const fileUploadService: FileUploadApi = fileUploadApi();

    return (event: {target: {files: FileList, filenameStatus: string}}) => {
        const fileList: FileList = event.target.files;
        const files: File[] = fileListUtil(fileList);

        console.log('File uploader: ', {event, files: fileList, fileNames: files.map(f => f.name)});

        setFileStatus('uploading')

        // TODO handle document remove
        Promise.all(files.map(f => fileUploadService.uploadFile(caseId, f.name, f)))
            .then((result: DocumentModel[]) => {
                setFileStatus('complete');

                return result.filter(doc => !!doc);
            })
            .then((newDocuments: DocumentModel[]) => {
                const documents = updatedCase.documents.concat(newDocuments)

                setUpdatedCase(Object.assign({}, updatedCase, {documents}))
            })
            .catch(() => setFileStatus('error'))
    }
}
