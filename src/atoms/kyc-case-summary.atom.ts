import {atom} from "jotai";
import {loadable} from "jotai/utils";

import {kycCaseSummaryApi} from "../services/kyc-case-summary";
import {KycCaseSummaryModel} from "../models";

const baseAtom = atom<Promise<KycCaseSummaryModel | undefined>>(Promise.resolve(undefined));

export const kycCaseSummaryAtom = atom(
    get => get(baseAtom),
    async (_get, set, name: string) => {
        set(baseAtom, kycCaseSummaryApi().summarize(name).then(summary => ({summary})))
    }
)

export const kycCaseSummaryAtomLoadable = loadable(kycCaseSummaryAtom)
