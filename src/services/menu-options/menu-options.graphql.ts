import {ApolloClient, gql} from "@apollo/client";

import {MenuOptionsApi} from "./menu-options.api";
import {getApolloClient} from "../../backends";
import {FormOptionModel} from "../../models";

const LIST_COUNTRIES = gql`
    query ListCountries {
        listCountries {
            text
            value
        }
    }
`
const LIST_ENTITY_TYPES = gql`
    query ListEntityTypes {
        listEntityTypes {
            text
            value
        }
    }
`
const LIST_INDUSTRY_TYPES = gql`
    query ListIndustryTypes {
        listIndustryTypes {
            text
            value
        }
    }
`

export class MenuOptionsGraphql implements MenuOptionsApi {
    client: ApolloClient<unknown>;

    constructor() {
        this.client = getApolloClient();
    }

    getCountryList(): Promise<FormOptionModel[]> {
        return this.client
            .query<{listCountries: FormOptionModel[]}>({
                query: LIST_COUNTRIES,
            })
            .then(result => result.data.listCountries)
    }

    getEntityTypes(): Promise<FormOptionModel[]> {
        return this.client
            .query<{listEntityTypes: FormOptionModel[]}>({
                query: LIST_ENTITY_TYPES,
            })
            .then(result => result.data.listEntityTypes)
    }

    getIndustries(): Promise<FormOptionModel[]> {
        return this.client
            .query<{listIndustryTypes: FormOptionModel[]}>({
                query: LIST_INDUSTRY_TYPES,
            })
            .then(result => result.data.listIndustryTypes)
    }

}