// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ReactNode} from "react";
import {Route, Routes} from "react-router-dom";
import {Notification, Search, User} from "@carbon/icons-react";
import {useAtom, useAtomValue} from "jotai";
import {Loading} from "@carbon/react";

import './App.css'
import {activeItemAtom, currentUserAtomLoadable} from "./atoms";
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
    RTCQC,
    Utilities,
    Welcome
} from "./views";
import {KycSummarizeNative} from "./views/KycSummarizeNative";

function App() {
    const loadable = useAtomValue(currentUserAtomLoadable);
    const [activeItem, setActiveItem] = useAtom(activeItemAtom);

    const checkAuth = (element: ReactNode): ReactNode => {
        return element
    }

    const menuLinks: MenuLinksModel[] = [
        {title: 'Welcome', href: '/', element: <Welcome />},
        {title: 'Dashboard', href: '/secure/dashboard', element: <Dashboard />},
        {
            title: 'FinCrime',
            href: '/secure/fincrime',
            element: <KYC />,
            subMenus: [
                {title: 'KYC Case List', href: '', element: <KYCCaseList basePath="/secure/fincrime" /> },
                {title: 'KYC Case Detail', href: 'case/:id', element: <KYCCaseDetail basePath="/secure/fincrime" /> }
            ]
        },
        {title: 'Customer Risk', href: '/secure/customer-risk', element: <CustomerRisk /> },
        {title: 'RTC - QC', href: '/secure/rtc-qc', element: <RTCQC /> },
        {title: 'KYC Summarization', href: '/secure/kyc-summarization', element: <KycSummarize /> },
        {title: 'KYC Summarize', href: '/secure/kyc-summarize', excludeFromMenu: true, element: <KycSummarizeNative returnUrl="/secure/kyc-summarization" /> },
        {
            title: 'Utilities',
            href: '/secure/utilities',
            element: <KYC />,
            subMenus: [
                {title: 'Utilities', href: '', element: <Utilities /> },
                {title: 'Data Extraction', href: 'data-extraction', element: <DataExtraction /> },
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
                        <Route path={link.href} element={checkAuth(link.element)} key={link.href}>
                            {renderMenuLinks(link.subMenus)}
                        </Route>
                    )
                }

                if (!link.href) {
                    return (
                        <Route index element={checkAuth(link.element)} key="index" />
                    )
                }

                return (
                    <Route path={link.href} element={checkAuth(link.element)} key={link.href} />
                )
            })
    }

    if (loadable.state === 'loading' || loadable.state === 'hasError') {
        return (<Loading active={true} description="Login loading" id="login-loading" withOverlay={true} />)
    }
    //
    // const currentUser = loadable.data;
    //
    // if (!currentUser) {
    //     return (<Login setCurrentUser={setCurrentUser} />)
    // }

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
