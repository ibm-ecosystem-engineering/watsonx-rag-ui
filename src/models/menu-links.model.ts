
export interface MenuLinksModel {
    title: string;
    href: string;
    element: any;
    subMenus?: MenuLinksModel[];
}
