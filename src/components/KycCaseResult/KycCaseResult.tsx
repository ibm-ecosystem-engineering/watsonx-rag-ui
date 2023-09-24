// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ComponentType} from 'react';
import {Error, Pending} from "@carbon/icons-react";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@carbon/react";
import {useMediaQuery} from "usehooks-ts";

import {CustomerRisk} from "../CustomerRisk";
import {KycSummary} from "../KycSummary";
import {NegativeNews} from "../NegativeNews";
import {KycCaseModel} from "../../models";

export interface KycCaseResultProps {
    currentCase: KycCaseModel;
}

export const KycCaseResult: React.FunctionComponent<KycCaseResultProps> = (props: KycCaseResultProps) => {
    const printMode = useMediaQuery('print')

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

    if (printMode) {
        return (
            <>
                <CustomerRisk customerRisk={props.currentCase.customerRiskAssessment} />
                <KycSummary kycSummary={props.currentCase.caseSummary} />
                <NegativeNews type="Party" news={props.currentCase.negativeScreening} subject={props.currentCase.customer.name} />
                <NegativeNews type="Counterparty" news={props.currentCase.counterpartyNegativeScreening} subject={props.currentCase.counterparty.name} />
            </>
        )
    }

    return (
        <Tabs>
            <TabList aria-label="List of tabs">
                <Tab {...tabProps(props.currentCase.customerRiskAssessment)}>Customer Risk</Tab>
                <Tab {...tabProps(props.currentCase.negativeScreening)}>Negative News - Party</Tab>
                <Tab {...tabProps(props.currentCase.counterpartyNegativeScreening)}>Negative News - Counterparty</Tab>
                <Tab {...tabProps(props.currentCase.caseSummary)}>KYC Summary</Tab>
            </TabList>
            <TabPanels>
                <TabPanel><CustomerRisk hideTitle={true} customerRisk={props.currentCase.customerRiskAssessment} /></TabPanel>
                <TabPanel><NegativeNews hideTitle={true} type="Party" news={props.currentCase.negativeScreening} subject={props.currentCase.customer.name} /></TabPanel>
                <TabPanel><NegativeNews hideTitle={true} type="Counterparty" news={props.currentCase.counterpartyNegativeScreening} subject={props.currentCase.counterparty.name} /></TabPanel>
                <TabPanel><KycSummary hideTitle={true} kycSummary={props.currentCase.caseSummary} /></TabPanel>
            </TabPanels>
        </Tabs>
    )
}
