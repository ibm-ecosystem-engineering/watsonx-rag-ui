// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";
import {Route, Routes} from "react-router-dom";
import {Notification, Search, User} from "@carbon/icons-react";
import {useAtomValue, useSetAtom, useAtom} from "jotai";
import {Loading} from "@carbon/react";

import './App.css'
import {activeItemAtom, currentUserAtom, currentUserAtomLoadable} from "./atoms";
import {NotFound, UIShell} from "./components";
import {MenuLinksModel, NavigationModel} from "./models";
import {
    CustomerRisk,
    Dashboard,
    DataExtraction,
    KYC,
    KYCCaseDetail,
    KYCCaseList,
    KycSummarize,
    Login,
    RTCQC,
    Utilities
} from "./views";

function App() {
    const setCurrentUser = useSetAtom(currentUserAtom);
    const loadable = useAtomValue(currentUserAtomLoadable)
    const [activeItem, setActiveItem] = useAtom(activeItemAtom)

    const menuLinks: MenuLinksModel[] = [
        {title: 'Dashboard', href: '/', element: <Dashboard />},
        {
            title: 'FinCrime',
            href: '/fincrime',
            element: <KYC />,
            subMenus: [
                {title: 'KYC Case List', href: '', element: <KYCCaseList basePath="/fincrime" /> },
                {title: 'KYC Case Detail', href: 'case/:id', element: <KYCCaseDetail basePath="/fincrime" /> }
            ]
        },
        {title: 'Customer Risk', href: '/customer-risk', element: <CustomerRisk />},
        {title: 'RTC - QC', href: '/rtc-qc', element: <RTCQC />},
        {title: 'KYC Summarization', href: '/kyc-summarization', element: <KycSummarize />},
        {
            title: 'Utilities',
            href: '/utilities',
            element: <KYC />,
            subMenus: [
                {title: 'Utilities', href: '', element: <Utilities />},
                {title: 'Data Extraction', href: 'data-extraction', element: <DataExtraction />},
            ]
        },
    ]

    const navigation: NavigationModel = {
        globalBar: [
            {title: 'Search', action: (<Search size={20} />)},
            {title: 'Notifications', action: (<Notification size={20} />)},
            {title: 'User Profile', action: (<User size={20} />)}
        ],
        sideNav: menuLinks
            .filter(link => !link.excludeFromMenu)
            .map(link => ({title: link.title, href: link.href}))
    }

    const renderMenuLinks = (menuLinks: MenuLinksModel[]) => {
        return menuLinks.map(link => {
                if (link.subMenus && link.subMenus.length > 0) {
                    return (
                        <Route path={link.href} element={link.element} key={link.href}>
                            {renderMenuLinks(link.subMenus)}
                        </Route>
                    )
                }

                if (!link.href) {
                    return (
                        <Route index element={link.element} key="index" />
                    )
                }

                return (
                    <Route path={link.href} element={link.element} key={link.href} />
                )
            })
    }

    if (loadable.state === 'loading' || loadable.state === 'hasError') {
        return (<Loading active={true} description="Login loading" id="login-loading" withOverlay={true} />)
    }

    const currentUser = loadable.data;

    if (!currentUser) {
        return (<Login setCurrentUser={setCurrentUser} />)
    }

    return (
        <div>
            <UIShell prefix="watsonx" navigation={navigation} activeItem={activeItem} setActiveItem={setActiveItem}>
                <Routes>
                    {renderMenuLinks(menuLinks)}
                    <Route key="route-all" path="*" element={<NotFound />} />
                </Routes>
            </UIShell>
        </div>
    )
}

export default App
