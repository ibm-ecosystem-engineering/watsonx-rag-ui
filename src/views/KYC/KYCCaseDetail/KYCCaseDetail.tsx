// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Button, Loading} from "@carbon/react";
import {useAtomValue, useSetAtom} from "jotai";

import './KYCCaseDetail.scss';
import {KYCCaseNew} from "./KYCCaseNew";
import {KYCCaseApproval} from "./KYCCaseApproval";
import {KYCCasePending} from "./KYCCasePending";
import {KYCCaseReview} from "./KYCCaseReview";
import {KYCCaseCompleted} from "./KYCCaseCompleted";
import {selectedKycCaseAtom, selectedKycCaseAtomLoadable} from "../../../atoms";
import {KycCaseModel} from "../../../models";

export interface KYCCaseDetailProps {
    basePath: string;
}

export const KYCCaseDetail: React.FunctionComponent<KYCCaseDetailProps> = (props: KYCCaseDetailProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const selectedCaseLoadable = useAtomValue(selectedKycCaseAtomLoadable);
    const setSelectedCase = useSetAtom(selectedKycCaseAtom);

    if (selectedCaseLoadable.state === 'loading') {
        return (
            <div className="loadingContainer">
            <Loading
                description="Active loading indicator" withOverlay={false}
            />
            </div>
        )
    } else if (selectedCaseLoadable.state === 'hasError') {
        return (
            <div>
                <div>Error: {selectedCaseLoadable.error as string}</div>
            </div>
        )
    }

    const selectedCase: KycCaseModel | undefined = selectedCaseLoadable.data

    if (id !== 'new' && selectedCase?.id !== id) {
        setSelectedCase(id);
    }

    const handleCancel = () => {
        navigate(props.basePath)
    }

    if (id === 'new') {
        return (<KYCCaseNew returnUrl={props.basePath} />)
    } else if (!selectedCase) {
        return (<div>Loading case: {id}</div>)
    }

    if (selectedCase.status === 'New') {
        return (<KYCCaseReview currentCase={selectedCase} returnUrl={props.basePath} />)
    }

    if (selectedCase.status === 'Pending') {
        return (<KYCCasePending currentCase={selectedCase} returnUrl={props.basePath} />)
    }

    if (selectedCase.status === 'Awaiting Approval') {
        return (<KYCCaseApproval currentCase={selectedCase} returnUrl={props.basePath} />)
    }

    if (selectedCase.status === 'Closed') {
        return (<KYCCaseCompleted currentCase={selectedCase} returnUrl={props.basePath} />)
    }

    return (
        <div>
            <div>Unknown status for case: {selectedCase.status}</div>
            <div className="caseDetailButtons"><Button kind='tertiary' onClick={handleCancel}>Return</Button></div>
        </div>
    )
}
