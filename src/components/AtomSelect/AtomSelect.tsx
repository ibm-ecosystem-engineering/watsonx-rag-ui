// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ChangeEvent, CSSProperties} from 'react';
import {Select, SelectItem} from "@carbon/react";
import {Loadable} from "jotai/vanilla/utils/loadable";

import {FormOptionModel} from "../../models";

export interface AtomSelectProps {
    id: string;
    loadable: Loadable<Promise<FormOptionModel[]>>;
    value: string;
    invalidText: string;
    labelText: string;
    required?: boolean;
    readOnly?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    className?: string;
    style?: CSSProperties;
}

export interface SpecificAtomSelectProps {
    id: string;
    required?: boolean;
    readOnly?: boolean;
    value: string;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    className?: string;
    style?: CSSProperties;
}

const loadFormItems = (loadable: Loadable<Promise<FormOptionModel[]>>): FormOptionModel[] => {
    const items: FormOptionModel[] = loadable.state === 'hasData'
        ? loadable.data
        : [];

    return items
        .filter(item => item.value !== null)
        .filter(item => item.text !== undefined)
        .filter(item => item.value !== 'null')
        .filter(item => item.text !== 'undefined')
}

export const AtomSelect: React.FunctionComponent<AtomSelectProps> = (props: AtomSelectProps) => {

    const items: FormOptionModel[] = loadFormItems(props.loadable);

    const buildSelectItem = (option: FormOptionModel) => {
        const key = `${props.id}-${option.value}`;

        if (option.value === null || option.value === 'null') {
            console.log('Option: ', Object.assign({}, option, {key}));
        }

        return (<SelectItem key={key} text={option.text} value={option.value} />)
    }

    return (
        <Select
            id={props.id}
            invalidText={props.invalidText}
            labelText={props.labelText}
            disabled={props.loadable.state !== 'hasData'}
            value={props.value}
            onChange={props.onChange}
            required={props.required}
            readOnly={props.readOnly}
            className={props.className}
            style={props.style}
        >
            {items.map(buildSelectItem)}
        </Select>
    )
}
