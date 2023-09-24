
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

export interface ListItemsProps {
    unordered?: boolean;
    items: string[]
}

export const ListItems: React.FunctionComponent<ListItemsProps> = (props: ListItemsProps) => {
    if (!props.items || props.items.length === 0) {
        return (<></>)
    }

    if (props.unordered) {
        return (
            <ul>
                {props.items.map((item, index) => (<li key={index}>{item}</li>))}
            </ul>
        )
    } else {
        return (
            <ol>
                {props.items.map((item, index) => (<li key={index}>{item}</li>))}
            </ol>
        )
    }
}
