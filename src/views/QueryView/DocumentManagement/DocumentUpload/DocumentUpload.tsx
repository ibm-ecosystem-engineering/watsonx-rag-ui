// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';
import {FileUploader} from "@carbon/react";
import {useSetAtom} from "jotai";

import {collectionDocumentsAtom} from "../../../../atoms";
import {AddDocumentResult, documentManagementApi} from "../../../../services";
import {fileUploadHandler} from "../../../../utils";

export interface DocumentUploadProps {
    selectedCollection: string;
    onChange: (docs: AddDocumentResult[]) => void;
}

export const DocumentUpload: React.FunctionComponent<DocumentUploadProps> = (props: DocumentUploadProps) => {
    const [fileStatus, setFileStatus] = useState<'edit' | 'complete' | 'uploading'>('edit')
    const setCollectionDocuments = useSetAtom(collectionDocumentsAtom)

    const handleDocuments = (docs: AddDocumentResult[]) => {
        props.onChange(docs);
        setCollectionDocuments(props.selectedCollection)
    }

    return (
        <div>
            <FileUploader
                labelTitle="Add documents"
                labelDescription="Max file size is 500mb."
                buttonLabel="Add file"
                buttonKind="primary"
                size="md"
                filenameStatus={fileStatus}
                // accept={['.jpg', '.png', '.pdf']}
                multiple={true}
                disabled={false}
                iconDescription="Delete file"
                onChange={fileUploadHandler(documentManagementApi(), props.selectedCollection, handleDocuments, setFileStatus)}
                name="" />
        </div>
    )
}
