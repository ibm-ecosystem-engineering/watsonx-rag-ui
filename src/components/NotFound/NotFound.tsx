// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { Component } from 'react';
import { InlineNotification } from '@carbon/react';

export class NotFound extends Component {
    render() {
        return (
            <InlineNotification
                title='404'
                subtitle='Not Found'
            />
        );
    }
}
