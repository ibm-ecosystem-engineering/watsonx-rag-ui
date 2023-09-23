
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {KycCaseModel} from "../../models";
import {Stack} from "../Stack";

export interface KycCaseOverviewProps {
    currentCase: KycCaseModel;
}

export const KycCaseOverview: React.FunctionComponent<KycCaseOverviewProps> = (props: KycCaseOverviewProps) => {

    return (
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
    )
}
