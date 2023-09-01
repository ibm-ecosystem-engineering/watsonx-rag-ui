
import {atom, Atom} from "jotai";
import {atomWithObservable, loadable} from "jotai/utils";

import {kycCaseManagementApi} from "../services";
import {KycCaseModel} from "../models";

export const kycCaseAtom: Atom<KycCaseModel[]> = atomWithObservable(
    () => kycCaseManagementApi().subscribeToCases(),
    {initialValue: []}
)

const baseSelectedCaseAtom = atom<Promise<KycCaseModel | undefined>>(Promise.resolve(undefined))
export const selectedKycCaseAtom = atom<Promise<KycCaseModel | undefined>>(
    (get) => get(baseSelectedCaseAtom),
    (get, set, caseId: string | KycCaseModel) => {
        if (typeof caseId === 'string') {
            set(baseSelectedCaseAtom, kycCaseManagementApi().getCase(caseId));
        } else {
            set(baseSelectedCaseAtom, Promise.resolve(caseId));
        }
    }
);

export const selectedKycCaseAtomLoadable = loadable(selectedKycCaseAtom);
