import {ApolloClient, FetchResult, gql} from "@apollo/client";
import {BehaviorSubject, Observable, Subject} from "rxjs";

import {KycCaseManagementApi} from "./kyc-case-management.api";
import {getApolloClient} from "../../backends";
import {
    ApproveCaseModel,
    CustomerModel,
    DocumentModel,
    DocumentRef,
    KycCaseModel,
    ReviewCaseModel
} from "../../models";

const LIST_CASES = gql`
    query ListCases { 
        listCases {
            id
            status
            customer {
                name
                countryOfResidence
                entityType
                industryType
            }
            documents {
                id
                name
                path
            }
            customerOutreach
            counterparty {
                name
                countryOfResidence
            }
            negativeScreening {
                subject
                summary
                error
                totalScreened
                unrelatedNewsCount
                nonNegativeNewsCount
                negativeNewsCount
            }
            counterpartyNegativeScreening {
                subject
                summary
                error
                totalScreened
                unrelatedNewsCount
                nonNegativeNewsCount
                negativeNewsCount
            }
            customerRiskAssessment {
                score
                rating
                error
            }
            caseSummary {
                summary
                error
            }
        }
    }
`
const CASES_SUBSCRIPTION = gql`
    subscription { 
        subscribeToCases {
            id
            status
            customer {
                name
                countryOfResidence
                entityType
                industryType
            }
            documents {
                id
                name
                path
            }
            customerOutreach
            counterparty {
                name
                countryOfResidence
            }
            negativeScreening {
                summary
                error
                totalScreened
                unrelatedNewsCount
                nonNegativeNewsCount
                negativeNewsCount
            }
            counterpartyNegativeScreening {
                summary
                error
                totalScreened
                unrelatedNewsCount
                nonNegativeNewsCount
                negativeNewsCount
            }
            customerRiskAssessment {
                score
                rating
                error
            }
            caseSummary {
                summary
                error
            }
        }
    }
`
const GET_CASE = gql`
    query GetCase($caseId:ID!) { 
        getCase(id:$caseId) {
            id
            status
            customer {
                name
                countryOfResidence
                entityType
                industryType
            }
            documents {
                id
                name
                path
            }
            customerOutreach
            counterparty {
                name
                countryOfResidence
            }
            negativeScreening {
                summary
                error
                totalScreened
                unrelatedNewsCount
                nonNegativeNewsCount
                negativeNewsCount
                unrelatedNews {
                    date
                    title
                    link
                    summary
                    negativeNewsTopics
                    hasNegativeNews
                }
                nonNegativeNews {
                    date
                    title
                    link
                    summary
                    negativeNewsTopics
                    hasNegativeNews
                }
                negativeNews {
                    date
                    title
                    link
                    summary
                    negativeNewsTopics
                    hasNegativeNews
                }
            }
            counterpartyNegativeScreening {
                summary
                error
                totalScreened
                unrelatedNewsCount
                nonNegativeNewsCount
                negativeNewsCount
                unrelatedNews {
                    date
                    title
                    link
                    summary
                    negativeNewsTopics
                    hasNegativeNews
                }
                nonNegativeNews {
                    date
                    title
                    link
                    summary
                    negativeNewsTopics
                    hasNegativeNews
                }
                negativeNews {
                    date
                    title
                    link
                    summary
                    negativeNewsTopics
                    hasNegativeNews
                }
            }
            customerRiskAssessment {
                score
                rating
                error
            }
            caseSummary {
                summary
                error
            }
        }
    }
`
const CREATE_CASE = gql`
    mutation CreateCase($customer:CustomerInput!) { 
        createCase(customer:$customer) {
            id
            status
            customer {
                name
                countryOfResidence
                entityType
                industryType
            }
            documents {
                id
                name
                path
            }
            customerOutreach
            counterparty {
                name
                countryOfResidence
            }
            negativeScreening {
                summary
                error
            }
            counterpartyNegativeScreening {
                summary
                error
            }
            customerRiskAssessment {
                score
                rating
                error
            }
            caseSummary {
                summary
                error
            }
        }
    }
`
const ADD_DOCUMENT_TO_CASE = gql`
    mutation AddDocumentToCase($caseId:ID!,$documentName:String!,$documentUrl:String!) { 
        addDocumentToCase(caseId:$caseId,documentName:$documentName,documentUrl:$documentUrl) {
            id
            status
            customer {
                name
                countryOfResidence
                entityType
                industryType
            }
            documents {
                id
                name
                path
            }
            customerOutreach
            counterparty {
                name
                countryOfResidence
            }
            negativeScreening {
                summary
                error
            }
            counterpartyNegativeScreening {
                summary
                error
            }
            customerRiskAssessment {
                score
                rating
                error
            }
            caseSummary {
                summary
                error
            }
        }
    }
`
const APPROVE_CASE = gql`
    mutation ApproveCase($case: ApproveCaseInput!) { 
        approveCase(case: $case) {
            id
            status
            customer {
                name
                countryOfResidence
                entityType
                industryType
            }
            documents {
                id
                name
                path
            }
            customerOutreach
            counterparty {
                name
                countryOfResidence
            }
            negativeScreening {
                summary
                error
            }
            counterpartyNegativeScreening {
                summary
                error
            }
            customerRiskAssessment {
                score
                rating
                error
            }
            caseSummary {
                summary
                error
            }
        }
    }
`
const REVIEW_CASE = gql`
    mutation ReviewCase($case: ReviewCaseInput!) { 
        reviewCase(case: $case) {
            id
            status
            customer {
                name
                countryOfResidence
                entityType
                industryType
            }
            documents {
                id
                name
                path
            }
            customerOutreach
            counterparty {
                name
                countryOfResidence
            }
            negativeScreening {
                summary
                error
            }
            counterpartyNegativeScreening {
                summary
                error
            }
            customerRiskAssessment {
                score
                rating
                error
            }
            caseSummary {
                summary
                error
            }
        }
    }
`
const GET_DOCUMENT = gql`
    query GetDocument($id:ID!) {
        getDocument(id:$id) {
            id
            path
            name
        }
    }
`

