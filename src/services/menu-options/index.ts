import {MenuOptionsMock} from "./menu-options.mock.ts";

export * from './menu-options.api';

export const menuOptionsApi = () => new MenuOptionsMock();
