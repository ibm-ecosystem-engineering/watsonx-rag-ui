import {MenuConfigApi} from "./menu-config.api.ts";

import {MenuConfigModel} from "../../models";

export class MenuConfigService implements MenuConfigApi {
    async loadConfig(): Promise<MenuConfigModel> {
        return {
            dataExtractionUrl: '',
            negativeNewsScreeningUrl: '',
            contractComplianceCheckUrl: '',
            qualitySamplingUrl: '',
            riskAssessmentEngineUrl: 'https://cpd-cp4ba.cp4ba-cra-c6c44da74def18a795b07cc32856e138-0000.us-south.containers.appdomain.cloud/ae-pbk/Risk%20Assessment%20Business%20Application(EKYCBA)',
            assessmentRulesStudioUrl: 'https://cpd-cp4ba.cp4ba-cra-c6c44da74def18a795b07cc32856e138-0000.us-south.containers.appdomain.cloud/',
            negativeScreeningApiUrl: '',
            customerRiskAssessmentApiUrl: '',
            kycCaseSummaryApiUrl: ''
        }
    }
}
