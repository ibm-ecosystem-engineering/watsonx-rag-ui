import {BehaviorSubject, Observable} from "rxjs";
import dayjs from 'dayjs';

import {CaseNotFound, KycCaseManagementApi} from "./kyc-case-management.api";
import {createNewCase, CustomerModel, KycCaseModel} from "../../models";
import {delay, first} from "../../utils";

const initialValue: KycCaseModel[] = [
    {
        id: '1',
        customer: {
            name: 'John Doe',
            dateOfBirth: dayjs().subtract(25, 'years').toISOString(),
            countryOfResidence: 'US'
        },
        status: 'New',
        documents: [{id: '1', name: 'Invoice-2023-01.pdf', path: 'Invoice-2023-01.pdf'}],
        comments: [],
    },
    {
        id: '2',
        customer: {
            name: 'Jane Doe',
            dateOfBirth: dayjs().subtract(30, 'years').toISOString(),
            countryOfResidence: 'CA'
        },
        status: 'New',
        documents: [],
        comments: [],
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

    async addDocumentToCase(id: string, documentName: string, documentPath: string): Promise<KycCaseModel> {
        const currentCase = await this.getCase(id);

        currentCase.status = 'Pending';

        const documentId = currentCase.documents.length + 1;

        currentCase.documents.push({id: `${id}-${documentId}`, name: documentName, path: documentPath});

        this.subject.next(this.subject.value);

        return currentCase;
    }

    async reviewCase(id: string, comment?: string, timestamp: string = new Date().toISOString(), author?: string): Promise<KycCaseModel> {
        const currentCase = first(this.subject.value.filter(c => c.id === id))
            .orElseThrow(() => new CaseNotFound(id))

        currentCase.status = 'Pending';

        if (comment) {
            currentCase.comments.push(Object.assign({comment, timestamp}, author ? {author} : {}))
        }

        this.subject.next(this.subject.value);

        return currentCase;
    }

    async approveCase(id: string, comment?: string, timestamp: string = new Date().toISOString(), author?: string): Promise<KycCaseModel> {
        const currentCase = first(this.subject.value.filter(c => c.id === id))
            .orElseThrow(() => new CaseNotFound(id))

        currentCase.status = 'Closed';

        if (comment) {
            currentCase.comments.push(Object.assign({comment, timestamp}, author ? {author} : {}))
        }

        this.subject.next(this.subject.value);

        return currentCase;
    }
}
