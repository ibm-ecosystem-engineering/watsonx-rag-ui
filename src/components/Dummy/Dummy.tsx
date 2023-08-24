import React from "react";

export interface DummyProps {
    content: string
}

export interface DummyState {
}

export class Dummy extends React.Component<DummyProps, DummyState> {

    render() {
        return (<div>{this.props.content}</div>)
    }
}
