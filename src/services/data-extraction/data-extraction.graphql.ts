import {ApolloClient, FetchResult, gql} from "@apollo/client";
import {Observable, Subject} from "rxjs";

import {DataExtractionApi} from "./data-extraction.api.ts";
import {DataExtractionQuestionModel, DataExtractionResultModel} from "../../models";
import {getApolloClient} from "../../backends";

interface ListQuestionsQuery {
    listQuestions: DataExtractionQuestionModel[]
}
const LIST_QUESTIONS = gql`
    query ListQuestions {
        listQuestions {
            id
            question
            inScope
        }
    }
`

interface DataExtractionSubscription {
    extractDataObservable: DataExtractionResultModel[]
}
const DATA_EXTRACTION_SUBSCRIPTION = gql`
    subscription ExtractDataObservable($customer: String!, $questions: [DataExtractionQuestionIdInput!]!) {
        extractDataObservable(customer: $customer, questions: $questions) {
            id
            question
            inScope
            expectedResponse
            watsonxResponse
        }
    }
`

interface DataExtractionQuestionsQuery {
    extractDataForQuestions: DataExtractionResultModel[]
}
const DATA_EXTRACTION_QUESTIONS = gql`
    query ExtractDataForQuestions($customer: String!, $questions: [DataExtractionQuestionIdInput!]!) {
        extractDataForQuestions(customer: $customer, questions: $questions) {
            id
            question
            inScope
            expectedResponse
            watsonxResponse
            prompt
        }
    }
`

interface DataExtractionQuestionQuery {
    extractDataForQuestion: DataExtractionResultModel
}
const DATA_EXTRACTION_QUESTION = gql`
    query ExtractDataForQuestion($customer: String!, $question: DataExtractionQuestionIdInput!) {
        extractDataForQuestion(customer: $customer, question: $question) {
            id
            question
            inScope
            expectedResponse
            watsonxResponse
            prompt
        }
    }
`

export class DataExtractionGraphql implements DataExtractionApi {
    client: ApolloClient<unknown>;

    constructor() {
        this.client = getApolloClient();
    }

    extractData(customer: string, questions: Array<{ id: string }>): Promise<DataExtractionResultModel[]> {
        return this.client
            .query<DataExtractionQuestionsQuery>({
                query: DATA_EXTRACTION_QUESTIONS,
                variables: {customer, questions: questions.map(q => ({id: q.id}))},
            })
            .then(result => result.data.extractDataForQuestions)
    }

    async extractDataForQuestion(customer: string, question: { id: string }): Promise<DataExtractionResultModel> {
        return this.client
            .query<DataExtractionQuestionQuery>({
                query: DATA_EXTRACTION_QUESTION,
                variables: {customer, question: {id: question.id}},
            })
            .then(result => result.data.extractDataForQuestion)
    }

    extractDataObservable(customer: string, questions: Array<{ id: string }>): Observable<DataExtractionResultModel[]> {
        const subject = new Subject<DataExtractionResultModel[]>();

        this.client
            .subscribe<DataExtractionSubscription>({
                query: DATA_EXTRACTION_SUBSCRIPTION,
                variables: {customer, questions: questions.map(q => ({id: q.id}))},
            })
            .map((config: FetchResult<DataExtractionSubscription>) => config.data?.extractDataObservable)
            .subscribe(subject);

        return subject;
    }

    listQuestions(): Promise<DataExtractionQuestionModel[]> {
        return this.client
            .query<ListQuestionsQuery>({
                query: LIST_QUESTIONS
            })
            .then(result => result.data.listQuestions)
    }

}