import {atom} from "jotai";
import {loadable} from "jotai/utils";

import {DataExtractionQuestionModel, DataExtractionResultModel} from "../models";
import {dataExtractionApi} from "../services";

export const dataExtractionQuestionAtom = atom<Promise<DataExtractionQuestionModel[]>>(async () => dataExtractionApi().listQuestions())
export const dataExtractionQuestionAtomLoadable = loadable(dataExtractionQuestionAtom)

const baseDataExtractionAtom = atom<Promise<DataExtractionResultModel[]>>(Promise.resolve([]))
export const dataExtractionResultsAtom = atom(
    (get) => get(baseDataExtractionAtom),
    (_get, set, results: Promise<DataExtractionResultModel[]>) => {
        set(baseDataExtractionAtom, results);
    }
)
export const dataExtractionResultsAtomLoadable = loadable(baseDataExtractionAtom)
