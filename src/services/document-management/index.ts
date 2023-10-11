import {DocumentManagementApi} from "./document-management.api.ts";
import {DocumentManagementGraphql} from "./document-management.graphql.ts";

export * from './document-management.api'

let _instance: DocumentManagementApi;
export const documentManagementApi = (): DocumentManagementApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new DocumentManagementGraphql();
}
