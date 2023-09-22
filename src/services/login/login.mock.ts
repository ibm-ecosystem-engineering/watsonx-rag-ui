
import {LoginApi} from "./login.api";
import {UserProfileModel} from "../../models";

export class LoginMock implements LoginApi {
    async login(): Promise<UserProfileModel> {

        return {
            firstName: 'John',
            lastName: 'Doe',
        }
    }
}