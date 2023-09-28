import {KycCaseSummaryApi} from "./kyc-case-summary.api";
import {KycCaseSummaryGraphql} from "./kyc-case-summary.graphql";

export * from './kyc-case-summary.api';

let _instance: KycCaseSummaryApi;
export const kycCaseSummaryApi = (): KycCaseSummaryApi => {
    if (_instance) {
        return _instance;
    }

    return _instance = new KycCaseSummaryGraphql();
}
