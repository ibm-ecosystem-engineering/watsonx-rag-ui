// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useAtomValue} from "jotai";
import {Loadable} from "jotai/vanilla/utils/loadable";

import {AtomComboBox, SpecificAtomComboBoxProps} from "../AtomComboBox";
import {countriesAtomLoadable} from "../../atoms";
import {FormOptionModel} from "../../models";


export const CountrySelect: React.FunctionComponent<SpecificAtomComboBoxProps> = (props: SpecificAtomComboBoxProps) => {
    const countriesLoadable: Loadable<Promise<FormOptionModel[]>> = useAtomValue(countriesAtomLoadable);

    return (
        <AtomComboBox
            id={props.id}
            invalidText="Invalid country selected"
            labelText="Country of residence"
            value={props.value}
            onChange={props.onChange}
            required={props.required}
            readOnly={props.readOnly}
            className={props.className}
            style={props.style}
            loadable={countriesLoadable}
        />
    )
}
