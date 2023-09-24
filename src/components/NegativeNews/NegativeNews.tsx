
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './NegativeNews.scss';
import {NegativeScreeningModel, NewsItemModel} from "../../models";
import {ListItems} from "../ListItems";
import {useMediaQuery} from "usehooks-ts";

export interface NegativeNewsProps {
    type: string;
    hideTitle?: boolean;
    news?: NegativeScreeningModel;
    subject: string;
}

const NewsItems = (props: {items?: NewsItemModel[], title: string}) => {
    const printMode = useMediaQuery('print')

    if (!props.items || props.items.length === 0) {
        console.log('News items are empty: ' + props.title)
        return (<></>)
    }

    return (
        <>
            <div style={{fontWeight: 'bold', paddingTop: '10px'}}>{props.title}</div>
            {props.items.map(val => (
                <div key={val.title} style={{padding: '5px 5px'}}>
                    <a href={val.link} target="_blank" rel="noopener noreferrer"><div style={{fontStyle: 'italic', textDecoration: 'underline', padding: '10px 0'}}>{val.title}</div></a>
                    {printMode ? (<p>{val.link}</p>) : (<></>)}
                    <p>{val.summary}</p>
                    <ListItems
                        items={val.negativeNewsTopics}
                        unordered={true}
                        style={{padding: '5px 0', listStyleType: 'circle', listStylePosition: 'inside'}}
                        itemStyle={{padding: '3px 0'}}
                    />
                </div>
            ))}
        </>
    )
}

const notNullOrEmpty = (val?: string[]): boolean => {
    return !!val && val.length > 0
}

const NegativeNewsSummary = (props: {news: NegativeScreeningModel, subject: string}) => {
    const Summary = () => {
        if (props.news.negativeNewsCount > 0) {
            return (<p style={{padding: '5px 0'}}>The screening process has found Negative News about {props.subject}. <strong>Initiate L2 level Screening.</strong></p>)
        } else if (props.news.unrelatedNewsCount > 0) {
            return (<p style={{padding: '5px 0'}}>The screening process has found not found Negative News present but has found some items not related {props.subject}. <strong>Further Manual Screening is recommended.</strong></p>)
        } else {
            return (<p style={{padding: '5px 0'}}>No Negative News has been found about {props.subject}.</p>)
        }
    }

    const topics = (props.news?.negativeNews || [])
        .map(val => val.negativeNewsTopics)
        .filter(notNullOrEmpty)
        .reduce((result: string[], current: string[]) => {
            current.forEach(val => {
                if (!result.includes(val)) {
                    result.push(val)
                }
            })

            return result
        }, [])

    return (
        <>
            <div style={{paddingBottom: '2px', fontWeight: 'bold'}}>Total News Screened</div>
            <ul style={{padding: '5px 10px', listStylePosition: 'inside'}}>
                <li style={{padding: '3px 0'}}>Negative News: {props.news.negativeNewsCount}</li>
                <li style={{padding: '3px 0'}}>Non-negative News: {props.news.nonNegativeNewsCount}</li>
                <li style={{padding: '3px 0'}}>Unrelated news: {props.news.unrelatedNewsCount}</li>
            </ul>
            <Summary />
            {topics.length > 0 ? (<p>Topics identified are {topics.join(', ')}.</p>) : (<></>)}
        </>
    )
}

export const NegativeNews: React.FunctionComponent<NegativeNewsProps> = (props: NegativeNewsProps) => {

    if (props.news && !props.news.summary) {
        return (<></>)
    }

    const getContent = () => {
        if (!props.news) {
            return (<p>'Pending'</p>)
        }

        if (props.news.error) {
            return (<p>'Error'</p>)
        }

        return (<NegativeNewsSummary news={props.news} subject={props.subject} />)
    }

    return (
        <div style={{width: '100%', textAlign: 'left'}}>
            {!props.hideTitle ? (<div className="negNewsTitle">Negative news - {props.type}</div>) : (<></>)}
            {getContent()}
            <NewsItems items={props.news?.negativeNews} title="Negative news" />
            <NewsItems items={props.news?.nonNegativeNews} title="Non-negative news" />
            <NewsItems items={props.news?.unrelatedNews} title="Unrelated news" />
        </div>
    )
}
