import * as Stream from "stream";

export interface KycCaseModel {
    id: string;
    status: string;
    customer: CustomerModel;
    documents: DocumentModel[];
    counterparty?: PersonModel;
    customerOutreach?: string;
    negativeScreening?: NegativeScreeningModel;
    counterpartyNegativeScreening?: NegativeScreeningModel;
    customerRiskAssessment?: CustomerRiskAssessmentModel;
    caseSummary?: KycCaseSummaryModel;
}

export interface PersonModel {
    name: string;
    countryOfResidence: string;
}

export interface CustomerModel extends PersonModel {
    personalIdentificationNumber: string;
    industryType: string;
    entityType: string;
}

export interface DocumentModel extends DocumentInputModel {
    id: string;
    content: Buffer;
}


export interface NegativeScreeningModel {
    subject: string;
    totalScreened: number;
    negativeNewsCount: number;
    negativeNews: NewsItemModel[];
    nonNegativeNewsCount: number;
    nonNegativeNews: NewsItemModel[];
    unrelatedNewsCount: number;
    unrelatedNews: NewsItemModel[];
    summary: string;
    error?: string;
}

export interface NewsItemModel {
    title: string;
    link: string;
    source: string;
    snippet: string;
    date: string;
    negativeNewsTopics?: string[];
    hasNegativeNews?: boolean;
    summary?: string;
}

export const isNegativeScreeningModel = (val: unknown): val is NegativeScreeningModel => {
    return !!val && !!(val as NegativeScreeningModel).summary
}

export interface CustomerRiskAssessmentModel {
    rating: string;
    score: number;
    error?: string;
}

export const isCustomerRiskAssessmentModel = (val: unknown): val is CustomerRiskAssessmentModel => {
    return !!val && !!(val as CustomerRiskAssessmentModel).score
}

export interface ReviewCaseModel {
    id: string;
    counterparty: PersonModel;
    customerOutreach?: string;
    documents: DocumentModel[];
}

export interface ApproveCaseModel {
    id: string;
    customerOutreach: string;
    documents: DocumentModel[];
}

export interface KycCaseSummaryModel {
    summary: string;
    error?: string;
}

export const isKycCaseSummaryModel = (val: unknown): val is KycCaseSummaryModel => {
    return !!val && !!(val as KycCaseSummaryModel).summary
}

export interface DocumentRef {
    url: string;
}

export const isDocumentRef = (val: unknown): val is DocumentRef => {
    return !!val && !!(val as {url: string}).url;
}

export interface DocumentContent {
    content: Buffer;
}

export const isDocumentContent = (val: unknown): val is DocumentContent => {
    return !!val && !!(val as {content: unknown}).content;
}

export interface DocumentStream {
    stream: Stream;
}

export const isDocumentStream = (val: unknown): val is DocumentStream => {
    return !!val && !!(val as {stream: unknown}).stream;
}

export interface DocumentInputModel {
    name: string;
    path: string;
}

export const createEmptyCustomer = (): CustomerModel => {
    return {
        name: '',
        countryOfResidence: 'United States',
        personalIdentificationNumber: '',
        industryType: 'Growing of rice',
        entityType: 'Private Limited Company',
    }
}

export const createEmptyCase = (): KycCaseModel => {
    return {
        id: 'new',
        customer: createEmptyCustomer(),
        status: 'New',
        documents: [],
    }
}

export const createNewCase = (customer: CustomerModel): KycCaseModel => {
    return {
        id: '',
        customer,
        status: 'New',
        documents: [],
    }
}
export const createEmptyReviewCase = (id: string): ReviewCaseModel => {
    return {
        id,
        counterparty: {
            name: '',
            countryOfResidence: 'United States'
        },
        customerOutreach: '',
        documents: []
    }
}

export const createEmptyApproveCase = (id: string): ApproveCaseModel => {
    return {
        id,
        customerOutreach: 'Completed',
        documents: []
    }
}

export interface DocumentedCase {
    documents: DocumentModel[];
}
