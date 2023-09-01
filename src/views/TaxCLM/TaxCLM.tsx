// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './TaxCLM.scss';
import {useAtomValue} from "jotai/index";
import {menuConfigAtomLoadable} from "../../atoms";
import {MenuConfigModel} from "../../models";
import {DemoTile, DemoTileContainer} from "../../components";

export interface TaxCLMProps {
}

export const TaxCLM: React.FunctionComponent<TaxCLMProps> = () => {
    const loadable = useAtomValue(menuConfigAtomLoadable)

    if (loadable.state === 'loading') {
        return (<></>)
    } else if (loadable.state === 'hasError') {
        return (<></>)
    }

    const menuConfig: MenuConfigModel = loadable.data

    return (
        <DemoTileContainer>
            <DemoTile title="Contract Compliance Check" href={menuConfig.contractComplianceCheckUrl} />
        </DemoTileContainer>
    )
}
