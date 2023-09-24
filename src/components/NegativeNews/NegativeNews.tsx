
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './NegativeNews.scss';
import {NegativeScreeningModel, NewsItemModel} from "../../models";
import {ListItems} from "../ListItems";

export interface NegativeNewsProps {
    type: string;
    hideTitle?: boolean;
    news?: NegativeScreeningModel;
}

const NewsItems = (props: {items?: NewsItemModel[], title: string}) => {
    if (!props.items || props.items.length === 0) {
        return (<></>)
    }

    return (
        <>
            <div style={{fontStyle: 'italic'}}>{props.title}</div>
            {props.items.map(val => (
                <div key={val.title} style={{padding: '0 5px'}}>
                    <div>{val.title}</div>
                    <div>{val.summary}</div>
                    <ListItems items={val.negativeNewsTopics} unordered={true} />
                </div>
            ))}
        </>
    )
}

export const NegativeNews: React.FunctionComponent<NegativeNewsProps> = (props: NegativeNewsProps) => {

    if (props.news && !props.news.summary) {
        return (<></>)
    }

    const getContent = (): string => {
        if (!props.news) {
            return 'Pending'
        }

        if (props.news.error) {
            return 'Error'
        }

        return props.news.summary || '--'
    }

    return (
        <div style={{width: '100%', textAlign: 'left'}}>
            {!props.hideTitle ? (<div className="negNewsTitle">Negative news - {props.type}</div>) : (<></>)}
            <div>{getContent()}</div>
            <NewsItems items={props.news?.negativeNews} title="" />
        </div>
    )
}
