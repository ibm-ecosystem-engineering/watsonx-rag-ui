// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";
import {Route, Routes} from "react-router-dom";
import {Notification, Search, User} from "@carbon/icons-react";

import './App.css'
import {Dummy, NotFound, UIShell} from "./components";
import {CustomerRisk, Dashboard, KYC, KYCCaseDetail, KYCCaseList, RTCQC, TaxCLM, Utilities} from "./views";
import {MenuLinksModel, NavigationModel} from "./models";

function App() {

    const menuLinks: MenuLinksModel[] = [
        {title: 'Dashboard', href: '/', element: <Dashboard />},
        {
            title: 'KYC',
            href: '/kyc',
            element: <KYC />,
            subMenus: [
                {title: 'KYC Case List', href: '', element: <KYCCaseList basePath="/kyc" /> },
                {title: 'KYC Case Detail', href: 'case/:id', element: <KYCCaseDetail basePath="/kyc" /> }
            ]
        },
        {title: 'TM Alerts', href: '/tm-alerts', element: <Dummy content="TM Alerts" />},
        {title: 'Customer Risk', href: '/customer-risk', element: <CustomerRisk />},
        {title: 'RTC - QC', href: '/rtc-qc', element: <RTCQC />},
        {title: 'Tax - CLM', href: '/tax-clm', element: <TaxCLM />},
        {title: 'Tax - GTM', href: '/tax-gtm', element: <Dummy content="Tax - GTM" />},
        {title: 'Utilities', href: '/utilities', element: <Utilities />},
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
                        <Route path={link.href} element={link.element}>
                            {renderMenuLinks(link.subMenus)}
                        </Route>
                    )
                }

                if (!link.href) {
                    return (
                        <Route index element={link.element} />
                    )
                }

                return (
                    <Route path={link.href} element={link.element} />
                )
            })
    }

  return (
    <div>
        <UIShell prefix="watsonx" navigation={navigation}>
            <Routes>
                {renderMenuLinks(menuLinks)}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </UIShell>
    </div>
  )
}

export default App
