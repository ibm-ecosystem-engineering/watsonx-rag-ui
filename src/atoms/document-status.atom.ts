import {atom} from "jotai";
import {DocumentStatusModel} from "../models";

export const documentStatusAtom = atom<DocumentStatusModel[]>([]);
