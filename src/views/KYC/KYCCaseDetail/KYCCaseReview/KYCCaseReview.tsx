// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ChangeEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Checkbox, FileUploader, Form, TextInput} from "@carbon/react";
import {default as setValue} from "set-value";

import './KYCCaseReview.scss';
import {CountrySelect, Stack} from "../../../../components";
import {createEmptyReviewCase, KycCaseModel, ReviewCaseModel} from "../../../../models";
import {kycCaseManagementApi} from "../../../../services";
import {fileListUtil} from "../../../../utils";

export interface KYCCaseReviewProps {
    currentCase: KycCaseModel;
    returnUrl: string;
}

export const KYCCaseReview: React.FunctionComponent<KYCCaseReviewProps> = (props: KYCCaseReviewProps) => {
    const navigate = useNavigate();
    const [updatedCase, setUpdatedCase] = useState<ReviewCaseModel>(createEmptyReviewCase(props.currentCase.id))
    const [fileStatus, setFileStatus] = useState<'edit' | 'complete' | 'uploading'>('edit')

    const service = kycCaseManagementApi();

    const handleCancel = () => {
        navigate(props.returnUrl);
    }

    const handleSubmit = (event: {preventDefault: () => void}) => {
        event.preventDefault();

        service.reviewCase(updatedCase).catch(err => console.error(err));

        navigate(props.returnUrl);
    }

    const handleFileUploaderChange = (event: {target: {files: FileList, filenameStatus: string}}) => {
        const files: FileList = event.target.files;
        const fileNames = fileListUtil(files).map(f => f.name)

        console.log('File uploader: ', {event, files, fileNames});


        setFileStatus('uploading')
        setTimeout(() => setFileStatus('complete'), 1000)

        // TODO handle document remove
        const documents = updatedCase.documents.concat(fileNames.map(name => ({name, path: name, id: ''})))

        setUpdatedCase(Object.assign({}, updatedCase, {documents}))

    }

    const handleCustomerOutreach = (_: ChangeEvent<HTMLInputElement>, data: {checked: boolean}) => {

        const copy: ReviewCaseModel = JSON.parse(JSON.stringify(updatedCase));

        copy.customerOutreach = data.checked ? 'Pending' : '';

        setUpdatedCase(copy);
    }

    const handleChange = (key: string) => {
        return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

            const copy = JSON.parse(JSON.stringify(updatedCase));

            setValue(copy, key, event.target.value);

            setUpdatedCase(copy);
        }
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
                onChange={handleChange('counterParty.name')}
                required={true}
            />
            <CountrySelect
                id="caseCounterpartyCountry"
                value={updatedCase.counterparty?.countryOfResidence || 'US'}
                onChange={handleChange('counterParty.countryOfResidence')}
                required={true}
                style={{marginBottom: '20px'}}
            />
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
                onChange={handleFileUploaderChange}
                name="" />
            <div><Button kind="tertiary" onClick={handleCancel}>Cancel</Button> <Button type="submit">Submit</Button></div>
        </Stack>
        </Form>
    )
}
