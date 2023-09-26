// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ChangeEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Checkbox, FileUploader, Form, TextInput} from "@carbon/react";
import {default as setValue} from "set-value";

import './KYCCaseReview.scss';
import {CountrySelect, DocumentList, EntityTypeSelect, IndustryTypeSelect, Stack} from "../../../../components";
import {createEmptyReviewCase, DocumentModel, FormOptionModel, KycCaseModel, ReviewCaseModel} from "../../../../models";
import {KycCaseManagementApi, kycCaseManagementApi} from "../../../../services";
import {handleFileUploaderChange} from "../util";
import {leftOuter} from "../../../../utils";
import {useSetAtom} from "jotai";
import {selectedKycCaseAtom} from "../../../../atoms";

export interface KYCCaseReviewProps {
    currentCase: KycCaseModel;
    returnUrl: string;
}

export const KYCCaseReview: React.FunctionComponent<KYCCaseReviewProps> = (props: KYCCaseReviewProps) => {
    const navigate = useNavigate();
    const setSelectedCase = useSetAtom(selectedKycCaseAtom)
    const [updatedCase, setUpdatedCase] = useState<ReviewCaseModel>(createEmptyReviewCase(props.currentCase.id))
    const [fileStatus, setFileStatus] = useState<'edit' | 'complete' | 'uploading'>('edit')

    const service: KycCaseManagementApi = kycCaseManagementApi();

    const handleCancel = () => {
        navigate(props.returnUrl);
    }

    const handleSubmit = (event: {preventDefault: () => void}) => {
        event.preventDefault();

        service.reviewCase(updatedCase)
            .then(() => setSelectedCase(undefined))
            .catch(err => console.error(err));

        navigate(props.returnUrl);
    }

    const handleCustomerOutreach = (_: ChangeEvent<HTMLInputElement>, data: {checked: boolean}) => {

        const copy: ReviewCaseModel = JSON.parse(JSON.stringify(updatedCase));

        copy.customerOutreach = data.checked ? 'Pending' : '';

        setUpdatedCase(copy);
    }

    const getValue = (event: ChangeEvent<HTMLInputElement> | {selectedItem: FormOptionModel}): string => {
        if ((event as ChangeEvent<HTMLInputElement>).target) {
            return (event as ChangeEvent<HTMLInputElement>).target.value
        }

        return (event as {selectedItem: FormOptionModel}).selectedItem?.value
    }

    const handleChange = (key: string) => {
        return (event: ChangeEvent<HTMLInputElement> | {selectedItem: FormOptionModel}) => {

            const modifiedCase = JSON.parse(JSON.stringify(updatedCase));

            setValue(modifiedCase, key, getValue(event));

            setUpdatedCase(modifiedCase);
        }
    }

    const handleDocuments = (newDocuments: DocumentModel[]) => {
        const documents = updatedCase.documents.concat(newDocuments)

        setUpdatedCase(Object.assign({}, updatedCase, {documents}))
    }

    return (
        <Form onSubmit={handleSubmit}>
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
            <EntityTypeSelect
                id="caseCustomerEntityType"
                value={props.currentCase.customer.entityType}
                onChange={handleChange('entityType')}
                readOnly={true}
            />
            <IndustryTypeSelect
                id="caseCustomerIndustryType"
                value={props.currentCase.customer.industryType}
                onChange={handleChange('industryType')}
                readOnly={true}
            />
            <div style={{margin: '10px 0'}}>
                <Checkbox
                    id="caseCustomerOutreach"
                    labelText="Outreach required?"
                    checked={!!updatedCase.customerOutreach}
                    value={updatedCase.customerOutreach}
                    onChange={handleCustomerOutreach}
                />
            </div>
            <TextInput
                helperText="The name of the counterparty"
                id="caseCounterpartyName"
                invalidText="Invalid counterparty name"
                labelText="Counterparty name"
                placeholder="Counterparty name"
                value={updatedCase.counterparty?.name || ''}
                onChange={handleChange('counterparty.name')}
                required={true}
            />
            <div style={{paddingBottom: '10px'}}>
            <CountrySelect
                id="caseCounterpartyCountry"
                value={updatedCase.counterparty?.countryOfResidence || 'US'}
                onChange={handleChange('counterparty.countryOfResidence')}
                required={true}
            />
            </div>
            <DocumentList hideEmpty={true} documents={leftOuter(props.currentCase.documents, updatedCase.documents)} />
            <FileUploader
                labelTitle="Add documents"
                labelDescription="Max file size is 500mb."
                buttonLabel="Add file"
                buttonKind="primary"
                size="md"
                filenameStatus={fileStatus}
                // accept={['.jpg', '.png', '.pdf']}
                multiple={true}
                disabled={false}
                iconDescription="Delete file"
                onChange={handleFileUploaderChange(props.currentCase.id, handleDocuments, setFileStatus, 'kyc-case')}
                name="" />
            <div><Button kind="tertiary" onClick={handleCancel}>Cancel</Button> <Button type="submit">Submit</Button></div>
        </Stack>
        </Form>
    )
}
