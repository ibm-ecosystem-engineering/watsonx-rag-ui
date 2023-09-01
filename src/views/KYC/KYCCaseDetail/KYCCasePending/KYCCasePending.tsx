
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useNavigate} from "react-router-dom";
import {useAtomValue} from "jotai";
import {Button, DatePicker, DatePickerInput, Select, SelectItem, TextInput} from "@carbon/react";
import {Stack} from "@carbon/react/lib/components/Stack"

import {countriesAtomLoadable} from "../../../../atoms";
import {KycCaseModel} from "../../../../models";

export interface KYCCasePendingProps {
    currentCase: KycCaseModel;
    returnUrl: string;
}

export const KYCCasePending: React.FunctionComponent<KYCCasePendingProps> = (props: KYCCasePendingProps) => {
    const countriesLoadable = useAtomValue(countriesAtomLoadable);
    const navigate = useNavigate();

    const countries = countriesLoadable.state === 'hasData' ? countriesLoadable.data : [];

    const handleCancel = () => {
        navigate(props.returnUrl);
    }

    return (
        <Stack>
            <h2>Review case</h2>
            <TextInput
                helperText="The name of the customer"
                id="caseCustomerName"
                invalidText="Invalid customer name"
                labelText="Customer name"
                placeholder="Customer name"
                value={props.currentCase.customer.name}
                readOnly={true}
                required={true}
            />
            <DatePicker dateFormat="m/d/Y" datePickerType="single" value={props.currentCase.customer.dateOfBirth} readOnly={true}>
                <DatePickerInput
                    id="caseCustomerDob"
                    placeholder="mm/dd/yyyy"
                    labelText="Date of birth"
                    type="text"
                />
            </DatePicker>
            <Select
                id="caseCustomerCountry"
                invalidText="Invalid country selected"
                labelText="Country of residence"
                disabled={countriesLoadable.state !== 'hasData'}
                value={props.currentCase.customer.countryOfResidence}
                required={true}
                readOnly={true}
            >
                {countries.map(option => <SelectItem key={option.value} text={option.text} value={option.value} />)}
            </Select>
            <div><Button kind="tertiary" onClick={handleCancel}>Return</Button></div>
        </Stack>
    )
}
