import {MenuOptionsMock} from "./menu-options.mock";

export * from './menu-options.api';

export const menuOptionsApi = () => new MenuOptionsMock();
