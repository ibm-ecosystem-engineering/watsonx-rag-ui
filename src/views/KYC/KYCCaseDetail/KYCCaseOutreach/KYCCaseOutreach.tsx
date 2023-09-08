// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useNavigate} from "react-router-dom";
import {useAtomValue} from "jotai";
import {Button, FileUploader, Select, SelectItem, TextInput} from "@carbon/react";
import {Stack} from "@carbon/react/lib/components/Stack"

import './KYCCaseOutreach.scss';
import {countriesAtomLoadable} from "../../../../atoms";
import {KycCaseModel} from "../../../../models";
import {kycCaseManagementApi} from "../../../../services";
import {DocumentList} from "../../../../components";

export interface KYCCaseReviewProps {
    currentCase: KycCaseModel;
    returnUrl: string;
}

export const KYCCaseOutreach: React.FunctionComponent<KYCCaseReviewProps> = (props: KYCCaseReviewProps) => {
    const countriesLoadable = useAtomValue(countriesAtomLoadable);
    const navigate = useNavigate();

    const service = kycCaseManagementApi();

    const countries = countriesLoadable.state === 'hasData' ? countriesLoadable.data : [];

    const handleCancel = () => {
        navigate(props.returnUrl);
    }

    const handleSubmit = (event: {preventDefault: () => void}) => {
        event.preventDefault();

        service.reviewCase(props.currentCase.id, '').catch(err => console.error(err));

        navigate(props.returnUrl);
    }

    return (
        <Stack>
            <h2>Customer Outreach</h2>
            <TextInput
                helperText="The name of the customer"
                id="caseCustomerName"
                invalidText="Invalid customer name"
                labelText="Customer name"
                placeholder="Customer name"
                value={props.currentCase.customer.name}
                readOnly={true}
            />
            <Select
                id="caseCustomerCountry"
                invalidText="Invalid country selected"
                labelText="Country of residence"
                disabled={countriesLoadable.state !== 'hasData'}
                value={props.currentCase.customer.countryOfResidence}
                readOnly={true}
                style={{marginBottom: '20px'}}
            >
                {countries.map(option => <SelectItem key={option.value} text={option.text} value={option.value} />)}
            </Select>
            <TextInput
                helperText="The current risk category of the customer"
                id="caseCustomerRiskCategory"
                invalidText="Invalid risk category"
                labelText="Current risk category"
                placeholder="Risk category"
                value={props.currentCase.customer.riskCategory}
                readOnly={true}
            />
            <TextInput
                helperText="The name of the counterparty"
                id="caseCounterpartyName"
                invalidText="Invalid counterparty name"
                labelText="Counterparty name"
                placeholder="Counterparty name"
                value={props.currentCase.counterParty?.name || ''}
                readOnly={true}
            />
            <Select
                id="caseCounterpartyCountry"
                invalidText="Invalid counterparty country selected"
                labelText="Counterparty country"
                disabled={countriesLoadable.state !== 'hasData'}
                value={props.currentCase.counterParty?.countryOfResidence || 'US'}
                readOnly={true}
                style={{marginBottom: '20px'}}
            >
                {countries.map(option => <SelectItem key={option.value} text={option.text} value={option.value} />)}
            </Select>
            <DocumentList documents={props.currentCase.documents} />
            <FileUploader
                labelTitle="Add documents"
                labelDescription="Max file size is 500mb."
                buttonLabel="Add file"
                buttonKind="primary"
                size="md"
                filenameStatus="edit"
                // accept={['.jpg', '.png', '.pdf']}
                multiple={true}
                disabled={false}
                iconDescription="Delete file"
                name="" />
            <div><Button kind="tertiary" onClick={handleCancel}>Cancel</Button> <Button type="submit" onClick={handleSubmit}>Submit</Button></div>
        </Stack>
    )
}
