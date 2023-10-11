import axios from "axios";
import {ApolloClient, FetchResult, gql} from "@apollo/client";

import {
    AddDocumentParams,
    AddDocumentResult,
    CollectionResult,
    CreateCollectionParams,
    DocumentManagementApi,
    ListCollectionsResult,
    ListDocumentsParams,
    ListDocumentsResult,
    QueryDocumentsParams,
    QueryDocumentsResult
} from "./document-management.api";
import {getApolloClient} from "../../backends";

export const CREATE_COLLECTION = gql`
mutation CreateCollection($input:CreateCollectionInput!) {
    createCollection(input: $input) {
        collectionId,
        name,
        description
    }
}
`

export const LIST_COLLECTIONS = gql`
query ListCollections {
    listCollections {
        collections {
            collectionId
            name
            description
        }
    }
}
`

export const LIST_DOCUMENTS = gql`
query ListDocuments($input: ListDocumentsInput!) {
    listDocuments(input: $input) {
        count
        documents {
            documentId
            filename
            status
        }
    }
}
`

export const QUERY_DOCUMENTS = gql`
    query QueryDocuments($input: QueryDocumentsInput!) {
        query(input: $input) {
            count
            documents {
                metadata {
                    key
                    value
                }
                pageContent
            }
        }
    }
`


export class DocumentManagementGraphql implements DocumentManagementApi {
    client: ApolloClient<unknown>;

    constructor() {
        this.client = getApolloClient();
    }

    async listCollections(): Promise<ListCollectionsResult> {
        console.log('Listing collections')
        return this.client
            .query<{listCollections: ListCollectionsResult}>({
                query: LIST_COLLECTIONS,
            })
            .then(result => {
                console.log('Got collections: ', {collections: result.data.listCollections})
                return result.data.listCollections
            })
    }

    async createCollection(input: CreateCollectionParams): Promise<CollectionResult> {
        return this.client
            .mutate<{createCollection: CollectionResult}>({
                mutation: CREATE_COLLECTION,
                variables: {input},
                refetchQueries: [{query: LIST_COLLECTIONS}],
                awaitRefetchQueries: true,
            })
            .then(async (result: FetchResult<{createCollection: CollectionResult}>) => {
                return result.data?.createCollection
            })
    }

    async listDocuments(input: ListDocumentsParams): Promise<ListDocumentsResult> {
        return this.client
            .query<{listDocuments: ListDocumentsResult}>({
                query: LIST_DOCUMENTS,
                variables: {input},
                fetchPolicy: 'no-cache',
            })
            .then(result => result.data.listDocuments)
    }

    async query(input: QueryDocumentsParams): Promise<QueryDocumentsResult> {
        return this.client
            .query<{query: QueryDocumentsResult}>({
                query: QUERY_DOCUMENTS,
                variables: {input},
                fetchPolicy: 'no-cache',
            })
            .then(result => result.data.query)
    }

    async addDocument(input: AddDocumentParams): Promise<AddDocumentResult> {
        const url = '/api/documents/upload'

        const form = new FormData();
        form.append('filename', input.filename);
        form.append('collectionId', input.collectionId);
        form.append('file', input.fileContent);

        return axios
            .post<AddDocumentResult>(url, form)
            .then(response => {
                return response.data;
            });
    }

}