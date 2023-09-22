// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ComponentType} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Tab, TabList, TabPanel, TabPanels, Tabs} from "@carbon/react";
import {useSetAtom} from "jotai";
import {Error, Pending} from "@carbon/icons-react";

import './KYCCasePending.scss';
import {selectedKycCaseAtom} from "../../../../atoms";
import {CustomerRisk, DocumentList, KycSummary, NegativeNews, Stack} from "../../../../components";
import {KycCaseModel} from "../../../../models";
import {kycCaseManagementApi} from "../../../../services";

export interface KYCCasePendingProps {
    currentCase: KycCaseModel;
    returnUrl: string;
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

    const getIcon = (data?: {error?: string}): ComponentType<{size: number}> => {

        if (!data) {
            return Pending as never;
        }

        if (data.error) {
            return Error as never;
        }

        return undefined
    }

    const isDisabled = (data?: {error?: string}): boolean => {
        return !data;
    }

    const tabProps = (data: {error?: string}) => {
        return {
            renderIcon: getIcon(data),
            disabled: isDisabled(data),
        }
    }

    return (
            <Stack gap={7}>
                <h2>Pending information</h2>
                <div className="infoBox">
                    <Stack gap={3}>
                        <div><span className="label">Customer name:</span> {props.currentCase.customer.name}</div>
                        <div><span className="label">Country:</span> {props.currentCase.customer.countryOfResidence}</div>
                        <div><span className="label">Entity type:</span> {props.currentCase.customer.entityType}</div>
                        <div><span className="label">Industry type:</span> {props.currentCase.customer.industryType}</div>
                        <div><span className="label">Customer outreach:</span> {props.currentCase.customerOutreach || 'N/A'}</div>
                        <div><span className="label">Counterparty name:</span> {props.currentCase.counterparty.name}</div>
                        <div><span className="label">Counterparty country:</span> {props.currentCase.counterparty.countryOfResidence}</div>
                    </Stack>
                </div>
                <DocumentList documents={props.currentCase.documents} />
                <Tabs>
                    <TabList aria-label="List of tabs">
                        <Tab {...tabProps(props.currentCase.customerRiskAssessment)}>Customer Risk</Tab>
                        <Tab {...tabProps(props.currentCase.negativeScreening)}>Negative News - Party</Tab>
                        <Tab {...tabProps(props.currentCase.counterpartyNegativeScreening)}>Negative News - Counterparty</Tab>
                        <Tab {...tabProps(props.currentCase.caseSummary)}>KYC Summary</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel><CustomerRisk hideTitle={true} customerRisk={props.currentCase.customerRiskAssessment} /></TabPanel>
                        <TabPanel><NegativeNews hideTitle={true} type="Party" news={props.currentCase.negativeScreening} /></TabPanel>
                        <TabPanel><NegativeNews hideTitle={true} type="Counterparty" news={props.currentCase.counterpartyNegativeScreening} /></TabPanel>
                        <TabPanel><KycSummary hideTitle={true} kycSummary={props.currentCase.caseSummary} /></TabPanel>
                    </TabPanels>
                </Tabs>
                <div><Button kind="tertiary" onClick={handleCancel}>Return</Button> <Button onClick={handleRefresh}>Refresh</Button></div>
            </Stack>
    )
}
