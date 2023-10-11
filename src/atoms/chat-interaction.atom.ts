import {atom} from "jotai";
import {ChatInteractionModel} from "../models";

const baseAtom = atom<ChatInteractionModel[]>([])

export const chatInteractionAtom = atom(
    get => get(baseAtom),
    (get, set, value: ChatInteractionModel | ChatInteractionModel[]) => {
        if (Array.isArray(value)) {
            set(baseAtom, value)
            return
        }

        const oldValue: ChatInteractionModel[] = get(baseAtom);

        set(baseAtom, oldValue.concat(value))
    }
)
