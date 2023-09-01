
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {Component, ReactNode} from 'react';

import './DemoTileContainer.scss';

export interface DemoFileContainerProps {
    children: any
}

export interface DemoFileContainerState {
}

export class DemoTileContainer extends Component<DemoFileContainerProps, DemoFileContainerState> {

  render() {
    return (
        <div className="demoTileContainer">
            {this.props.children}
        </div>
    )
  }
}
