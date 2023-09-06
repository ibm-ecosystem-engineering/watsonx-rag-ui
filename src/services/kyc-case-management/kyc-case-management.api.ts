import {CustomerModel, KycCaseModel} from "../../models/kyc-case.model.ts";
import {Observable} from "rxjs";

export abstract class KycCaseManagementApi {
    abstract listCases(): Promise<KycCaseModel[]>;
    abstract subscribeToCases(skipQuery?: boolean): Observable<KycCaseModel[]>;

    abstract getCase(id: string): Promise<KycCaseModel>;
    abstract createCase(customer: CustomerModel): Promise<KycCaseModel>;
    abstract addDocumentToCase(id: string, documentName: string, documentPath: string): Promise<KycCaseModel>;
    abstract reviewCase(id: string, comment: string, timestamp?: string, author?: string): Promise<KycCaseModel>;
    abstract approveCase(id: string, comment: string, timestamp?: string, author?: string): Promise<KycCaseModel>;
}

export class CaseNotFound extends Error {
    constructor(public caseId: string) {
        super('Unable to find case: ' + caseId);
    }
}
