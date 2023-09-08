import {atom} from "jotai";
import {loadable} from "jotai/utils";

import {dataExtractionApi, DataExtractionQuestion, DataExtractionResult} from "../services";

export const dataExtractionQuestionAtom = atom<Promise<DataExtractionQuestion[]>>(async () => dataExtractionApi().listQuestions())
export const dataExtractionQuestionAtomLoadable = loadable(dataExtractionQuestionAtom)

const baseDataExtractionAtom = atom<Promise<DataExtractionResult[]>>(Promise.resolve([]))
export const dataExtractionResultsAtom = atom(
    (get) => get(baseDataExtractionAtom),
    (_get, set, results: Promise<DataExtractionResult[]>) => {
        set(baseDataExtractionAtom, results);
    }
)
export const dataExtractionResultsAtomLoadable = loadable(baseDataExtractionAtom)
