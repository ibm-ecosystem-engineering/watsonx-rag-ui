import {Observable} from "rxjs";

export interface DataExtractionQuestion {
    id: string;
    question: string;
}

export interface DataExtractionConfig extends DataExtractionQuestion {
    expectedResponse: string;
    inScope: boolean;
}

export interface DataExtractionResult extends DataExtractionQuestion {
    expectedResponse: string;
    watsonxResponse: string;
}


export abstract class DataExtractionApi {
    abstract listQuestions(): Promise<DataExtractionQuestion[]>;

    abstract extractData(customer: string, questions: DataExtractionQuestion[]): Promise<DataExtractionResult[]>;

    abstract extractDataForQuestion(customer: string, question: DataExtractionQuestion): Promise<DataExtractionResult>;

    abstract extractDataObservable(customer: string, questions: DataExtractionQuestion[]): Observable<DataExtractionResult>;
}
