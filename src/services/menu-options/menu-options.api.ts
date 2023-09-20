import {FormOptionModel} from "../../models";

export abstract class MenuOptionsApi {
    abstract getCountryList(): Promise<FormOptionModel[]>;
    abstract getIndustries(): Promise<FormOptionModel[]>;
    abstract getEntityTypes(): Promise<FormOptionModel[]>;
}
