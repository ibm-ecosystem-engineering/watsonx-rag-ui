
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {KycCaseModel} from "../../../../models";

export interface KYCCaseCompletedProps {
    currentCase: KycCaseModel;
    returnUrl: string;
}

export const KYCCaseCompleted: React.FunctionComponent<KYCCaseCompletedProps> = (props: KYCCaseCompletedProps) => {

    return (<div>Completed</div>)
}
