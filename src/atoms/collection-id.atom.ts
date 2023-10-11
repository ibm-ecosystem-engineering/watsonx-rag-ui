import {atom} from "jotai";
import {loadable} from "jotai/utils";

import {CollectionModel, FormOptionModel} from "../models";
import {documentManagementApi, ListCollectionsResult} from "../services";

const baseAtom = atom<Promise<string>>(Promise.resolve(''))

export const collectionIdAtom = atom(
    get => get(baseAtom),
    (_, set, value: string | Promise<string>) => {
        const collectionId = typeof value === 'string' ? Promise.resolve(value) : value

        set(baseAtom, collectionId)
    },
)

export const collectionIdLoadable = loadable(baseAtom)

const resultToFormOptionModels = (result: ListCollectionsResult) => {
    return result.collections.map(collectionToFormOptionModel)
}
const collectionToFormOptionModel = (val: CollectionModel): FormOptionModel => {
    return ({text: val.name, value: val.collectionId})
}
const baseCollectionList = atom<Promise<FormOptionModel[]>>(
    documentManagementApi().listCollections().then(resultToFormOptionModels)
)

export const collectionListAtom = atom(
    get => get(baseCollectionList),
    (_, set, value: string | Promise<CollectionModel[]>) => {
        const collections = typeof value === 'string'
            ? documentManagementApi().listCollections().then(val => val.collections)
            : value

        set(
            baseCollectionList,
            collections.then(result => result
                .map(val => ({text: val.name, value: val.collectionId})))
        )
    }
)

export const collectionListLoadable = loadable(collectionListAtom)
