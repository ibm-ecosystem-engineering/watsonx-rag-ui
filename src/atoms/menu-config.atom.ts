import {atom} from 'jotai';
import {loadable} from 'jotai/utils';
import {menuConfigApi} from "../config";

export const menuConfigAtom = atom(async () => menuConfigApi().loadConfig())
export const menuConfigAtomLoadable = loadable(menuConfigAtom)
