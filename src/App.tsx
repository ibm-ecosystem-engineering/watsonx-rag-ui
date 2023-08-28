import React from "react";
import {Route, Routes} from "react-router-dom";
import {Notification, Search, User} from "@carbon/icons-react";

import './App.css'
import {Dummy, NotFound, UIShell} from "./components";
import {Dashboard} from "./views";
import {NavigationModel} from "./models";

function App() {

    const menuLinks = [
        {title: 'Dashboard', href: '/', element: <Dashboard />},
        {title: 'KYC', href: '/kyc', element: <Dummy content="KYC" />},
        {title: 'TM Alerts', href: '/tm-alerts', element: <Dummy content="TM Alerts" />},
        {title: 'Customer Risk', href: '/customer-risk', element: <Dummy content="Customer Risk" />},
        {title: 'RTC - QC', href: '/rtc-qc', element: <Dummy content="RTC - QC" />},
        {title: 'Tax - CLM', href: '/tax-clm', element: <Dummy content="Tax - CLM" />},
        {title: 'Tax - GTM', href: '/tax-gtm', element: <Dummy content="Tax - GTM" />},
        {title: 'Utilities', href: '/utilities', element: <Dummy content="Utilities" />},
    ]

    const navigation: NavigationModel = {
        globalBar: [
            {title: 'Search', action: (<Search size={20} />)},
            {title: 'Notifications', action: (<Notification size={20} />)},
            {title: 'User Profile', action: (<User size={20} />)}
        ],
        sideNav: menuLinks.map(link => ({title: link.title, href: link.href}))
    }

  return (
    <div>
        <UIShell prefix="watsonx" navigation={navigation}>
            <Routes>
                {menuLinks.map(link => (
                    <Route path={link.href} element={link.element} />
                ))}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </UIShell>
    </div>
  )
}

export default App
