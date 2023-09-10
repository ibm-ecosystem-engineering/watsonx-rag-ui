// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Checkbox, TextInput} from "@carbon/react";

import {CountrySelect, DocumentList, Stack} from "../../../../components";
import {KycCaseModel} from "../../../../models";

export interface KYCCasePendingProps {
    currentCase: KycCaseModel;
    returnUrl: string;
}

export const KYCCasePending: React.FunctionComponent<KYCCasePendingProps> = (props: KYCCasePendingProps) => {
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(props.returnUrl);
    }

    return (
            <Stack gap={5}>
                <h2>Initial Review</h2>
                <TextInput
                    helperText="The name of the customer"
                    id="caseCustomerName"
                    invalidText="Invalid customer name"
                    labelText="Customer name"
                    placeholder="Customer name"
                    value={props.currentCase.customer.name}
                    readOnly={true}
                />
                <CountrySelect
                    id="caseCustomerCountry"
                    value={props.currentCase.customer.countryOfResidence}
                    readOnly={true}
                    style={{marginBottom: '20px'}}
                />
                <TextInput
                    helperText="The current risk category of the customer"
                    id="caseCustomerRiskCategory"
                    invalidText="Invalid risk category"
                    labelText="Current risk category"
                    placeholder="Risk category"
                    value={props.currentCase.customer.riskCategory}
                    readOnly={true}
                />
                <div style={{margin: '10px 0'}}>
                    <Checkbox
                        id="caseCustomerOutreach"
                        labelText="Outreach required?"
                        value={props.currentCase.customerOutreach}
                        readOnly={true}
                    />
                </div>
                <TextInput
                    helperText="The name of the counterparty"
                    id="caseCounterpartyName"
                    invalidText="Invalid counterparty name"
                    labelText="Counterparty name"
                    placeholder="Counterparty name"
                    value={props.currentCase.counterparty?.name || ''}
                    readOnly={true}
                />
                <CountrySelect
                    id="caseCounterpartyCountry"
                    value={props.currentCase.counterparty?.countryOfResidence || 'US'}
                    readOnly={true}
                    style={{marginBottom: '20px'}}
                />
                <DocumentList documents={props.currentCase.documents} />
                <div><Button kind="tertiary" onClick={handleCancel}>Return</Button></div>
            </Stack>
    )
}
