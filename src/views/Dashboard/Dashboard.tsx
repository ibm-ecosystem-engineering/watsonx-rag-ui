// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useAtomValue} from "jotai";
import {DonutChart} from "@carbon/charts-react";

import {KycCaseStatus, kycCaseStatusAtom} from "../../atoms";

export interface DashboardProps {
}

export const Dashboard: React.FunctionComponent<DashboardProps> = () => {

    const kycCaseStatus: KycCaseStatus[] = useAtomValue(kycCaseStatusAtom)
    const options = {
        title: 'Kyc Cases',
        resizable: true,
        donut: {
            center: {
                label: 'Total cases'
            }
        },
        height: '400px'
    }


    return (
        <div>
            <DonutChart
                data={kycCaseStatus}
                options={options}
            />
        </div>
    )
}
