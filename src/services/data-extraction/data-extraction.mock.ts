import {Observable, Subject} from "rxjs";

import {
    DataExtractionApi,
    DataExtractionConfig,
    DataExtractionQuestion,
    DataExtractionResult
} from "./data-extraction.api.ts";
import {delay, first} from "../../utils";

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

const parseCsv = (text: string): any[] => {
    return (text.match( /\s*("[^"]*"|'[^']*'|[^,]*)\s*(,|$)/g ) || [])
        .map((text: string) => {
        let m;
        if (text.match(/^\s*,?$/)) return null; // null value
        if (m = text.match(/^\s*"([^"]*)"\s*,?$/)) return m[1]; // Double Quoted Text
        if (m = text.match(/^\s*'([^']*)'\s*,?$/)) return m[1]; // Single Quoted Text
        if (m = text.match(/^\s*(true|false)\s*,?$/)) return m[1] === "true"; // Boolean
        if (m = text.match(/^\s*((?:\+|-)?\d+)\s*,?$/)) return parseInt(m[1]); // Integer Number
        if (m = text.match(/^\s*((?:\+|-)?\d*\.\d*)\s*,?$/)) return parseFloat(m[1]); // Floating Number
        if (m = text.match(/^\s*(.*?)\s*,?$/)) return m[1]; // Unquoted Text
        return text;
    } )
}

const data: DataExtractionConfig[] = csvFile
    .split('\n')
    .map(parseCsv)
    .map(values => ({
        id: '' + values[0],
        question: '' + values[1],
        inScope: values[2] === 'X',
        expectedResponse: '' + values[3]
    }))

export class DataExtractionMock implements DataExtractionApi {
    async extractData(customer: string, questions: DataExtractionQuestion[]): Promise<DataExtractionResult[]> {
        return delay(1000, () => {
            return Promise.all(questions
                .map(question => this.extractDataForQuestion(customer, question)))
        })
    }

    async extractDataForQuestion(customer: string, question: DataExtractionQuestion): Promise<DataExtractionResult> {
        return first(data.filter(val => val.id === question.id))
            .map(val => Object.assign({}, val, {watsonxResponse: val.expectedResponse}))
            .orElseThrow(() => new Error('Error finding question: ' + question.id));
    }

    extractDataObservable(customer: string, questions: DataExtractionQuestion[]): Observable<DataExtractionResult> {
        const subject: Subject<DataExtractionResult> = new Subject();

        questions
            .map(question => this.extractDataForQuestion(customer, question))
            .map(promise => promise.then(subject.next))

        return subject;
    }

    async listQuestions(): Promise<DataExtractionQuestion[]> {
        return data.filter(val => val.inScope);
    }

}