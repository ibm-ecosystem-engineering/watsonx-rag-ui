import {LoginApi} from "./login.api";
import {LoginMock} from "./login.mock";

export * from './login.api';

let _instance: LoginApi;
export const loginApi = (): LoginApi => {
    if (_instance) {
        return _instance
    }

    return _instance = new LoginMock();
}
