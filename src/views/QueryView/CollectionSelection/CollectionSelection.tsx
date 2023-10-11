// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useAtomValue} from "jotai";

import {collectionListLoadable} from "../../../atoms";
import {AtomComboBox} from "../../../components";
import {FormOptionModel} from "../../../models";

export interface CollectionSelectionProps {
    selectedCollection: string;
    setSelectedCollection: (id: string) => void;
}

export const CollectionSelection: React.FunctionComponent<CollectionSelectionProps> = (props: CollectionSelectionProps) => {
    const loadable = useAtomValue(collectionListLoadable)

    // TODO implement add case
    return (
        <div style={{width: '100%'}}>
            <AtomComboBox
                id="Collections"
                loadable={loadable}
                value={props.selectedCollection}
                invalidText="Invalid collection"
                labelText="Select collection"
                onChange={(data: {selectedItem: FormOptionModel}) => props.setSelectedCollection(data.selectedItem.value)}
            />
        </div>)
}
