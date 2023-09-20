// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Checkbox, FileUploader, Form, TextInput} from "@carbon/react";

import './KYCCaseOutreach.scss';
import {CountrySelect, DocumentList, EntityTypeSelect, IndustryTypeSelect, Stack} from "../../../../components";
import {ApproveCaseModel, createEmptyApproveCase, KycCaseModel,} from "../../../../models";
import {KycCaseManagementApi, kycCaseManagementApi} from "../../../../services";
import {handleFileUploaderChange} from "../util";
import {leftOuter} from "../../../../utils";
import {useSetAtom} from "jotai";
import {selectedKycCaseAtom} from "../../../../atoms";

export interface KYCCaseReviewProps {
    currentCase: KycCaseModel;
    returnUrl: string;
}

export const KYCCaseOutreach: React.FunctionComponent<KYCCaseReviewProps> = (props: KYCCaseReviewProps) => {
    const navigate = useNavigate();
    const setSelectedCase = useSetAtom(selectedKycCaseAtom)
    const [updatedCase, setUpdatedCase] = useState<ApproveCaseModel>(createEmptyApproveCase(props.currentCase.id))
    const [fileStatus, setFileStatus] = useState<'edit' | 'complete' | 'uploading'>('edit')

    const service: KycCaseManagementApi = kycCaseManagementApi();

    const handleCancel = () => {
        navigate(props.returnUrl);
    }

    const handleSubmit = (event: {preventDefault: () => void}) => {
        event.preventDefault();

        service.approveCase(updatedCase)
            .then(() => setSelectedCase(undefined))
            .catch(err => console.error(err));

        navigate(props.returnUrl);
    }


    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={5}>
                <h2>Outreach</h2>
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
                        checked={!!props.currentCase.customerOutreach}
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
                <DocumentList documents={leftOuter(props.currentCase.documents, updatedCase.documents)} />
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
                    onChange={handleFileUploaderChange(props.currentCase.id, updatedCase, setUpdatedCase, setFileStatus)}
                    name="" />
                <div><Button kind="tertiary" onClick={handleCancel}>Cancel</Button> <Button type="submit">Submit</Button></div>
            </Stack>
        </Form>
    )
}
