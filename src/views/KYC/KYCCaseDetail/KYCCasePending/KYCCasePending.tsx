// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Checkbox, TextInput} from "@carbon/react";

import {
    CountrySelect,
    CustomerRisk,
    DocumentList,
    EntityTypeSelect,
    IndustryTypeSelect, KycSummary, NegativeNews,
    Stack
} from "../../../../components";
import {KycCaseModel} from "../../../../models";
import {kycCaseManagementApi} from "../../../../services";
import {useSetAtom} from "jotai";
import {selectedKycCaseAtom} from "../../../../atoms";

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
            <Stack gap={5}>
                <h2>Pending information</h2>
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
                <EntityTypeSelect
                    id="caseCustomerEntityType"
                    value={props.currentCase.customer.entityType}
                    readOnly={true}
                />
                <IndustryTypeSelect
                    id="caseCustomerIndustryType"
                    value={props.currentCase.customer.industryType}
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
                <div><Button onClick={handleRefresh}>Refresh</Button></div>
                <NegativeNews type="Party" news={props.currentCase.negativeScreening} />
                <NegativeNews type="Counterparty" news={props.currentCase.counterpartyNegativeScreening} />
                <CustomerRisk customerRisk={props.currentCase.customerRiskAssessment} />
                <KycSummary kycSummary={props.currentCase.caseSummary} />
                <div><Button kind="tertiary" onClick={handleCancel}>Return</Button></div>
            </Stack>
    )
}
