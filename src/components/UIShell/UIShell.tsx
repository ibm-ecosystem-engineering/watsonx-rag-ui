import React from "react";
import {
    HeaderContainer, Header, SkipToContent, HeaderMenuButton, HeaderName,
    HeaderNavigation, HeaderMenu, HeaderMenuItem, HeaderGlobalBar,
    HeaderGlobalAction, SideNav, SideNavItems, Content,
    SideNavMenu, SideNavMenuItem, Theme
} from '@carbon/react';
import {
    Notification,
    Search,
    Switcher,
    Fade,
} from '@carbon/icons-react';
import { BrowserRouter, Link } from 'react-router-dom';

import {ErrorBoundary} from "../ErrorBoundary";
import {isMenuItemModel, MenuModel, NavigationModel} from "../../models";

export interface UIShellProps {
    prefix: string
    title?: string
    navigation?: NavigationModel
    children: unknown
}

export interface UIShellState {
    activeItem: string
}

const isEmpty = (arr?: unknown[]) => {
    return !arr || arr.length === 0
}

export class UIShell extends React.Component<UIShellProps, UIShellState> {

    constructor(props: UIShellProps) {
        super(props);
        this.state = {
            activeItem: `/${window.location.pathname.split('/')[1] ?? ''}`
        };
    }

    renderHeaderMenuItem(item: MenuModel) {
        if (isMenuItemModel(item)) {
            return (<HeaderMenuItem href={item.href}>{item.title}</HeaderMenuItem>)
        }

        return (
            <HeaderMenu aria-label={item.title} menuLinkName={item.title}>
                {item.items.map(childItem => this.renderHeaderMenuItem(childItem))}
            </HeaderMenu>
        )
    }

    renderHeaderNavigation(label: string = 'React App') {
        const headerNav = this.props.navigation?.headerNav
        if (headerNav === undefined || headerNav.length === 0) {
            return (<></>)
        }

        return (
            <HeaderNavigation aria-label={label}>
                {headerNav.map(item => this.renderHeaderMenuItem(item))}
            </HeaderNavigation>
        )
    }

    renderGlobalBar() {
        const globalBar = this.props.navigation?.globalBar
        if (globalBar === undefined || globalBar.length === 0) {
            return (<></>)
        }

        return (
            <HeaderGlobalBar>
                {globalBar.map(item => {
                    return (
                        <HeaderGlobalAction
                            aria-label={item.title}
                            tooltipAlignment="end">
                            {item.action}
                        </HeaderGlobalAction>
                    )
                })}
            </HeaderGlobalBar>

        )
    }

    renderSideNavItem(item: MenuModel) {
        if (isMenuItemModel(item)) {
            return (
                <SideNavMenuItem element={Link} to={item.href}
                                     isActive={this.state.activeItem === item.href}
                                     onClick={() => { this.setState({ activeItem: item.href }) }}>
                    {item.title}
                </SideNavMenuItem>
            )
        }

        return (
            <SideNavMenu renderIcon={Fade} title={item.title} defaultExpanded>
                {item.items.map(childItem => this.renderSideNavItem(childItem))}
            </SideNavMenu>
        )
    }

    renderSideNav(isSideNavExpanded: boolean) {
        const sideNav = this.props.navigation?.sideNav
        if (sideNav === undefined || sideNav.length === 0) {
            return (<></>)
        }

        return (
            <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>
                <SideNavItems>
                    {sideNav.map(item => this.renderSideNavItem(item))}
                </SideNavItems>
            </SideNav>
        )
    }

    render() {
        return (
            <BrowserRouter>
                <Theme theme='g90'>
                    <HeaderContainer
                        render={({ isSideNavExpanded, onClickSideNavExpand }: {isSideNavExpanded: boolean, onClickSideNavExpand: () => void}) => (
                            <div>
                                <Header aria-label="IBM Platform Name">
                                    <SkipToContent />
                                    <HeaderMenuButton
                                        aria-label="Open menu"
                                        onClick={onClickSideNavExpand}
                                        isActive={isSideNavExpanded}
                                    />
                                    <HeaderName href="#" prefix={this.props.prefix}>
                                        {this.props.title}
                                    </HeaderName>
                                    {this.renderHeaderNavigation()}
                                    {this.renderGlobalBar()}
                                    <ErrorBoundary>
                                        {this.renderSideNav(isSideNavExpanded)}
                                    </ErrorBoundary>
                                </Header>
                            </div>
                        )}
                    />
                </Theme>
                <Content className='content'>
                    {this.props.children}
                </Content>
            </BrowserRouter>
        );
    }
}
