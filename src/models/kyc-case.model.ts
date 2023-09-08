export interface KycCaseModel {
    id: string;
    customer: CustomerModel;
    counterParty?: PersonModel;
    documents: DocumentModel[];
    customerOutreach?: string;
    status: string;
    negativeScreening?: NegativeScreeningModel;
    counterpartyNegativeScreening?: NegativeScreeningModel;
    customerRiskAssessment?: CustomerRiskAssessmentModel;
}

export interface PersonModel {
    name: string;
    countryOfResidence: string;
}

export interface CustomerModel extends PersonModel {
    personalIdentificationNumber: string;
    riskCategory: string;
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

export const createEmptyCustomer = (): CustomerModel => {
    return {
        name: '',
        countryOfResidence: 'US',
        personalIdentificationNumber: '',
        riskCategory: ''
    }
}