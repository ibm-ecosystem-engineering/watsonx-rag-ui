// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

export interface WelcomeProps {
}

export const Welcome: React.FunctionComponent<WelcomeProps> = () => {

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', margin: 'auto 20px'}}>
            <h2>Watsonx use case demos</h2>
        </div>
    )
}
