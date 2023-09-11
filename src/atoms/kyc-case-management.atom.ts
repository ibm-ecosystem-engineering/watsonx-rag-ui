import {atom, Atom} from "jotai";
import {atomWithObservable, loadable} from "jotai/utils";

import {kycCaseManagementApi} from "../services";
import {KycCaseModel} from "../models";

export const kycCaseAtom: Atom<KycCaseModel[]> = atomWithObservable(
    () => kycCaseManagementApi().subscribeToCases(),
    {initialValue: []}
)

const baseSelectedCaseAtom = atom<Promise<KycCaseModel | undefined>>(Promise.resolve(undefined))

type CaseInput = string | KycCaseModel;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const selectedKycCaseAtom = atom<Promise<KycCaseModel | undefined>, CaseInput[]>(
    (get) => get(baseSelectedCaseAtom),
    (_, set, caseId: CaseInput) => {
        const result = (typeof caseId === 'string') ? kycCaseManagementApi().getCase(caseId) : Promise.resolve(caseId);

        set(baseSelectedCaseAtom, result);

        return result;
    }
);

export const selectedKycCaseAtomLoadable = loadable(selectedKycCaseAtom);
