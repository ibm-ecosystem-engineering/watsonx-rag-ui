// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {Outlet} from "react-router-dom";

import {UIShell} from "../../components";
import {NavigationModel} from "../../models";

export interface MainProps {
    navigation: NavigationModel
}

export const Main: React.FunctionComponent<MainProps> = (props: MainProps) => {
    return (
        <div>
            <UIShell prefix="watsonx" navigation={props.navigation}>
                <Outlet />
            </UIShell>
        </div>
    )
}
