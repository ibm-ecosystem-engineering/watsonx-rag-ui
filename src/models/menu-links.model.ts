
export interface MenuLinksModel {
    title: string;
    href: string;
    element: any;
    excludeFromMenu?: boolean;
    subMenus?: MenuLinksModel[];
}
