import {Observable} from "rxjs";
import {DataExtractionQuestionModel, DataExtractionResultModel} from "../../models";


export abstract class DataExtractionApi {
    abstract listQuestions(): Promise<DataExtractionQuestionModel[]>;

    abstract extractData(customer: string, questions: Array<{id: string}>): Promise<DataExtractionResultModel[]>;

    abstract extractDataForQuestion(customer: string, question: {id: string}): Promise<DataExtractionResultModel>;

    abstract extractDataObservable(customer: string, questions: Array<{id: string}>): Observable<DataExtractionResultModel[]>;
}
