import {LoginModel, UserProfileModel} from "../../models";

export abstract class LoginApi {
    abstract login(loginData: LoginModel): Promise<UserProfileModel>;
}
