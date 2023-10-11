
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useAtomValue, useSetAtom} from "jotai";

import './QueryView.scss';
import {CollectionSelection} from "./CollectionSelection";
import {collectionIdAtom, collectionIdLoadable} from "../../atoms";
import {Stack} from "../../components";
import {ChatInteraction} from "./ChatInteraction";
import {Column, Grid} from "@carbon/react";
import {DocumentManagement} from "./DocumentManagement/DocumentManagement.tsx";

export interface QueryViewProps {
}

export const QueryView: React.FunctionComponent<QueryViewProps> = () => {
    const loadable = useAtomValue(collectionIdLoadable)
    const setSelectedCollection = useSetAtom(collectionIdAtom)

    if (loadable.state === 'loading') {
        return (<>Loading</>)
    } else if (loadable.state === 'hasError') {
        return (<>Error {loadable.error}</>)
    }

    const selectedCollection = loadable.data

    return (
        <Stack gap={2}>
            <CollectionSelection selectedCollection={selectedCollection} setSelectedCollection={setSelectedCollection} />
            <hr />
            <Grid style={{padding: '0 0'}}>
                <Column sm={8} md={8} lg={8}>
                    <ChatInteraction selectedCollection={selectedCollection} />
                </Column>
                <Column sm={8} md={8} lg={8}>
                    <DocumentManagement selectedCollection={selectedCollection} />
                </Column>
            </Grid>
        </Stack>
    )
}

