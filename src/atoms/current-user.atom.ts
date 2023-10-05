import {atom} from "jotai";
import {atomWithStorage, loadable} from "jotai/utils";
import Cookies from 'js-cookie';

import {UserProfileModel} from "../models";

const cookieStorage = {
    getItem: (key, initialValue) => {
        const value = Cookies.get(key) || initialValue
        console.log('Getting cookie value: ', {key, value})

        return value;
    },
    setItem: (key, value) => {
        console.log('Setting cookie value: ', {key, value})
        console.error(new Error('Setting cookie value'))
        Cookies.set(key, value, {expires: 1})
    },
    removeItem: (key) => {
        console.log('Removing cookie: ', {key})
        Cookies.remove(key)
    }
}

export const accessTokenAtom = atomWithStorage<string>(
    'accessToken',
    '',
    cookieStorage,
)
export const currentUserAtom = atom<Promise<UserProfileModel>>(Promise.resolve(undefined));

export const currentUserAtomLoadable = loadable(currentUserAtom);

export const errorStateAtom = atom<boolean>(false)
export const errorMessageAtom = atom<string>('')

export const loggedInAtom = atom<boolean>(
    get => !!get(accessTokenAtom)
)
