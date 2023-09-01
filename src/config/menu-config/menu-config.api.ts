import {MenuConfigModel} from "../../models";

export abstract class MenuConfigApi {
    abstract loadConfig(): Promise<MenuConfigModel>;
}
