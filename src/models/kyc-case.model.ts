export interface KycCaseModel {
    id: string;
    customer: CustomerModel;
    documents: DocumentModel[];
    status: string;
    comments: CommentModel[];
    negativeScreening?: NegativeScreeningModel;
    customerRiskAssessment?: CustomerRiskAssessmentModel;
}

export interface CommentModel {
    comment: string;
    timestamp: string;
    author?: string;
}

export interface CustomerModel {
    name: string;
    dateOfBirth: string;
    countryOfResidence: string;
}

export interface DocumentModel {
    id: string;
    name: string;
    path: string;
}

export interface NegativeScreeningModel {
    result: string;
}

export interface CustomerRiskAssessmentModel {
    result: string;
}


export const createEmptyCase = (): KycCaseModel => {
    return {
        id: 'new',
        customer: createEmptyCustomer(),
        status: 'New',
        documents: [],
        comments: [],
    }
}

export const createNewCase = (customer: CustomerModel): KycCaseModel => {
    return {
        id: '',
        customer,
        status: 'New',
        documents: [],
        comments: [],
    }
}

export const createEmptyCustomer = (): CustomerModel => {
    return {
        name: '',
        dateOfBirth: new Date().toISOString(),
        countryOfResidence: 'US',
    }
}