const REMOVE_DOCUMENT_FROM_CASE = gql`
    mutation RemoveDocumentFromCase($caseId: ID!, $documentId: ID!) {
        removeDocumentFromCase(caseId: $caseId, documentId: $documentId) {
            id
            status
            customer {
                name
                countryOfResidence
                entityType
                industryType
            }
            documents {
                id
                name
                path
            }
            customerOutreach
            counterparty {
                name
                countryOfResidence
            }
            negativeScreening {
                summary
                error
            }
            counterpartyNegativeScreening {
                summary
                error
            }
            customerRiskAssessment {
                score
                rating
                error
            }
            caseSummary {
                summary
                error
            }
        }
    }
`
const PROCESS_CASE = gql`
    mutation ProcessCase($caseId: ID!) {
        processCase(id: $caseId) {
            id
            status
            customer {
                name
                countryOfResidence
                entityType
                industryType
            }
            documents {
                id
                name
                path
            }
            customerOutreach
            counterparty {
                name
                countryOfResidence
            }
            negativeScreening {
                summary
                error
            }
            counterpartyNegativeScreening {
                summary
                error
            }
            customerRiskAssessment {
                score
                rating
                error
            }
            caseSummary {
                summary
                error
            }
        }
    }
`


export class KycCaseManagementGraphql implements KycCaseManagementApi {
    client: ApolloClient<unknown>;
    subject: BehaviorSubject<KycCaseModel[]>
    caseNotifySubject: Subject<string>;

    constructor() {
        this.client = getApolloClient();
        this.subject = new BehaviorSubject<KycCaseModel[]>([])
        this.caseNotifySubject = new Subject<string>();

        this.client.onClearStore(async () => {
            console.log('Store cleared');
        })
        this.client.onResetStore(async () => {
            console.log('Store reset')
        })
    }

    listCases(): Promise<KycCaseModel[]> {
        return this.client
            .query<{listCases: KycCaseModel[]}>({
                query: LIST_CASES,
            })
            .then(result => result.data.listCases)
            .catch(err => {
                console.log('Error querying cases: ', err)
                throw err
            }) as Promise<KycCaseModel[]>
    }

    subscribeToCases(skipQuery: boolean = false): Observable<KycCaseModel[]> {
        if (skipQuery) {
            return this.subject
        }

        this.client
            .subscribe<{subscribeToCases: KycCaseModel[]}>({
                query: CASES_SUBSCRIPTION
            })
            .map((config: FetchResult<{subscribeToCases: KycCaseModel[]}>) => {
                console.log('Mapping data', {data: config.data})
                return config.data?.subscribeToCases
            })
            .subscribe({
                next: (val: KycCaseModel[]) => {
                    console.log('Got next value', {val})
                    this.subject.next(val)
                },
                complete: () => {
                    console.log('Complete subscription!!!!')
                },
                error: err => {
                    console.log('Error with subscription', err)
                    this.subject.error(err)
                }
            })

        return this.subject;
    }

