import {atom} from "jotai";
import {kycCaseAtom} from "./kyc-case-management.atom.ts";
import {KycCaseModel} from "../models";
import {first} from "../utils";

export interface KycCaseStatus {
    group: string;
    value: number;
}

export const kycCaseStatusAtom = atom(
    (get) => {
        return get(kycCaseAtom).reduce((previous: KycCaseStatus[], current: KycCaseModel) => {

            const caseStatus: KycCaseStatus = first(previous.filter(kycCase => kycCase.group === current.status))
                .orElseGet(() => {
                    const newStatus = {
                        group: current.status,
                        value: 0,
                    }

                    previous.push(newStatus)

                    return newStatus;
                })

            caseStatus.value = caseStatus.value + 1;

            return previous;
        }, [])
    }
)
