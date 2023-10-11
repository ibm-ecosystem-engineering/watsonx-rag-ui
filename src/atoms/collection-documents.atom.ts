import {atom} from "jotai";
import {documentManagementApi, DocumentMetadata} from "../services";
import {loadable} from "jotai/utils";

const baseAtom = atom<Promise<DocumentMetadata[]>>(Promise.resolve([]))

export const collectionDocumentsAtom = atom(
    get => get(baseAtom),
    (_, set, value: string | Promise<DocumentMetadata[]>) => {
        const docs = typeof value === 'string'
            ? documentManagementApi().listDocuments({collectionId: value}).then(result => result.documents)
            : value;

        set(baseAtom, docs)
    }
)

export const collectionDocumentsLoadable = loadable(collectionDocumentsAtom)
