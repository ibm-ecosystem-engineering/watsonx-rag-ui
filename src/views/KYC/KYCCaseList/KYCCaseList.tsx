// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { useNavigate } from "react-router-dom";
import {Button, DataTableHeader} from "@carbon/react";
import {useAtomValue} from "jotai";
import dayjs from "dayjs";

import '../KYC.scss';
import {kycCaseAtom} from "../../../atoms";
import {DataTable} from "../../../components";
import {FormOptionModel, KycCaseModel} from "../../../models";
import {first} from "../../../utils";
import {countriesAtomLoadable} from "../../../atoms/menu-options.atom.ts";

export interface KYCCaseListProps {
    basePath: string;
}

interface KycCaseTableModel {
    id: string;
    customerName: string;
    age: number;
    country: string;
    status: string;
    negativeScreening: string;
    customerRiskAssessment: string;
}

const dobToAge = (dob: string): number => {
    const date = dayjs(dob);
    const now = dayjs();

    return now.diff(date, 'year')
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
            age: dobToAge(model.customer.dateOfBirth),
            country: mapCountry(model.customer.countryOfResidence, countries),
            status: model.status,
            negativeScreening: model.negativeScreening?.result || '--',
            customerRiskAssessment: model.customerRiskAssessment?.result || '--'
        }
    }
}

export const KYCCaseList: React.FunctionComponent<KYCCaseListProps> = (props: KYCCaseListProps) => {
    const kycCases: KycCaseModel[] = useAtomValue(kycCaseAtom);
    const countriesLoadable = useAtomValue(countriesAtomLoadable);
    const navigate = useNavigate();

    const headerData: DataTableHeader[] = [
        {header: 'Customer Name', key: 'customerName'},
        {header: 'Age', key: 'age'},
        {header: 'Country', key: 'country'},
        {header: 'Status', key: 'status'},
        {header: 'Negative Screening', key: 'negativeScreening'},
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
            <div className="kycButtonBar">
                <Button style={{float: 'right'}} onClick={() => navigateToCase('new')}>Open case</Button>
            </div>
            <DataTable headerData={headerData} rowData={rowData} onRowClick={navigateToCase} />
        </div>
    )
}
