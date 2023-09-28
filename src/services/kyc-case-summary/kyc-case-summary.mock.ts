import {KycCaseSummaryApi} from "./kyc-case-summary.api.ts";

export class KycCaseSummaryMock implements KycCaseSummaryApi {
    async summarize(name: string): Promise<string> {
        return name;
    }
}
