// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";
import {Route, Routes} from "react-router-dom";
import {Notification, Search, User} from "@carbon/icons-react";

import './App.css'
import {NotFound, UIShell} from "./components";
import {CustomerRisk, Dashboard, KYC, KYCCaseDetail, KYCCaseList, KycSummarize, RTCQC, Utilities} from "./views";
import {MenuLinksModel, NavigationModel} from "./models";
import {DataExtraction} from "./views/DataExtraction";

function App() {

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
        sideNav: menuLinks.map(link => ({title: link.title, href: link.href}))
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

  return (
    <div>
        <UIShell prefix="watsonx" navigation={navigation}>
            <Routes>
                {renderMenuLinks(menuLinks)}
                <Route key="route-all" path="*" element={<NotFound />} />
            </Routes>
        </UIShell>
    </div>
  )
}

export default App
