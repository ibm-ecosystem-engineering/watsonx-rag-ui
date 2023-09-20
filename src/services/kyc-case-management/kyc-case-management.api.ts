import {Observable} from "rxjs";

import {
    ApproveCaseModel,
    CustomerModel, DocumentContent,
    DocumentModel,
    DocumentRef, DocumentStream,
    KycCaseModel,
    ReviewCaseModel
} from "../../models";

export abstract class KycCaseManagementApi {
    abstract reload(): Promise<void>;
    abstract listCases(): Promise<KycCaseModel[]>;
    abstract subscribeToCases(skipQuery?: boolean): Observable<KycCaseModel[]>;

    abstract getCase(id: string): Promise<KycCaseModel>;
    abstract createCase(customer: CustomerModel): Promise<KycCaseModel>;
    abstract getDocument(id: string): Promise<DocumentModel>;
    abstract addDocumentToCase(id: string, documentName: string, document: DocumentRef | DocumentStream | DocumentContent): Promise<DocumentModel>;
    abstract removeDocumentFromCase(id: string, documentId: string): Promise<KycCaseModel>;
    abstract reviewCase(input: ReviewCaseModel): Promise<KycCaseModel>;
    abstract approveCase(input: ApproveCaseModel): Promise<KycCaseModel>;
    abstract processCase(id: string): Promise<KycCaseModel>;
}

export class CaseNotFound extends Error {
    constructor(public caseId: string) {
        super('Unable to find case: ' + caseId);
    }
}
