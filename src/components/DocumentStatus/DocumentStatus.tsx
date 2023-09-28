// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useEffect} from 'react';
import {useAtom} from "jotai";
import {timer} from "rxjs";

import {documentStatusAtom} from "../../atoms/document-status.atom";
import {DocumentModel, DocumentStatusModel} from "../../models";
import {fileUploadApi, FileUploadContext, ListFileRequest} from "../../services";
import {first} from "../../utils";

export interface DocumentStatusProps {
    context: FileUploadContext;
    statuses?: string[];
    documents: DocumentModel[];
}

const buildRequest = ({context, statuses}: {context: FileUploadContext, statuses?: string[]}): ListFileRequest => {
    const request: ListFileRequest = {context}

    if (statuses) {
        request.statuses = statuses;
    }

    return request;
}

const getFilename = (id: string, docs: DocumentModel[]): string => {
    return first(docs.filter(doc => doc.id === id).map(doc => doc.name)).orElse(undefined)
}

export const DocumentStatus: React.FunctionComponent<DocumentStatusProps> = (props: DocumentStatusProps) => {
    const [documentStatus, setDocumentStatus] = useAtom(documentStatusAtom)
    useEffect(() => {
        const handle = timer(500, 30000).subscribe({
            next: async () => {
                if (props.documents.length === 0 && documentStatus.length === 0) {
                    return
                }

                const result: DocumentStatusModel[] = await fileUploadApi().listFiles(buildRequest(props))

                setDocumentStatus(result
                    .map(doc => Object.assign(doc, {name: getFilename(doc.id, props.documents)}))
                    .filter(doc => !!doc.name)
                )
            }
        })

        return () => handle.unsubscribe();
    })

    if (documentStatus.length === 0) {
        return (<></>)
    }

    return (
        <div style={{justifyContent: 'flex-start'}}>
            <div className="cds--file--label" style={{textAlign: 'left'}}>Document status</div>
            <ul>
                {documentStatus.map(val => (<li key={val.id} style={{textAlign: 'left'}}>{val.name || val.id} - {val.status}</li>))}
            </ul>
        </div>
    )
}
