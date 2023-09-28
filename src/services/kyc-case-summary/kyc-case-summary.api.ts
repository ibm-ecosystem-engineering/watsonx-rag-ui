
export abstract class KycCaseSummaryApi {
    abstract summarize(name: string): Promise<string>;
}
