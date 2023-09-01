import {MenuConfigApi} from "./menu-config.api";
import {MenuConfigService} from "./menu-config.service";

export * from './menu-config.api';

export const menuConfigApi = (): MenuConfigApi => {
    return new MenuConfigService();
}
