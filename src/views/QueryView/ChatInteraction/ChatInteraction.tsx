// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';
import {useAtomValue, useSetAtom} from "jotai";

import {ChatResult} from "./ChatResult";
import {ChatInput} from "./ChatInput";

import {chatInteractionAtom} from "../../../atoms";
import {Stack} from "../../../components";
import {generativeApi} from "../../../services";

export interface QueryResultsProps {
    selectedCollection: string;
}

export const ChatInteraction: React.FunctionComponent<QueryResultsProps> = (props: QueryResultsProps) => {
    const [state, setState] = useState<'ready' | 'loading'>('ready')
    const chatInteractions = useAtomValue(chatInteractionAtom)
    const setChatInteractions = useSetAtom(chatInteractionAtom)

    const handleSubmit = (question: string) => {
        setState('loading')
        generativeApi()
            .generate({question, collectionId: props.selectedCollection})
            .then(result => {
                setChatInteractions({question, answer: result.generatedText});
                setState('ready');
            })
            .catch(() => setState('ready'))
    }

    return (
        <Stack gap={2}>
            <ChatResult chatInteractions={chatInteractions} />
            <ChatInput state={!props.selectedCollection ? 'not ready' : state} onSubmit={handleSubmit} />
        </Stack>
    )
}
