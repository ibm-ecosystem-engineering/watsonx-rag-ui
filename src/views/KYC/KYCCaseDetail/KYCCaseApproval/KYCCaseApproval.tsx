
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {KycCaseModel} from "../../../../models";

export interface KYCCaseApprovalProps {
    currentCase: KycCaseModel;
    returnUrl: string;
}

export const KYCCaseApproval: React.FunctionComponent<KYCCaseApprovalProps> = (props: KYCCaseApprovalProps) => {

    return (<div>Approve</div>)
}
