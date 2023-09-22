// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';
import {Button, Form, TextInput} from "@carbon/react";
import PasswordInput from "@carbon/react/es/components/TextInput/PasswordInput";

import {Stack} from "../../components";
import {LoginModel} from "../../models";
import {loginApi} from "../../services";

export interface LoginProps {
    setCurrentUser;
}

export const Login: React.FunctionComponent<LoginProps> = (props: LoginProps) => {
    const [login, setLogin] = useState<LoginModel>({username: '', password: ''});

    const service = loginApi();

    const handleSubmit = () => {
        service.login(login)
            .then(profile => props.setCurrentUser(Promise.resolve(profile)))
    }

    const handleChange = (value: keyof LoginModel) => {
        return (event) => {
            const newLogin = Object.assign({}, login);

            newLogin[value] = event.target.value;

            setLogin(newLogin);
        }
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: '500px'}}>
        <Form className="login" onSubmit={handleSubmit}>
            <Stack gap={5}>
                <h2>Login</h2>
                <TextInput
                    id="loginUsername"
                    invalidText="Invalid customer name"
                    labelText="Username"
                    placeholder="Username"
                    value={login.username}
                    onChange={handleChange('username')}
                    required={true}
                />
                <PasswordInput
                    helperText="The password of the user"
                    id="loginPassword"
                    type="password"
                    invalidText="Invalid password"
                    labelText="Password"
                    placeholder="Password"
                    value={login.password}
                    onChange={handleChange('password')}
                    required={true}
                />
                <div><Button type="submit">Login</Button></div>
            </Stack>
        </Form>
        </div>
        </div>
    )
}
