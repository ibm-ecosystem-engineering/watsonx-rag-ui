import {atom} from "jotai";
import {UserProfileModel} from "../models";
import {loadable} from "jotai/utils";

export const currentUserAtom = atom<Promise<UserProfileModel>>(Promise.resolve(undefined));

export const currentUserAtomLoadable = loadable(currentUserAtom);
