
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './KycSummary.scss';
import {KycCaseSummaryModel} from "../../models";

export interface KycSummaryProps {
    kycSummary: KycCaseSummaryModel;
}

export const KycSummary: React.FunctionComponent<KycSummaryProps> = (props: KycSummaryProps) => {

    const getContent = (): string => {
        if (!props.kycSummary) {
            return 'Pending'
        }

        if (props.kycSummary.error) {
            return 'Error'
        }

        return props.kycSummary.summary || '--'
    }

    return (
        <div style={{width: '100%', textAlign: 'left'}}>
            <div className="kycSummaryTitle">KYC Summary</div>
            <p>{getContent()}</p>
        </div>
    )
}
