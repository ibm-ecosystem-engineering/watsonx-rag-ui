
export interface GenerateRequest {
    question: string;
    modelId?: string;
    collectionId?: string;
    min_new_tokens?: number;
    max_new_tokens?: number;
    decoding_method?: string;
    repetition_penalty?: number;
}

export interface GenerateResult {
    question: string;
    generatedText: string;
}

export abstract class GenerativeApi {
    abstract generate(input: GenerateRequest): Promise<GenerateResult>;
}
