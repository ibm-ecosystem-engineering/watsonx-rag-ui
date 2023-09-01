import {menuOptionsApi} from "../services";
import {atom} from "jotai";
import {loadable} from "jotai/utils";

export const countriesAtom = atom(async () => menuOptionsApi().getCountryList())
export const countriesAtomLoadable = loadable(countriesAtom);
