import {KycCaseManagementMock} from "./kyc-case-management.mock.ts";
import {KycCaseManagementApi} from "./kyc-case-management.api.ts";

export * from './kyc-case-management.api';

let _instance: KycCaseManagementApi;
export const kycCaseManagementApi = (): KycCaseManagementApi => {
    if (_instance) {
        return _instance;
    }

    return _instance = new KycCaseManagementMock();
}