    async createCase(customer: CustomerModel): Promise<KycCaseModel> {
        return this.client
            .mutate<{createCase: KycCaseModel}>({
                mutation: CREATE_CASE,
                variables: {customer},
                refetchQueries: [{query: LIST_CASES}],
                awaitRefetchQueries: true,
            })
            .then(async (result: FetchResult<{createCase: KycCaseModel}>) => {
                this.caseNotifySubject.next(result.data?.createCase.id || '');

                return result.data?.createCase
            }) as Promise<KycCaseModel>
    }

    addDocumentToCase(caseId: string, documentName: string, document: DocumentRef): Promise<DocumentModel> {
        return this.client
            .mutate<{addDocumentToCase: DocumentModel}>({
                mutation: ADD_DOCUMENT_TO_CASE,
                variables: {caseId, documentName, document},
                refetchQueries: [{query: LIST_CASES}, this.buildGetCaseQuery(caseId)],
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{addDocumentToCase: DocumentModel}>) => {
                this.caseNotifySubject.next(caseId);

                return result.data?.addDocumentToCase
            }) as Promise<DocumentModel>
    }

    approveCase(input: ApproveCaseModel): Promise<KycCaseModel> {
        return this.client
            .mutate<{approveCase: KycCaseModel}>({
                mutation: APPROVE_CASE,
                variables: {'case': input},
                refetchQueries: [{query: LIST_CASES}, this.buildGetCaseQuery(input.id)],
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{approveCase: KycCaseModel}>) => {
                this.caseNotifySubject.next(result.data?.approveCase.id || '');

                return result.data?.approveCase
            }) as Promise<KycCaseModel>
    }

    reviewCase(input: ReviewCaseModel): Promise<KycCaseModel> {
        return this.client
            .mutate<{reviewCase: KycCaseModel}>({
                mutation: REVIEW_CASE,
                variables: {'case': input},
                refetchQueries: [{query: LIST_CASES}, this.buildGetCaseQuery(input.id)],
                awaitRefetchQueries: true,
            })
            .then(async (result: FetchResult<{reviewCase: KycCaseModel}>) => {
                this.caseNotifySubject.next(result.data?.reviewCase.id || '');

                return result.data?.reviewCase
            }) as Promise<KycCaseModel>
    }

    buildGetCaseQuery(caseId: string) {
        return {
            query: GET_CASE,
            variables: {caseId},
        }
    }

    getCase(caseId: string): Promise<KycCaseModel> {
        return this.client
            .query<{getCase: KycCaseModel}>(this.buildGetCaseQuery(caseId))
            .then(result => result.data.getCase)
            .catch(err => {
                console.log('Error getting case: ' + caseId, err)
                throw err
            }) as Promise<KycCaseModel>
    }

    getDocument(id: string): Promise<DocumentModel> {
        return this.client
            .query<{getDocument: DocumentModel}>({
                query: GET_DOCUMENT,
                variables: {id},
            })
            .then(result => result.data.getDocument)
            .catch(err => {
                console.log('Error getting case: ' + id, err)
                throw err
            }) as Promise<DocumentModel>
    }

    removeDocumentFromCase(caseId: string, documentId: string): Promise<KycCaseModel> {
        return this.client
            .mutate<{removeDocumentFromCase: KycCaseModel}>({
                mutation: REMOVE_DOCUMENT_FROM_CASE,
                variables: {caseId, documentId},
                refetchQueries: [{query: LIST_CASES}, this.buildGetCaseQuery(caseId)],
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{removeDocumentFromCase: KycCaseModel}>) => {
                this.caseNotifySubject.next(result.data?.removeDocumentFromCase.id || '');

                return result.data?.removeDocumentFromCase
            }) as Promise<KycCaseModel>
    }

    async reload(): Promise<void> {
    }

    async processCase(caseId: string): Promise<KycCaseModel> {
        return this.client
            .mutate<{processCase: KycCaseModel}>({
                mutation: PROCESS_CASE,
                variables: {caseId},
                refetchQueries: [{query: LIST_CASES}, this.buildGetCaseQuery(caseId)],
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{processCase: KycCaseModel}>) => {
                this.caseNotifySubject.next(result.data?.processCase.id || '');

                return result.data?.processCase
            }) as Promise<KycCaseModel>
    }

}