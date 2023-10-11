import {ApolloClient, gql} from "@apollo/client";

import {GenerateRequest, GenerateResult, GenerativeApi} from "./generative.api";
import {getApolloClient} from "../../backends";

export const GENERATE = gql`
query Generate($input: GenerateInput!) {
    generate(input: $input) {
        generatedText
    }
}
`

export class GenerativeGraphql implements GenerativeApi {
    client: ApolloClient<unknown>;

    constructor() {
        this.client = getApolloClient();
    }

    async generate(params: GenerateRequest): Promise<GenerateResult> {
        const input = Object.assign(
            {},
            params,
            {max_new_tokens: 400}
        )

        return this.client
            .query<{generate: GenerateResult}>({
                query: GENERATE,
                variables: {input}
            })
            .then(result => result.data.generate)
    }
}
