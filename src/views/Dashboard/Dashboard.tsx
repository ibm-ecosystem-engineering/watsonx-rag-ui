// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useAtomValue} from "jotai";
import {DonutChart} from "@carbon/charts-react";

import {kycCasesLoadable, KycCaseStatus, kycCaseStatusAtom} from "../../atoms";
import {Loading} from "@carbon/react";

export interface DashboardProps {
}

export const Dashboard: React.FunctionComponent<DashboardProps> = () => {
    const loadableKycCases = useAtomValue(kycCasesLoadable);

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

    if (loadableKycCases.state === 'loading') {
        return (<Loading active={true} withOverlay={true} />)
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
