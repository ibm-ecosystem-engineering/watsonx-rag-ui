
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './CustomerRisk.scss';
import {CustomerRiskAssessmentModel} from "../../models";
import {Stack} from "../Stack";

export interface CustomerRiskProps {
    hideTitle?: boolean;
    customerRisk?: CustomerRiskAssessmentModel
}

export const CustomerRisk: React.FunctionComponent<CustomerRiskProps> = (props: CustomerRiskProps) => {

    const getContent = () => {
        if (!props.customerRisk) {
            return 'Pending'
        }

        if (props.customerRisk.error) {
            return 'Error'
        }

        return (
            <Stack gap={3}>
                <div><span className="label">Rating:</span>{props.customerRisk.rating}</div>
                <div><span className="label">Score:</span>{props.customerRisk.score}</div>
            </Stack>)
    }

    return (
        <div style={{width: '100%', textAlign: 'left'}}>
            {!props.hideTitle ? (<div className="craTitle">Customer risk</div>) : (<></>)}
            <div className="summary">{getContent()}</div>
        </div>
    )
}
