import {FormOptionModel} from "../../models";

export abstract class MenuOptionsApi {
    abstract getCountryList(): Promise<FormOptionModel[]>;
}
