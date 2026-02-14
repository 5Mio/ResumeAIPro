import { generateWithAnthropic } from './anthropic-vision';
import { generateWithOpenAI } from './openai-vision';
import { TemplateAnalysisResult } from '@/types/ai-response';
import { preprocessImage } from '../utils/image-processor';

export async function generateTemplateCode(
    originalBuffer: Buffer,
    originalMime: string,
    config: any,
    preferredProvider: 'anthropic' | 'openai' = 'anthropic'
): Promise<TemplateAnalysisResult> {

    console.log(`🤖 Starting AI generation with ${preferredProvider}...`);

    // 1. Image Preprocessing (Resize & Compress)
    const { buffer: imageData, mimeType } = await preprocessImage(originalBuffer, originalMime);

    // 2. Logic to handle PDF for OpenAI
    let currentProvider = preferredProvider;
    if (mimeType === 'application/pdf' && preferredProvider === 'openai') {
        console.log('⚠️ OpenAI does not support PDF vision directly. Switching to Anthropic.');
        currentProvider = 'anthropic';
    }

    try {
        // Primärer Provider
        let result: TemplateAnalysisResult;
        if (currentProvider === 'anthropic') {
            result = await generateWithAnthropic(imageData, mimeType, config);
        } else {
            result = await generateWithOpenAI(imageData, mimeType, config);
        }

        if (result.success) return result;
        throw new Error(result.error || 'Primary provider failed');

    } catch (primaryError: any) {
        console.error(`❌ ${currentProvider} failed:`, primaryError.message);

        // Fallback zum anderen Provider
        const fallbackProvider = currentProvider === 'anthropic' ? 'openai' : 'anthropic';

        // PDF Check für Fallback
        if (mimeType === 'application/pdf' && fallbackProvider === 'openai') {
            return {
                success: false,
                provider: currentProvider,
                code: '',
                executionTime: 0,
                rawResponse: null,
                error: `Anthropic failed and OpenAI does not support PDFs. Error: ${primaryError.message}`
            };
        }

        console.log(`🔄 Falling back to ${fallbackProvider}...`);

        try {
            let fallbackResult: TemplateAnalysisResult;
            if (fallbackProvider === 'anthropic') {
                fallbackResult = await generateWithAnthropic(imageData, mimeType, config);
            } else {
                fallbackResult = await generateWithOpenAI(imageData, mimeType, config);
            }

            if (fallbackResult.success) return fallbackResult;
            throw new Error(fallbackResult.error || 'Fallback provider failed');

        } catch (fallbackError: any) {
            console.error(`❌ ${fallbackProvider} also failed:`, fallbackError.message);
            return {
                success: false,
                provider: currentProvider,
                code: '',
                executionTime: 0,
                rawResponse: null,
                error: `Both AI providers failed. ${currentProvider}: ${primaryError.message}, ${fallbackProvider}: ${fallbackError.message}`
            };
        }
    }
}
