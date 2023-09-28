// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Column, FileUploader, Form, Grid, Loading, TextInput} from "@carbon/react";
import {useAtomValue, useSetAtom} from "jotai";

import {kycCaseSummaryAtom, kycCaseSummaryAtomLoadable} from "../../atoms";
import {DocumentStatus, KycSummary, Stack} from "../../components";
import {handleFileUploaderChange} from "../KYC/KYCCaseDetail/util";
import {DocumentModel, KycCaseSummaryModel} from "../../models";
import {Loadable} from "jotai/vanilla/utils/loadable";

export interface KycSummarizeNativeProps {
    returnUrl: string;
}

const KycSummaryPane = (props: {loadable: Loadable<Promise<KycCaseSummaryModel>>}) => {
    const caseSummaryLoadable = props.loadable;

    if (caseSummaryLoadable.state === 'loading') {
        return (
            <Loading
                active={true}
                withOverlay={true}
            />)
    } else if (caseSummaryLoadable.state === 'hasError') {
        return (<div>Error {caseSummaryLoadable.error as string}</div>)
    }

    const summary = caseSummaryLoadable.data

    return (
        <KycSummary kycSummary={summary} />
    )
}

export const KycSummarizeNative: React.FunctionComponent<KycSummarizeNativeProps> = (props: KycSummarizeNativeProps) => {
    const setCaseSummary = useSetAtom(kycCaseSummaryAtom)
    const caseSummaryLoadable = useAtomValue(kycCaseSummaryAtomLoadable)
    const [name, setName] = useState('')
    const [fileStatus, setFileStatus] = useState<'edit' | 'complete' | 'uploading'>('edit')
    const [documents, setDocuments] = useState<DocumentModel[]>([])
    const navigate = useNavigate()

    const handleCancel = () => {
        navigate(props.returnUrl);
    }

    const handleSubmit = (event: {preventDefault: () => void}) => {
        event.preventDefault();

        setCaseSummary(name)
    }

    const context = 'kyc-case';

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Stack gap={5}>
                    <h2>KYC Summary</h2>
                    <TextInput
                        helperText="The name of the customer"
                        id="summaryName"
                        invalidText="Invalid customer name"
                        labelText="Customer name"
                        placeholder="Customer name"
                        value={name}
                        onChange={event => setName(event.target.value)}
                        required={true}
                    />
                    <Grid narrow style={{padding: '0'}}>
                        <Column sm={16} md={8}>
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
                        onChange={handleFileUploaderChange('0', setDocuments, setFileStatus, context, true)}
                        name="" />
                        </Column>
                        <Column sm={16} md={8}>
                    <DocumentStatus context={context} documents={documents} />
                        </Column>
                        </Grid>
                    <div><Button kind="tertiary" onClick={handleCancel}>Cancel</Button> <Button type="submit">Submit</Button></div>
                </Stack>
            </Form>
            <KycSummaryPane loadable={caseSummaryLoadable} />
        </>
    )
}
