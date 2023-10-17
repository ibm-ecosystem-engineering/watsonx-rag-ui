// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {useState} from 'react';
import {Form, Loading, TextInput} from "@carbon/react";

export interface ChatInputProps {
    state: 'ready' | 'loading' | 'not ready';
    onSubmit: (value: string) => void;
}

export const ChatInput: React.FunctionComponent<ChatInputProps> = (props: ChatInputProps) => {
    const [value, setValue] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        props.onSubmit(value);
        setValue('');
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                    <Loading active={props.state === 'loading'} description="Loading" small={true} withOverlay={false} />
                <TextInput
                    helperText=""
                    id="chatInput"
                    labelText=""
                    placeholder="Message"
                    disabled={props.state !== 'ready'}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onSubmit={handleSubmit}
                    required={true}
                />
            </Form>
        </div>
    )
}
