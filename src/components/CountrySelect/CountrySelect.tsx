// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ChangeEvent, CSSProperties} from 'react';
import {Select, SelectItem} from "@carbon/react";
import {useAtomValue} from "jotai";

import {countriesAtomLoadable} from "../../atoms";
import {FormOptionModel} from "../../models";

export interface CountrySelectProps {
    id: string;
    required?: boolean;
    readOnly?: boolean;
    value: string;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    className?: string;
    style?: CSSProperties;
}

export const CountrySelect: React.FunctionComponent<CountrySelectProps> = (props: CountrySelectProps) => {
    const countriesLoadable = useAtomValue(countriesAtomLoadable);

    const countries: FormOptionModel[] = countriesLoadable.state === 'hasData' ? countriesLoadable.data : [];

    return (
        <Select
            id={props.id}
            invalidText="Invalid country selected"
            labelText="Country of residence"
            disabled={countriesLoadable.state !== 'hasData'}
            value={props.value}
            onChange={props.onChange}
            required={props.required}
            readOnly={props.readOnly}
            className={props.className}
            style={props.style}
        >
            {countries.map(option => <SelectItem key={option.value} text={option.text} value={option.value} />)}
        </Select>
    )
}
