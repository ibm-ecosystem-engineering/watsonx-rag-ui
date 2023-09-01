import {MenuConfigApi} from "./menu-config.api.ts";
import {MenuConfigModel} from "../../models";

export class MenuConfigService implements MenuConfigApi {
    async loadConfig(): Promise<MenuConfigModel> {
        return {
            dataExtractionUrl: '',
            negativeNewsScreeningUrl: '',
            contractComplianceCheckUrl: '',
            qualitySamplingUrl: '',
            riskAssessmentEngineUrl: '',
            assessmentRulesStudioUrl: '',
            negativeScreeningApiUrl: '',
            customerRiskAssessmentApiUrl: '',
            kycCaseSummaryApiUrl: ''
        }
    }
}
