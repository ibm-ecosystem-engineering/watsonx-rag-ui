import {KycCaseManagementApi} from "./kyc-case-management.api";
import {KycCaseManagementGraphqlHack} from "./kyc-case-management.graphql-hack";

export * from './kyc-case-management.api';

let _instance: KycCaseManagementApi;
export const kycCaseManagementApi = (): KycCaseManagementApi => {
    if (_instance) {
        return _instance;
    }

    return _instance = new KycCaseManagementGraphqlHack();
}
