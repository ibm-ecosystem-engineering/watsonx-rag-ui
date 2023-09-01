import {MenuOptionsService} from "./menu-options.service.ts";

export * from './menu-options.api';

export const menuOptionsApi = () => new MenuOptionsService();
