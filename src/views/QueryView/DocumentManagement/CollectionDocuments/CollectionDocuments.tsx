// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {Loading} from "@carbon/react";
import {useAtomValue} from "jotai";

import {collectionDocumentsLoadable} from "../../../../atoms";
import {DataTable} from "../../../../components";

export interface CollectionDocumentsProps {
    selectedCollection: string;
}

export const CollectionDocuments: React.FunctionComponent<CollectionDocumentsProps> = (props: CollectionDocumentsProps) => {
    const loadable = useAtomValue(collectionDocumentsLoadable)

    if (loadable.state === 'loading') {
        return (<Loading active={true} description="Loading documents" small={false} withOverlay={false} />)
    } else if (loadable.state === 'hasError') {
        return (<div>Error: {(loadable.error || '').toString()}</div>)
    }

    const headerData = [
        {header: 'Id', key: 'id'},
        {header: 'File name', key: 'filename'},
        {header: 'Status', key: 'status'},

    ]
    const documents = loadable.data.map(doc => ({id: doc.documentId, path: doc.path, filename: doc.filename, status: doc.status}))

    return (<div>
        <DataTable
            headerData={headerData}
            rowData={documents}
            toolbarButtonText="Open case" />
    </div>)
}
