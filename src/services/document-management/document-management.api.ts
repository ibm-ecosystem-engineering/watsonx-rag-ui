import {CollectionModel} from "../../models";

export interface AddDocumentParams {
    collectionId?: string;
    fileContent: File;
    filename: string;
    metadata?: Record<string, any>
}

export interface AddDocumentResult {
    documentId: string;
    collectionId: string;
}

export interface ListDocumentsParams {
    collectionId?: string;
    count?: number;
    statuses?: string[];
}

export interface DocumentModel {
    documentId: string;
    filename: string;
    status: string;
}

export interface QueryLargePassages {
    enabled?: boolean;
    max_document_count?: number;
    per_document?: boolean;
    max_per_document?: number;
    count?: number;
    find_answers?: boolean;
    max_answers_per_passage?: number;
}

export interface QueryDocumentsParams {
    collectionId?: string;
    filter?: string;
    naturalLanguageQuery?: string;
    count?: number;
    passages?: QueryLargePassages;
}

export interface DocumentDetailModel {
    pageContent: string;
    metadata: any;
}

export interface QueryDocumentsResult {
    documents: DocumentDetailModel[];
    count: number;
}

export interface ListCollectionsParams {
}

export interface CreateCollectionParams {
    name: string;
    description?: string;
}

export interface CollectionResult {
    collectionId: string;
    name: string;
    description?: string;
}

export interface ListCollectionsResult {
    collections: CollectionModel[];
}

export interface DocumentMetadata {
    documentId: string;
    filename: string;
    status: string;
    path?: string;
}

export interface ListDocumentsResult {
    documents: DocumentMetadata[];
    count: number;
}

export abstract class DocumentManagementApi {
    abstract listCollections(params?: ListCollectionsParams): Promise<ListCollectionsResult>;
    abstract createCollection(params: CreateCollectionParams): Promise<CollectionResult>;
    abstract listDocuments(params: ListDocumentsParams): Promise<ListDocumentsResult>;
    abstract addDocument(params: AddDocumentParams): Promise<AddDocumentResult>;
    abstract query(params: QueryDocumentsParams): Promise<QueryDocumentsResult>;
}
