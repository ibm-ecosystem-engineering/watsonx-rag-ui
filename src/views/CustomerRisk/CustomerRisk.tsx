// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useAtomValue} from 'jotai';

import './CustomerRisk.scss';

import {menuConfigAtomLoadable} from '../../atoms';
import {MenuConfigModel} from '../../models';
import {DemoTile, DemoTileContainer} from '../../components';

export interface CustomerRiskProps {
}

export const CustomerRisk: React.FunctionComponent<CustomerRiskProps> = () => {
    const loadable = useAtomValue(menuConfigAtomLoadable)

    if (loadable.state === 'loading') {
        return (<></>)
    } else if (loadable.state === 'hasError') {
        return (<></>)
    }

    const menuConfig: MenuConfigModel = loadable.data

    return (
        <DemoTileContainer>
            <DemoTile title="Risk Assessment Engine" href={menuConfig.riskAssessmentEngineUrl} />
            <DemoTile title="Assessment Risk Studio" href={menuConfig.assessmentRulesStudioUrl} />
        </DemoTileContainer>
    )
}
