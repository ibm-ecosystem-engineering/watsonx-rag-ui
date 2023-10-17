// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';

import './ChatResult.scss'
import {ChatInteractionModel} from "../../../../models";

export interface ChatResultProps {
    chatInteractions: ChatInteractionModel[]
}

interface ChatInteractionProps {
    chatInteraction: ChatInteractionModel
}

const ChatInteraction: React.FunctionComponent<ChatInteractionProps> = (props: ChatInteractionProps) => {
    return (
        <div className="interaction">
            <div style={{marginBottom: '5px', textAlign: "right"}}><div className="question">{props.chatInteraction.question}</div></div>
            <div style={{textAlign: 'left'}}><div className="answer">{props.chatInteraction.answer}</div></div>
        </div>
    )
}

export const ChatResult: React.FunctionComponent<ChatResultProps> = (props: ChatResultProps) => {
    return (
        <div className="chatPane">
            {props.chatInteractions.map((chatInteraction, index) => (<ChatInteraction key={`chat-${index}`} chatInteraction={chatInteraction} />))}
        </div>
    )
}
