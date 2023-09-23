
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { Component } from 'react';
import './DemoTile.scss';
import {Link} from "react-router-dom";

export interface DemoTileProps {
    title: string
    href: string
}

export interface DemoTileState {
}

export class DemoTile extends Component<DemoTileProps, DemoTileState> {


  render() {
      if (this.props.href.startsWith('http')) {
          return (
              <a className="demoTileLink" href={this.props.href} target="_blank" rel="noopener noreferrer">
                  <div className="demoTile">
                      <div className="demoTileContent">
                      {this.props.title}
                      </div>
                  </div>
              </a>
          )
      }

      return (
          <Link className="demoTileLink" to={this.props.href}>
              <div className="demoTile">
                  <div className="demoTileContent">
                  {this.props.title}
                  </div>
              </div>
          </Link>
      )
  }
}
