// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {Outlet} from "react-router-dom";

import './KYC.scss';

export interface KYCProps {
}

export const KYC: React.FunctionComponent<KYCProps> = () => {

    return (
        <div>
            <Outlet />
        </div>
    )
}
