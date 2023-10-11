
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ReactNode} from 'react';
import {useHydrateAtoms} from "jotai/react/utils";

export interface HydrateAtomsProps {
    initialValues: any;
    children: ReactNode | ReactNode[];
}

export const HydrateAtoms: React.FunctionComponent<HydrateAtomsProps> = (props: HydrateAtomsProps) => {
    useHydrateAtoms(props.initialValues);

    return props.children;
}
