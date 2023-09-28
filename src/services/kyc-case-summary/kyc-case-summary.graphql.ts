import {ApolloClient, gql} from "@apollo/client";

import {KycCaseSummaryApi} from "./kyc-case-summary.api.ts";
import {getApolloClient} from "../../backends";

const SUMMARIZE = gql`
    query Summarize($name:String!) {
        summarize(name:$name) {
            result
        }
    }
`

export class KycCaseSummaryGraphql implements KycCaseSummaryApi {
    client: ApolloClient<unknown>;

    constructor() {
        this.client = getApolloClient();
    }

    summarize(name: string): Promise<string> {
        return this.client
            .query<{summarize: {result: string}}>({
                query: SUMMARIZE,
                variables: {name},
            })
            .then(result => result.data.summarize.result)
            .catch(() => {
                return '[Error]'
            }) as Promise<string>
    }

}