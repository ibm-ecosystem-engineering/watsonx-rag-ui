
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {CSSProperties} from 'react';

export interface ListItemsProps {
    unordered?: boolean;
    items: string[]
    className?: string;
    style?: CSSProperties;
    itemStyle?: CSSProperties;
}

export const ListItems: React.FunctionComponent<ListItemsProps> = (props: ListItemsProps) => {
    if (!props.items || props.items.length === 0) {
        return (<></>)
    }

    if (props.unordered) {
        return (
            <ul className={props.className} style={props.style}>
                {props.items.map((item, index) => (<li key={index} style={props.itemStyle}>{item}</li>))}
            </ul>
        )
    } else {
        return (
            <ol className={props.className} style={props.style}>
                {props.items.map((item, index) => (<li key={index} style={props.itemStyle}>{item}</li>))}
            </ol>
        )
    }
}
