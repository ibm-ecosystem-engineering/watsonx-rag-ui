import {DataExtractionApi} from "./data-extraction.api";
import {DataExtractionConfig, DataExtractionCsv} from "./data-extraction.csv";
import {DataExtractionResultModel} from "../../models";
import {delay, first} from "../../utils";


export class DataExtractionMock extends DataExtractionCsv implements DataExtractionApi {

    async extractDataForQuestion(_: string, question: {id: string}): Promise<DataExtractionResultModel> {
        return delay(500, () => {
            const config: DataExtractionConfig | undefined = first(this.getCsvData().filter(val => val.id === question.id)).orElse(undefined as any)

            if (!config) {
                throw new Error('Error finding question: ' + question.id)
            }

            console.log('Got config', config)

            return Object.assign({}, config, {watsonxResponse: config.expectedResponse});
        })
    }

}
