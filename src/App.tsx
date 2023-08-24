import React from "react";
import {Route, Routes} from "react-router-dom";
import {Notification, Search, Switcher} from "@carbon/icons-react";

import './App.css'
import {Dummy, NotFound, UIShell} from "./components";
import {Dashboard} from "./views";
import {NavigationModel} from "./models";

function App() {

    const navigation: NavigationModel = {
        globalBar: [
            {title: 'Search', action: (<Search size={20} />)},
            {title: 'Notifications', action: (<Notification size={20} />)},
            {title: 'App Switcher', action: (<Switcher size={20} />)}
        ],
        sideNav: [
            {title: 'Dashboard', href: '/'},
            {title: 'KYC', href: '/kyc'},
            {title: 'TM Alerts', href: '/tm-alerts'},
            {title: 'Customer Risk', href: '/customer-risk'},
            {title: 'RTC-QC', href: '/rtc-qc'},
            {title: 'Tax - GTM', href: '/tax-gtm'},
            {title: 'Utilities', href: '/utilities'},
        ]
    }

  return (
    <div>
        <UIShell prefix="watsonx" navigation={navigation}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/kyc" element={<Dummy content="KYC" />} />
                <Route path="/tm-alerts" element={<Dummy content="TM Alerts" />} />
                <Route path="/customer-risk" element={<Dummy content="Customer Risk" />} />
                <Route path="/rtc-qc" element={<Dummy content="RTC-QC" />} />
                <Route path="/tax-gtm" element={<Dummy content="Tax-GTM" />} />
                <Route path="/utilities" element={<Dummy content="Utilities" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </UIShell>
    </div>
  )
}

export default App
