// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useAtomValue, useSetAtom} from "jotai";
import {Button, Checkbox, DataTableHeader, Form, FormGroup, Loading, TextInput} from "@carbon/react";
import {Stack} from "@carbon/react/lib/components/Stack"

import './DataExtraction.scss';
import {
    dataExtractionQuestionAtomLoadable,
    dataExtractionResultsAtom,
    dataExtractionResultsAtomLoadable
} from "../../atoms";
import {DataExtractionApi, dataExtractionApi, DataExtractionQuestion} from "../../services";
import {DataTable} from "../../components";

export interface DataExtractionProps {
}

interface DataExtractionValues {
    customer: string;
    questions: DataExtractionQuestion[];
}

const createEmptyDataExtractionValues = (questions: DataExtractionQuestion[] = []): DataExtractionValues => {
    return {
        customer: '',
        questions,
    }
}

export const DataExtraction: React.FunctionComponent<DataExtractionProps> = () => {
    const questionLoadable = useAtomValue(dataExtractionQuestionAtomLoadable)
    const [dataExtraction, setDataExtraction] = useState<DataExtractionValues>(createEmptyDataExtractionValues(questionLoadable.state === 'hasData' ? questionLoadable.data : []))
    const setResults = useSetAtom(dataExtractionResultsAtom)

    const service: DataExtractionApi = dataExtractionApi()

    if (questionLoadable.state === 'loading') {
        return (<Loading
            active={true}
            description="Active loading indicator" withOverlay={false}
        />)
    } else if (questionLoadable.state === 'hasError') {
        return (<div>Error</div>)
    }

    const questions: DataExtractionQuestion[] = questionLoadable.data;

    const handleCustomer = (event: {target: {value: string}}) => {
        const newValues = Object.assign({}, dataExtraction, {customer: event.target.value})

        setDataExtraction(newValues);
    }

    const handleQuestion = (question: DataExtractionQuestion) => {
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

    const containsQuestion = (question: DataExtractionQuestion) => {
        return dataExtraction.questions.some(target => target.id === question.id)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setResults(service.extractData(dataExtraction.customer, dataExtraction.questions));
    }

    const handleReset = () => {
        setResults(Promise.resolve([]))
    }

    return (
        <div>
        <Form onSubmit={handleSubmit}>
            <Stack gap={7}>
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
                <FormGroup legendText="Select checklist" style={{textAlign: 'left'}}>
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
                <div><Button kind="tertiary" onClick={handleReset}>Reset</Button> <Button type="submit">Submit</Button></div>
            </Stack>
        </Form>
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
        {header: 'Expected Response', key: 'expectedResponse'},
        {header: 'WatsonX Response', key: 'watsonxResponse'}
    ]

    return (
        <div className="dataExtractionResultContainer">
            <h3>Results</h3>
            <DataTable headerData={headerData} rowData={results} />
        </div>
    )
}
