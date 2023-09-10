import {ApolloClient, FetchResult, gql} from "@apollo/client";
import {BehaviorSubject, Observable} from "rxjs";

import {KycCaseManagementApi} from "./kyc-case-management.api";
import {getApolloClient} from "../../backends";
import {ApproveCaseModel, CustomerModel, KycCaseModel, ReviewCaseModel} from "../../models";

const LIST_CASES = gql`
    query ListCases { 
        listCases {
            id
            status
            customer {
                name
                countryOfResidence
                riskCategory
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
                result
            }
            counterpartyNegativeScreening {
                result
            }
            customerRiskAssessment {
                result
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
                riskCategory
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
                result
            }
            counterpartyNegativeScreening {
                result
            }
            customerRiskAssessment {
                result
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
                riskCategory
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
                result
            }
            counterpartyNegativeScreening {
                result
            }
            customerRiskAssessment {
                result
            }
        }
    }
`
const ADD_DOCUMENT_TO_CASE = gql`
    mutation AddDocumentToCase($caseId:ID!,$documentName:String!,$documentPath:String!) { 
        addDocumentToCase(caseId:$caseId,documentName:$documentName,documentPath:$documentPath) {
            id
            status
            customer {
                name
                countryOfResidence
                riskCategory
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
                result
            }
            counterpartyNegativeScreening {
                result
            }
            customerRiskAssessment {
                result
            }
        }
    }
`
const APPROVE_CASE = gql`
    mutation ApproveCase($approveCase: ApproveCaseInput!) { 
        approveCase(case: $approveCase) {
            id
            status
            customer {
                name
                countryOfResidence
                riskCategory
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
                result
            }
            counterpartyNegativeScreening {
                result
            }
            customerRiskAssessment {
                result
            }
        }
    }
`
const REVIEW_CASE = gql`
    mutation ReviewCase($reviewCase: ReviewCaseInput!) { 
        reviewCase(case: $reviewCase) {
            id
            status
            customer {
                name
                countryOfResidence
                riskCategory
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
                result
            }
            counterpartyNegativeScreening {
                result
            }
            customerRiskAssessment {
                result
            }
        }
    }
`

export class KycCaseManagementGraphqlHack implements KycCaseManagementApi {
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

        this.listCases().then(result => this.subject.next(result))

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
            .then(async (result: FetchResult<{createCase: KycCaseModel}>) => {
                this.subscribeToCases();

                return result.data?.createCase
            }) as Promise<KycCaseModel>
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

    approveCase(input: ApproveCaseModel): Promise<KycCaseModel> {
        return this.client
            .mutate<{approveCase: KycCaseModel}>({
                mutation: APPROVE_CASE,
                variables: {'case': input},
                refetchQueries: [{query: LIST_CASES}, {query: GET_CASE, variables: {caseId: input.id}}],
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{approveCase: KycCaseModel}>) => {
                this.subscribeToCases();

                return result.data?.approveCase
            }) as Promise<KycCaseModel>
    }

    reviewCase(input: ReviewCaseModel): Promise<KycCaseModel> {
        return this.client
            .mutate<{reviewCase: KycCaseModel}>({
                mutation: REVIEW_CASE,
                variables: {'case': input},
                refetchQueries: [{query: LIST_CASES}, {query: GET_CASE, variables: {caseId: input.id}}],
                awaitRefetchQueries: true
            })
            .then(async (result: FetchResult<{reviewCase: KycCaseModel}>) => {
                this.subscribeToCases();

                return result.data?.reviewCase
            }) as Promise<KycCaseModel>
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