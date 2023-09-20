// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {useAtomValue} from "jotai";
import {Loadable} from "jotai/vanilla/utils/loadable";

import {AtomSelect, SpecificAtomSelectProps} from "../AtomSelect";
import {industryTypesAtomLoadable} from "../../atoms";
import {FormOptionModel} from "../../models";

export const IndustryTypeSelect: React.FunctionComponent<SpecificAtomSelectProps> = (props: SpecificAtomSelectProps) => {
    const loadable: Loadable<Promise<FormOptionModel[]>> = useAtomValue(industryTypesAtomLoadable);

    return (
        <AtomSelect
            id={props.id}
            invalidText="Invalid industry type selected"
            labelText="Industry type"
            value={props.value}
            onChange={props.onChange}
            required={props.required}
            readOnly={props.readOnly}
            className={props.className}
            style={props.style}
            loadable={loadable}
        />
    )
}
