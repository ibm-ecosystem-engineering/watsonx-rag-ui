
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useAtomValue} from "jotai";

import {menuConfigAtomLoadable} from "../../atoms";
import {MenuConfigModel} from "../../models";
import {DemoTile, DemoTileContainer} from "../../components";

export interface KycSummarizeProps {
}

export const KycSummarize: React.FunctionComponent<KycSummarizeProps> = () => {
    const loadable = useAtomValue(menuConfigAtomLoadable)

    if (loadable.state === 'loading') {
        return (<></>)
    } else if (loadable.state === 'hasError') {
        return (<></>)
    }

    const menuConfig: MenuConfigModel = loadable.data

    return (
        <DemoTileContainer>
            <DemoTile title="Kyc Summarization" href={menuConfig.kycSummarizationUrl} />
        </DemoTileContainer>
    )
}
