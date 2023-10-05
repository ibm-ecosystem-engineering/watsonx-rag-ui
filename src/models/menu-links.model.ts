import {ReactNode} from "react";

export interface MenuLinksModel {
    title: string;
    href: string;
    element: ReactNode;
    skipAuth?: boolean;
    excludeFromMenu?: boolean;
    subMenus?: MenuLinksModel[];
}
