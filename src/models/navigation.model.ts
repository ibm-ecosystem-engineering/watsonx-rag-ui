
export type MenuModel = MenuLinkModel | MenuItemModel

export interface NavigationModel {
    globalBar?: GlobalBarModel[]
    headerNav?: MenuModel[]
    sideNav?: MenuModel[]
}

export interface GlobalBarModel {
    title: string
    action: JSX.Element
}

export const isMenuLinkModel = (item: MenuModel): item is MenuLinkModel => {
    return !!item && !!(item as MenuLinkModel).items
}

export interface MenuLinkModel {
    title: string
    items: MenuModel[]
}

export const isMenuItemModel = (item: MenuModel): item is MenuItemModel => {
    return !!item && !!(item as MenuItemModel).href
}

export interface MenuItemModel {
    title: string
    href: string
    icon?: string
}
