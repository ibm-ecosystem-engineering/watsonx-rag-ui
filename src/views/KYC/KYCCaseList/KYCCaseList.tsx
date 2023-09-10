// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useNavigate} from "react-router-dom";
import {useAtomValue} from "jotai";

import '../KYC.scss';
import {countriesAtomLoadable, kycCaseAtom} from "../../../atoms";
import {DataTable} from "../../../components";
import {FormOptionModel, KycCaseModel} from "../../../models";
import {first} from "../../../utils";

export interface KYCCaseListProps {
    basePath: string;
}

interface KycCaseTableModel {
    id: string;
    customerName: string;
    country: string;
    status: string;
    customerOutreach: string;
    negativeScreening: string;
    counterpartyNegativeScreening: string;
    customerRiskAssessment: string;
}

const mapCountry = (countryCode: string, countries: FormOptionModel[] = []): string => {
    if (!countries || countries.length === 0) {
        return countryCode;
    }

    return first(countries.filter(opt => opt.value === countryCode))
        .map(opt => opt.text)
        .orElse(countryCode);
}

const kycCaseModelToTableModel = (countries: FormOptionModel[] = []) => {
    return (model: KycCaseModel): KycCaseTableModel => {
        return {
            id: model.id,
            customerName: model.customer.name,
            country: mapCountry(model.customer.countryOfResidence, countries),
            status: model.status,
            customerOutreach: model.customerOutreach || 'N/A',
            negativeScreening: model.negativeScreening?.result || '--',
            counterpartyNegativeScreening: model.counterpartyNegativeScreening?.result || '--',
            customerRiskAssessment: model.customerRiskAssessment?.result || '--'
        }
    }
}

export const KYCCaseList: React.FunctionComponent<KYCCaseListProps> = (props: KYCCaseListProps) => {
    const kycCases = useAtomValue(kycCaseAtom);
    const countriesLoadable = useAtomValue(countriesAtomLoadable);
    const navigate = useNavigate();

    const headerData: Array<{header: string, key: keyof KycCaseTableModel}> = [
        {header: 'Customer Name', key: 'customerName'},
        {header: 'Country', key: 'country'},
        {header: 'Status', key: 'status'},
        {header: 'Customer Outreach', key: 'customerOutreach'},
        {header: 'Negative Screening', key: 'negativeScreening'},
        {header: 'Counterparty Negative Screening', key: 'counterpartyNegativeScreening'},
        {header: 'Customer Risk', key: 'customerRiskAssessment'}
    ]

    const countries = countriesLoadable.state === 'hasData' ? countriesLoadable.data : []

    const rowData: KycCaseTableModel[] = kycCases.map(kycCaseModelToTableModel(countries))

    const navigateToCase = (caseId: string) => {
        const url = `${props.basePath}/case/${caseId}`

        navigate(url)
    }

    return (
        <div>
            <DataTable
                headerData={headerData}
                rowData={rowData}
                onRowClick={navigateToCase}
                toolbarButtonText="Open case"
                onToolbarButtonClick={() => navigateToCase('new')} />
        </div>
    )
}
