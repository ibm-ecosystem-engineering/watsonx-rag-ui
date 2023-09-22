// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button} from "@carbon/react";
import {useSetAtom} from "jotai";

import './KYCCasePending.scss';
import {selectedKycCaseAtom} from "../../../../atoms";
import {CustomerRisk, DocumentList, KycSummary, NegativeNews, Stack} from "../../../../components";
import {KycCaseModel} from "../../../../models";
import {kycCaseManagementApi} from "../../../../services";

export interface KYCCasePendingProps {
    currentCase: KycCaseModel;
    returnUrl: string;
}

export const KYCCasePending: React.FunctionComponent<KYCCasePendingProps> = (props: KYCCasePendingProps) => {
    const navigate = useNavigate();
    const setSelectedCase = useSetAtom(selectedKycCaseAtom)
    const service = kycCaseManagementApi();

    const handleCancel = () => {
        navigate(props.returnUrl);
    }

    const handleRefresh = () => {
        service.processCase(props.currentCase.id)
            .then(kycCase => setSelectedCase(kycCase))
            .catch(err => console.error('Error processing case: ', {err}))
    }

    return (
            <Stack gap={7}>
                <h2>Pending information</h2>
                <div className="infoBox">
                    <Stack gap={3}>
                        <div><span className="label">Customer name:</span> {props.currentCase.customer.name}</div>
                        <div><span className="label">Country:</span> {props.currentCase.customer.countryOfResidence}</div>
                        <div><span className="label">Entity type:</span> {props.currentCase.customer.entityType}</div>
                        <div><span className="label">Industry type:</span> {props.currentCase.customer.industryType}</div>
                        <div><span className="label">Customer outreach:</span> {props.currentCase.customerOutreach || 'N/A'}</div>
                        <div><span className="label">Counterparty name:</span> {props.currentCase.counterparty.name}</div>
                        <div><span className="label">Counterparty country:</span> {props.currentCase.counterparty.countryOfResidence}</div>
                    </Stack>
                </div>
                <DocumentList documents={props.currentCase.documents} />
                <div><Button onClick={handleRefresh}>Refresh</Button></div>
                <NegativeNews type="Party" news={props.currentCase.negativeScreening} />
                <NegativeNews type="Counterparty" news={props.currentCase.counterpartyNegativeScreening} />
                <CustomerRisk customerRisk={props.currentCase.customerRiskAssessment} />
                <KycSummary kycSummary={props.currentCase.caseSummary} />
                <div><Button kind="tertiary" onClick={handleCancel}>Return</Button></div>
            </Stack>
    )
}
