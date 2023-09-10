import {Observable} from "rxjs";

import {ApproveCaseModel, CustomerModel, KycCaseModel, ReviewCaseModel} from "../../models";

export abstract class KycCaseManagementApi {
    abstract listCases(): Promise<KycCaseModel[]>;
    abstract subscribeToCases(skipQuery?: boolean): Observable<KycCaseModel[]>;

    abstract getCase(id: string): Promise<KycCaseModel>;
    abstract createCase(customer: CustomerModel): Promise<KycCaseModel>;
    abstract addDocumentToCase(id: string, documentName: string, documentPath: string): Promise<KycCaseModel>;
    abstract reviewCase(input: ReviewCaseModel): Promise<KycCaseModel>;
    abstract approveCase(input: ApproveCaseModel): Promise<KycCaseModel>;
}

export class CaseNotFound extends Error {
    constructor(public caseId: string) {
        super('Unable to find case: ' + caseId);
    }
}
