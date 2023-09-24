// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useAtomValue, useSetAtom} from "jotai";
import {
    Button,
    Checkbox, Column,
    DataTableHeader,
    FileUploader,
    Form,
    FormGroup,
    Grid,
    Loading,
    TextInput
} from "@carbon/react";

import './DataExtraction.scss';
import {
    dataExtractionQuestionAtomLoadable,
    dataExtractionResultsAtom,
    dataExtractionResultsAtomLoadable
} from "../../atoms";
import {DataExtractionApi, dataExtractionApi} from "../../services";
import {DataTable, Stack} from "../../components";
import {DataExtractionQuestionModel} from "../../models";
import {Loadable} from "jotai/vanilla/utils/loadable";
import {handleFileUploaderChange} from "../KYC/KYCCaseDetail/util";
import {WebChatConfig, WebChatContainer} from "@ibm-watson/assistant-web-chat-react";

export interface DataExtractionProps {
}

interface DataExtractionValues {
    state: string;
    customer: string;
    questions: DataExtractionQuestionModel[];
}

const createEmptyDataExtractionValues = (questionLoadable: Loadable<Promise<DataExtractionQuestionModel[]>>): DataExtractionValues => {
    const questions = questionLoadable.state === 'hasData' ? questionLoadable.data : []

    return {
        state: questionLoadable.state,
        customer: '',
        questions,
    }
}

export const DataExtraction: React.FunctionComponent<DataExtractionProps> = () => {
    const questionLoadable = useAtomValue(dataExtractionQuestionAtomLoadable)
    const [dataExtraction, setDataExtraction] = useState<DataExtractionValues>(createEmptyDataExtractionValues(questionLoadable))
    const [fileStatus, setFileStatus] = useState<'edit' | 'complete' | 'uploading'>('edit')
    const setResults = useSetAtom(dataExtractionResultsAtom)

    const service: DataExtractionApi = dataExtractionApi()

    if (questionLoadable.state === 'loading') {
        return (
            <Loading
                active={true}
                description="Active loading indicator" withOverlay={false}
            />
        )
    } else if (questionLoadable.state === 'hasError') {
        return (<div>Error</div>)
    }

    const questions: DataExtractionQuestionModel[] = questionLoadable.data;

    if (dataExtraction.state === 'loading') {
        setDataExtraction(Object.assign(
            {},
            dataExtraction,
            {
                state: 'hasData',
                questions: questions.filter(val => val.inScope)
            }
        ))
    }

    const handleCustomer = (event: {target: {value: string}}) => {
        const newValues = Object.assign({}, dataExtraction, {customer: event.target.value})

        setDataExtraction(newValues);
    }

    const handleQuestion = (question: DataExtractionQuestionModel) => {
        return (_: ChangeEvent<HTMLInputElement>, {checked}: {checked: boolean}) => {
            const questions = dataExtraction.questions.slice()

            const index: number = questions.map(q => q.id).indexOf(question.id)

            if (checked && index < 0) {
                questions.push(question);
            } else if (!checked && index >= 0) {
                questions.splice(index, 1)
            }

            setDataExtraction(Object.assign({}, dataExtraction, {questions: questions.sort((a, b) => (parseInt(a.id) - parseInt(b.id)))}))
        }
    }

    const containsQuestion = (question: DataExtractionQuestionModel) => {
        return dataExtraction.questions.some(target => target.id === question.id)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setResults(service.extractData(dataExtraction.customer, dataExtraction.questions));
    }

    const handleReset = () => {
        setResults(Promise.resolve([]))
    }

    const webChatConfig: WebChatConfig = {
        integrationID: '76f5a344-3d6e-4e87-89d4-ec4fb39ee08a', // The ID of this integration.
        region: 'us-south', // The region your integration is hosted in.
        serviceInstanceID: '683c39a0-98db-4651-b97d-49f770fb058c', // The ID of your service instance.
    }

    return (
        <div>
        <Form onSubmit={handleSubmit}>
            <Stack gap={5}>
                <h2>KYC Data Extraction</h2>
                <TextInput
                    helperText="The name of the customer"
                    id="extractionName"
                    invalidText="Invalid customer name"
                    labelText="Customer name"
                    placeholder="Customer name"
                    value={dataExtraction.customer}
                    onChange={handleCustomer}
                    required={true}
                />
                <Grid narrow style={{padding: '0'}}>
                    <Column sm={16} md={8}>
                <FormGroup legendText="Select checklist" style={{textAlign: 'left', paddingBottom: '15px'}}>
                    {questions.map(question => {
                        return (<Checkbox
                            id={'question-' + question.id}
                            labelText={question.question}
                            key={question.id}
                            checked={containsQuestion(question)}
                            onChange={handleQuestion(question)}
                        />)
                    })}
                </FormGroup>
                    </Column>
                    <Column sm={16} md={8}>
                <FormGroup legendText="Upload files to Discovery" style={{textAlign: 'left'}}>
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
                    onChange={handleFileUploaderChange('0', () => {}, setFileStatus, 'data-extraction')}
                    name="" />
                </FormGroup>
                    </Column>
                </Grid>
                <div><Button kind="tertiary" onClick={handleReset}>Reset</Button> <Button type="submit">Submit</Button></div>
            </Stack>
        </Form>
            <WebChatContainer config={webChatConfig} />
            <DataExtractionResults />
        </div>
    )
}

const DataExtractionResults = () => {
    const resultsLoadable = useAtomValue(dataExtractionResultsAtomLoadable)

    if (resultsLoadable.state === 'loading') {
        return (<Loading
            active={true}
            description="Active loading indicator" withOverlay={false}
        />)
    } else if (resultsLoadable.state === 'hasError') {
        return (<div>Error loading results</div>)
    }

    const results = resultsLoadable.data;

    if (results.length === 0) {
        return (<></>)
    }

    const headerData: DataTableHeader[] = [
        {header: 'Question', key: 'question'},
        {header: 'Prompt', key: 'prompt'},
        {header: 'WatsonX Response', key: 'watsonxResponse'}
    ]

    return (
        <div className="dataExtractionResultContainer">
            <h3>Results</h3>
            <DataTable headerData={headerData} rowData={results} />
        </div>
    )
}
