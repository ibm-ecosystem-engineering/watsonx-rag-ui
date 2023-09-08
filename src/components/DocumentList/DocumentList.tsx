
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {ListItem, UnorderedList} from "@carbon/react";

import './DocumentList.scss';
import {DocumentModel} from "../../models";

export interface DocumentListProps {
    documents: DocumentModel[]
}

export const DocumentList: React.FunctionComponent<DocumentListProps> = (props: DocumentListProps) => {
    if (!props.documents || props.documents.length === 0) {
        return (
            <div className="document-list">
            <div className="cds--form-item">
            <label className="cds-label">Documents</label>
            <p>None</p>
            </div>
            </div>
        );
    }

    return (
        <div className="document-list">
            <div className="cds--form-item">
                <label className="cds-label">Documents</label>
                <UnorderedList className="document-list-ul" isExpressive={true} nested={false}>
                    {props.documents.map(doc => (<ListItem key={doc.id}><a href={doc.path}>{doc.name}</a></ListItem>))}
                </UnorderedList>
            </div>
        </div>
    )
}
