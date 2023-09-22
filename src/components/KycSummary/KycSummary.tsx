
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './KycSummary.scss';
import {KycCaseSummaryModel} from "../../models";

export interface KycSummaryProps {
    hideTitle?: boolean;
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

    const content = getContent().split('\n')

    return (
        <div style={{width: '100%', textAlign: 'left'}}>
            {!props.hideTitle ? (<div className="kycSummaryTitle">KYC Summary</div>) : (<></>)}
            {content.map((val, index) => (<p key={index} className="summary">{val}</p>))}
        </div>
    )
}
