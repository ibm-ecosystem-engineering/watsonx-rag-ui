// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, {ReactNode} from "react";
import {Route, Routes} from "react-router-dom";
import {Notification, Search, User} from "@carbon/icons-react";
import {useAtom} from "jotai";

import './App.css'
import {activeItemAtom} from "./atoms";
import {NotFound, UIShell} from "./components";
import {MenuLinksModel, NavigationModel} from "./models";
import {QueryView} from "./views";

function App() {
    const [activeItem, setActiveItem] = useAtom(activeItemAtom);

    const checkAuth = (element: ReactNode): ReactNode => {
        return element
    }

    const menuLinks: MenuLinksModel[] = [
        {title: 'Query', href: '/', element: <QueryView />},
    ]

    const navigation: NavigationModel = {
        globalBar: [
            {title: 'Search', action: (<Search size={20} />)},
            {title: 'Notifications', action: (<Notification size={20} />)},
            {title: 'User Profile', action: (<User size={20} />)}
        ],
        sideNav: []
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
