import React from "react";
import {
    Content,
    Header,
    HeaderContainer,
    HeaderGlobalAction,
    HeaderGlobalBar,
    HeaderMenu,
    HeaderMenuButton,
    HeaderMenuItem,
    HeaderName,
    HeaderNavigation,
    SideNav,
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
    SkipToContent,
    Theme
} from '@carbon/react';
import {Fade,} from '@carbon/icons-react';
import {BrowserRouter, Link} from 'react-router-dom';

import './UIShell.scss';
import {ErrorBoundary} from "../ErrorBoundary";
import {isMenuItemModel, MenuModel, NavigationModel} from "../../models";

export interface UIShellProps {
    prefix: string;
    title?: string;
    navigation?: NavigationModel;
    activeItem: string;
    setActiveItem: (item: string) => void;
    children: unknown;
}


const renderHeaderMenuItem = (item: MenuModel) => {
    if (isMenuItemModel(item)) {
        return (<HeaderMenuItem href={item.href} key={item.title}>{item.title}</HeaderMenuItem>)
    }

    return (
        <HeaderMenu aria-label={item.title} menuLinkName={item.title} key={item.title}>
            {item.items.map(childItem => renderHeaderMenuItem(childItem))}
        </HeaderMenu>
    )
}

const renderHeaderNavigation = (props: UIShellProps, label: string = 'React App') => {
    const headerNav = props.navigation?.headerNav
    if (headerNav === undefined || headerNav.length === 0) {
        return (<></>)
    }

    return (
        <HeaderNavigation aria-label={label}>
            {headerNav.map(item => renderHeaderMenuItem(item))}
        </HeaderNavigation>
    )
}

const renderGlobalBar = (props: UIShellProps) => {
    const globalBar = props.navigation?.globalBar
    if (globalBar === undefined || globalBar.length === 0) {
        return (<></>)
    }

    return (
        <HeaderGlobalBar>
            {globalBar.map(item => {
                return (
                    <HeaderGlobalAction
                        aria-label={item.title}
                        tooltipAlignment="end"
                        key={item.title}
                    >
                        {item.action}
                    </HeaderGlobalAction>
                )
            })}
        </HeaderGlobalBar>

    )
}

const renderSideNavItem = (activeItem: string, setActiveItem, item: MenuModel) => {
    if (isMenuItemModel(item)) {
        return (
            <SideNavMenuItem
                element={Link}
                to={item.href}
                isActive={activeItem === item.href}
                onClick={() => setActiveItem(item.href)}
                key={item.title}
            >
                {item.title}
            </SideNavMenuItem>
        )
    }

    return (
        <SideNavMenu renderIcon={Fade} title={item.title} defaultExpanded>
            {item.items.map(childItem => renderSideNavItem(activeItem, setActiveItem, childItem))}
        </SideNavMenu>
    )
}

const renderSideNav = (props: UIShellProps, activeItem: string, setActiveItem: (item: string) => void, isSideNavExpanded: boolean) => {
    const sideNav = props.navigation?.sideNav
    if (sideNav === undefined || sideNav.length === 0) {
        return (<></>)
    }

    return (
        <SideNav aria-label="Side navigation" expanded={isSideNavExpanded}>
            <SideNavItems>
                {sideNav.map(item => renderSideNavItem(activeItem, setActiveItem, item))}
            </SideNavItems>
        </SideNav>
    )
}


export const UIShell: React.FunctionComponent<UIShellProps> = (props: UIShellProps) => {

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
                                <HeaderName href="#" prefix={props.prefix}>
                                    &nbsp;{props.title}
                                </HeaderName>
                                {renderHeaderNavigation(props)}
                                {renderGlobalBar(props)}
                                <ErrorBoundary>
                                    {renderSideNav(props, props.activeItem, props.setActiveItem, isSideNavExpanded)}
                                </ErrorBoundary>
                            </Header>
                        </div>
                    )}
                />
            </Theme>
            <Content className='content'>
                {props.children}
            </Content>
        </BrowserRouter>
    );
}
