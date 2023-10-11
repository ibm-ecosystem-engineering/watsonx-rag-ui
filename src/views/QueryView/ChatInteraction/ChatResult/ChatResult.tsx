// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import {ChatInteractionModel} from "../../../../models";

export interface ChatResultProps {
    chatInteractions: ChatInteractionModel[]
}

interface ChatInteractionProps {
    chatInteraction: ChatInteractionModel
}

const ChatInteraction: React.FunctionComponent<ChatInteractionProps> = (props: ChatInteractionProps) => {
    return (
        <div style={{overflow: 'auto', width: '100%', padding: '8px 0'}}>
            <div style={{width: '100%', textAlign: 'right', paddingBottom: '4px'}}>{props.chatInteraction.question}</div>
            <div style={{textAlign: 'left', width: '100%'}}>{props.chatInteraction.answer}</div>
        </div>
    )
}

export const ChatResult: React.FunctionComponent<ChatResultProps> = (props: ChatResultProps) => {
    return (
        <div style={{height: '100%', overflow: 'scroll'}}>
            {props.chatInteractions.map((chatInteraction, index) => (<ChatInteraction key={`chat-${index}`} chatInteraction={chatInteraction} />))}
        </div>
    )
}
