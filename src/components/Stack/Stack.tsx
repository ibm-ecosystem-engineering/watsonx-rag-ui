
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import {Stack as CarbonStack} from "@carbon/react/lib/components/Stack"

export interface StackProps {
    gap: number;
    children: unknown | unknown[];
}

export const Stack: React.FunctionComponent<StackProps> = (props: StackProps) => {

    return (
        <CarbonStack gap={props.gap}>
            {props.children}
        </CarbonStack>
    )
}
