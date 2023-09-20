import {menuOptionsApi} from "../services";
import {atom} from "jotai";
import {loadable} from "jotai/utils";

export const countriesAtom = atom(async () => menuOptionsApi().getCountryList())
export const countriesAtomLoadable = loadable(countriesAtom);


export const entityTypesAtom = atom(async () => menuOptionsApi().getEntityTypes())
export const entityTypesAtomLoadable = loadable(entityTypesAtom);

export const industryTypesAtom = atom(async () => menuOptionsApi().getIndustries())
export const industryTypesAtomLoadable = loadable(industryTypesAtom);
