import {BehaviorSubject, Observable} from "rxjs";

import {CaseNotFound, KycCaseManagementApi} from "./kyc-case-management.api";
import {
    ApproveCaseModel,
    createNewCase,
    CustomerModel, DocumentContent,
    DocumentModel, DocumentRef, DocumentStream, isDocumentContent, isDocumentRef,
    KycCaseModel,
    ReviewCaseModel
} from "../../models";
import {delay, first, streamToBuffer, urlToStream} from "../../utils";
import Stream from "stream";

const initialValue: KycCaseModel[] = [
    {
        id: '1',
        customer: {
            name: 'John Doe',
            countryOfResidence: 'US',
            personalIdentificationNumber: '123458690',
            entityType: '02',
            industryType: '92.00',
        },
        status: 'New',
        documents: [],
    },
    {
        id: '2',
        customer: {
            name: 'Jane Doe',
            countryOfResidence: 'CA',
            personalIdentificationNumber: 'AB1458690',
            entityType: '03',
            industryType: '10.82/2',
        },
        status: 'New',
        documents: [],
    }
]

export class KycCaseManagementMock implements KycCaseManagementApi {
    subject: BehaviorSubject<KycCaseModel[]> = new BehaviorSubject(initialValue)

    async listCases(): Promise<KycCaseModel[]> {
        return delay(1000, () => this.subject.value);
    }

    async getCase(id: string): Promise<KycCaseModel> {
        const filteredData = this.subject.value.filter(d => d.id === id)

        if (filteredData.length === 0) {
            throw new CaseNotFound(id);
        }

        return delay(1000, () => filteredData[0]);
    }

    subscribeToCases(): Observable<KycCaseModel[]> {
        return this.subject;
    }

    async createCase(customer: CustomerModel): Promise<KycCaseModel> {

        const currentData = this.subject.value;

        const newCase = Object.assign(
            createNewCase(customer),
            {id: '' + (currentData.length + 1), status: 'New'}
        );

        const updatedData = currentData.concat(newCase);
        console.log('Updated data on create case: ', updatedData);
        this.subject.next(updatedData);

        return newCase;
    }

    async addDocumentToCase(caseId: string, documentName: string, document: DocumentRef | DocumentContent | DocumentStream): Promise<DocumentModel> {
        const currentCase = await this.getCase(caseId);

        currentCase.status = 'Pending';

        const id = '' + (currentCase.documents.length + 1);
        const documentId = `${caseId}-${id}`;
        const content = await this.loadDocument(document);

        const doc = {id: documentId, name: documentName, path: `${documentId}/${documentName}`, content: content}
        currentCase.documents.push(doc);

        this.subject.next(this.subject.value);

        return doc;
    }

    async loadDocument(document: DocumentRef | DocumentContent | DocumentStream): Promise<Buffer> {
        if (isDocumentContent(document)) {
            return document.content;
        }

        const stream: Stream = isDocumentRef(document)
            ? await urlToStream(document.url)
            : document.stream;

        return streamToBuffer(stream);
    }

    async reviewCase(reviewCase: ReviewCaseModel): Promise<KycCaseModel> {
        const currentCase: KycCaseModel | undefined = first(this.subject.value.filter(c => c.id === reviewCase.id))
            .orElseThrow(() => new CaseNotFound(reviewCase.id));

        const status: string = reviewCase.customerOutreach ? 'CustomerOutreach' : 'Pending';

        Object.assign(currentCase, {reviewCase}, {status});

        this.subject.next(this.subject.value);

        return currentCase;
    }

    async approveCase(input: ApproveCaseModel): Promise<KycCaseModel> {
        const currentCase: KycCaseModel | undefined = first(this.subject.value.filter(c => c.id === input.id))
            .orElseThrow(() => new CaseNotFound(input.id));

        currentCase.status = 'Pending';
        currentCase.documents = currentCase.documents.concat(input.documents)

        this.subject.next(this.subject.value);

        return currentCase;
    }

    async getDocument(id: string): Promise<DocumentModel> {
        const doc: DocumentModel = first(
            this.subject.value
                .map(kycCase => first(kycCase.documents.filter(tmp => tmp.id === id)).orElse(undefined))
                .filter(doc => !!doc)
        ).orElseThrow(() => new Error('Document not found: ' + id))

        if (!doc) {
            throw new Error('Document not found: ' + id);
        }

        return doc;
    }

    async removeDocumentFromCase(caseId: string, documentId: string): Promise<KycCaseModel> {
        const currentCase = await this.getCase(caseId);

        currentCase.documents = currentCase.documents
            .filter(doc => doc.id !== documentId)

        this.subject.next(this.subject.value);

        return currentCase;
    }

    async reload() {
    }
}
