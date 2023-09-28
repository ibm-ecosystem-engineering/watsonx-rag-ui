// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button} from "@carbon/react";
import {useSetAtom} from "jotai";

import './KYCCasePending.scss';
import {selectedKycCaseAtom} from "../../../../atoms";
import {DocumentList, KycCaseOverview, KycCaseResult, Stack} from "../../../../components";
import {KycCaseModel} from "../../../../models";
import {kycCaseManagementApi} from "../../../../services";

export interface KYCCasePendingProps {
    currentCase: KycCaseModel;
    returnUrl: string;
    title?: string;
}

export const KYCCasePending: React.FunctionComponent<KYCCasePendingProps> = (props: KYCCasePendingProps) => {
    const navigate = useNavigate();
    const setSelectedCase = useSetAtom(selectedKycCaseAtom)
    const service = kycCaseManagementApi();

    const handleCancel = () => {
        navigate(props.returnUrl);
    }

    const handleRefresh = () => {
        service.processCase(props.currentCase.id)
            .then(kycCase => setSelectedCase(kycCase))
            .catch(err => console.error('Error processing case: ', {err}))
    }

    return (
            <Stack gap={5}>
                <h2>{props.title ? props.title : 'Pending information'}</h2>
                <KycCaseOverview currentCase={props.currentCase} />
                <DocumentList documents={props.currentCase.documents} />
                <KycCaseResult currentCase={props.currentCase} />
                <div><Button kind="tertiary" onClick={handleCancel}>Return</Button> <Button onClick={handleRefresh}>Refresh</Button></div>
            </Stack>
    )
}
