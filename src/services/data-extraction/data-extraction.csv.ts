import {BehaviorSubject, Observable} from "rxjs";

import {DataExtractionApi} from "./data-extraction.api";
import {DataExtractionQuestionModel, DataExtractionResultModel} from "../../models";
import {first, parseCsv} from "../../utils";

const csvFile: string = `ID,Question,PoCScope,Expected Answer,watsonx Response
1,What is Name and trading name of the organization?,,,
2,What is the registered address of the company?,X,"1 St James's Square, London, SW1Y 4PD",
3,What is the business/trading address of the company?,,,
4,What is identification number of the organization?,X,102498,
5,Who are the key controllers and authorized signatories?,,,
6,Names all the active directors of the company.,X,"LUND, Helge BLANC, Amanda Jayne DALEY, Pamela",
7,"What is the status of the organization ex; active, dissolved?",X,Active,
8,What is the year of incorporation?,X,1909,
9,Who are the shareholders of the company along with the percentage of ownership?,,,
10,Who is the ultimate owner of the company?,,,
11,What is the nature of business of the company?,,,
12,What is the industry type/SIC/NICS code of the company?,,,
13,What are the products utilized by the company?,,,
14,What is/are operation location/s or jurisdiction/s?,,,
15,Number of employees of the firm,,,
16,Name of the subsidiary of the company,,,
17,What is the Legal entity Type of the organization ex; publicly traded/limited liability etc.,,,
18,What is the turnover or revenue of the organization?,,,
19,Certificate/licence issued by the government.,,,
20,Whats is the next date of confirmation statement?,X,30/06/24,`

export interface DataExtractionConfig extends DataExtractionQuestionModel {
    expectedResponse: string;
    prompt: string;
}

const data: DataExtractionConfig[] = csvFile
    .split('\n')
    .map(parseCsv)
    .map(values => ({
        id: '' + values[0],
        question: '' + values[1],
        prompt: '',
        inScope: values[2] === 'X',
        expectedResponse: '' + values[3]
    }))
    .filter(val => val.id !== 'ID')

export abstract class DataExtractionCsv extends DataExtractionApi {

    getCsvData(): DataExtractionConfig[] {
        return data;
    }

    async listQuestions(): Promise<DataExtractionQuestionModel[]> {
        return this.getCsvData()
            .map(val => ({id: val.id, question: val.question, inScope: val.inScope}));
    }

    async extractData(customer: string, questions: Array<{id: string}>): Promise<DataExtractionResultModel[]> {
        const extractDataForQuestion = (question: {id: string}) => {
            return this.extractDataForQuestion(customer, question)
        }

        return Promise.all(questions.map(extractDataForQuestion.bind(this)))
    }

    emptyDataExtractionResults(questions: Array<{id: string}>): DataExtractionResultModel[] {
        const ids = questions.map(q => q.id);

        return this.getCsvData()
            .filter(val => ids.includes(val.id))
            .map(val => Object.assign({}, val, {watsonxResponse: ''}))
    }

    extractDataObservable(customer: string, questions: Array<{id: string}>): Observable<DataExtractionResultModel[]> {
        const subject: BehaviorSubject<DataExtractionResultModel[]> = new BehaviorSubject(this.emptyDataExtractionResults(questions));

        questions
            .map(question => this.extractDataForQuestion(customer, question))
            .map(promise => promise.then((result: DataExtractionResultModel) => {
                const currentResults: DataExtractionResultModel[] = subject.value;

                const previousResult: DataExtractionResultModel | undefined = first(currentResults.filter(val => val.id === result.id))
                    .orElse(undefined as any)
                if (previousResult) {
                    previousResult.watsonxResponse = result.watsonxResponse;
                }

                return subject.next(currentResults)
            }))

        return subject;
    }

}