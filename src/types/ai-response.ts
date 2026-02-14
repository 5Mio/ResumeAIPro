export interface TemplateAnalysisResult {
    success: boolean;
    provider: 'anthropic' | 'openai';
    code: string;
    executionTime: number;
    rawResponse: any;
    error?: string;
}
