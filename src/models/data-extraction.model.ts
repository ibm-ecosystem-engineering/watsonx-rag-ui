export interface DataExtractionQuestionModel {
    id: string;
    question: string;
    inScope: boolean;
}

export interface DataExtractionResultModel extends DataExtractionQuestionModel {
    expectedResponse: string;
    watsonxResponse: string;
    prompt: string;
}
