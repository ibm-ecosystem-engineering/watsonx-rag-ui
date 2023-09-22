
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './NegativeNews.scss';
import {NegativeScreeningModel} from "../../models";

export interface NegativeNewsProps {
    type: string;
    hideTitle?: boolean;
    news?: NegativeScreeningModel;
}

export const NegativeNews: React.FunctionComponent<NegativeNewsProps> = (props: NegativeNewsProps) => {

    if (props.news && !props.news.result) {
        return (<></>)
    }

    const getContent = (): string => {
        if (!props.news) {
            return 'Pending'
        }

        if (props.news.error) {
            return 'Error'
        }

        return props.news.result || '--'
    }

    return (
        <div style={{width: '100%', textAlign: 'left'}}>
            {!props.hideTitle ? (<div className="negNewsTitle">Negative news - {props.type}</div>) : (<></>)}
            <div>{getContent()}</div>
        </div>
    )
}
