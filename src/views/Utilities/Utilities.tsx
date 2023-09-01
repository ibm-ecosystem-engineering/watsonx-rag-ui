
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useAtomValue} from "jotai";

import './Utilities.scss';

import {menuConfigAtomLoadable} from "../../atoms";
import {DemoTile, DemoTileContainer} from "../../components";
import {MenuConfigModel} from "../../models";

export interface UtilitiesProps {
}

export const Utilities: React.FunctionComponent<UtilitiesProps> = () => {
    const loadable = useAtomValue(menuConfigAtomLoadable)

    if (loadable.state === 'loading') {
        return (<></>)
    } else if (loadable.state === 'hasError') {
        return (<></>)
    }

    const menuConfig: MenuConfigModel = loadable.data

    return (
        <DemoTileContainer>
            <DemoTile title="Data Extraction and Population" href={menuConfig.dataExtractionUrl} />
            <DemoTile title="Negative News Screening" href={menuConfig.negativeNewsScreeningUrl} />
        </DemoTileContainer>
    )
}
