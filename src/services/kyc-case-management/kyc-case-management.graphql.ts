import {ApolloClient, FetchResult, gql} from "@apollo/client";
import {BehaviorSubject, Observable} from "rxjs";

import {KycCaseManagementApi} from "./kyc-case-management.api";
import {getApolloClient} from "../../backends";
import {CustomerModel, KycCaseModel} from "../../models";

const CASE_FRAGMENT = gql`
    fragment Case_case on KycCase {
        id
        status
        customer {
            name
            dateOfBirth
            countryOfResidence
        }
        documents {
            id
            name
            path
        }
        comments {
            id
            timestamp
            comment
            author
        }
    }
`

const LIST_CASES = gql`
    query ListCases { 
        listCases {
            ...Case_case
        }
        ${CASE_FRAGMENT}
    }
`
const CASES_SUBSCRIPTION = gql`
    subscription { 
        subscribeToCases {
            ...Case_case
        }
        ${CASE_FRAGMENT}
    }
`
const GET_CASE = gql`
    query GetCase($caseId:ID!) { 
        getCase(id:$caseId) {
            ...Case_case
        }
        ${CASE_FRAGMENT}
    }
`
const CREATE_CASE = gql`
    mutation CreateCase($customer:CustomerInput!) { 
        createCase(customer:$customer) {
            ...Case_case
        }
        ${CASE_FRAGMENT}
    }
`
const ADD_DOCUMENT_TO_CASE = gql`
    mutation AddDocumentToCase($caseId:ID!,$documentName:String!,$documentPath:String!) { 
        addDocumentToCase(caseId:$caseId,documentName:$documentName,documentPath:$documentPath) {
            ...Case_case
        }
        ${CASE_FRAGMENT}
    }
`
const APPROVE_CASE = gql`
    mutation ApproveCase($caseId:ID!,$comment:String,$timestamp:String,$author:String) { 
        approveCase(caseId:$caseId,comment:$comment,timestamp:$timestamp,author:$author) {
            ...Case_case
        }
        ${CASE_FRAGMENT}
    }
`
const REVIEW_CASE = gql`
    mutation ReviewCase($caseId:ID!,$comment:String,$timestamp:String,$author:String) { 
        reviewCase(caseId:$caseId,comment:$comment,timestamp:$timestamp,author:$author) {
            ...Case_case
        }
        ${CASE_FRAGMENT}
    }
`

export class KycCaseManagementGraphql implements KycCaseManagementApi {
    client: ApolloClient<unknown>;
    subject: BehaviorSubject<KycCaseModel[]>

    constructor() {
        this.client = getApolloClient();
        this.subject = new BehaviorSubject<KycCaseModel[]>([])
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
            .map((config: FetchResult<{subscribeToCases: KycCaseModel[]}>) => config.data?.subscribeToCases)
            .subscribe({
                next: (val: KycCaseModel[]) => {
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
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{createCase: KycCaseModel}>) => await result.data?.createCase) as Promise<KycCaseModel>
    }

    addDocumentToCase(caseId: string, documentName: string, documentPath: string): Promise<KycCaseModel> {
        return this.client
            .mutate<{addDocumentToCase: KycCaseModel}>({
                mutation: ADD_DOCUMENT_TO_CASE,
                variables: {caseId, documentName, documentPath},
                refetchQueries: [{query: LIST_CASES}],
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{addDocumentToCase: KycCaseModel}>) => await result.data?.addDocumentToCase) as Promise<KycCaseModel>
    }

    approveCase(caseId: string, comment: string, timestamp?: string, author?: string): Promise<KycCaseModel> {
        return this.client
            .mutate<{approveCase: KycCaseModel}>({
                mutation: APPROVE_CASE,
                variables: {caseId, comment, timestamp, author},
                refetchQueries: [{query: LIST_CASES}],
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{approveCase: KycCaseModel}>) => await result.data?.approveCase) as Promise<KycCaseModel>
    }

    reviewCase(caseId: string, comment: string, timestamp?: string, author?: string): Promise<KycCaseModel> {
        return this.client
            .mutate<{reviewCase: KycCaseModel}>({
                mutation: REVIEW_CASE,
                variables: {caseId, comment, timestamp, author},
                refetchQueries: [{query: LIST_CASES}],
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{reviewCase: KycCaseModel}>) => await result.data?.reviewCase) as Promise<KycCaseModel>
    }

    getCase(caseId: string): Promise<KycCaseModel> {
        return this.client
            .query<{getCase: KycCaseModel}>({
                query: GET_CASE,
                variables: {caseId},
            })
            .then(result => result.data.getCase)
            .catch(err => {
                console.log('Error getting case: ' + caseId, err)
                throw err
            }) as Promise<KycCaseModel>
    }

}