
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './CustomerRisk.scss';
import {CustomerRiskAssessmentModel} from "../../models";

export interface CustomerRiskProps {
    customerRisk?: CustomerRiskAssessmentModel
}

export const CustomerRisk: React.FunctionComponent<CustomerRiskProps> = (props: CustomerRiskProps) => {

    const getContent = (): string => {
        if (!props.customerRisk) {
            return 'Pending'
        }

        if (props.customerRisk.error) {
            return 'Error'
        }

        return `${props.customerRisk.rating} - ${props.customerRisk.score}`
    }

    return (
        <div style={{width: '100%', textAlign: 'left'}}>
            <div className="craTitle">Customer risk</div>
            <div>{getContent()}</div>
        </div>
    )
}
