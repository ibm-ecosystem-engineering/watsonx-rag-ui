// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {Provider} from "jotai/react";

import {CollectionDocuments} from "./CollectionDocuments";
import {DocumentUpload} from "./DocumentUpload";
import {HydrateAtoms, Stack} from "../../../components";
import {collectionDocumentsAtom} from "../../../atoms";
import {AddDocumentResult, documentManagementApi} from "../../../services";

export interface DocumentManagementProps {
    selectedCollection: string;
}

export const DocumentManagement: React.FunctionComponent<DocumentManagementProps> = (props: DocumentManagementProps) => {

    const handleChange = (docs: AddDocumentResult[]) => {
        console.log('Docs changed: ', {docs})
    }

    if (!props.selectedCollection) {
        return (<div></div>)
    }

    return (
        <Provider>
            <HydrateAtoms initialValues={[[collectionDocumentsAtom, documentManagementApi().listDocuments({collectionId: props.selectedCollection}).then(result => result.documents)]]}>
                <Stack gap={2}>
                    <DocumentUpload selectedCollection={props.selectedCollection} onChange={handleChange} />
                    <CollectionDocuments selectedCollection={props.selectedCollection} />
                </Stack>
            </HydrateAtoms>
        </Provider>
    )
}
