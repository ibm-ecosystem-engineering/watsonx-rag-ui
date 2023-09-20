import {Observable} from "rxjs";

import {KycCaseManagementApi} from "./kyc-case-management.api";
import {KycCaseManagementGraphql} from "./kyc-case-management.graphql";
import {KycCaseModel} from "../../models";

export class KycCaseManagementGraphqlHack extends KycCaseManagementGraphql implements KycCaseManagementApi {

    constructor() {
        super();

        this.caseNotifySubject.subscribe({
            next: async () => {
                const cases = await this.listCases();

                this.subject.next(cases);
            }
        })
    }

    subscribeToCases(skipQuery: boolean = false): Observable<KycCaseModel[]> {
        if (skipQuery) {
            return this.subject
        }

        this.listCases().then(result => this.subject.next(result))

        return this.subject;
    }

    async reload(): Promise<void> {
        await this.client.resetStore();

        this.caseNotifySubject.next('');
    }

}