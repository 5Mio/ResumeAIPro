import { generateWithAnthropic } from './anthropic-vision';
import { generateWithOpenAI } from './openai-vision';
import { TemplateAnalysisResult } from '@/types/ai-response';
import { preprocessImage } from '../utils/image-processor';
import { formatValidationResult, validateTemplateCode } from './validators/template-validator';

export async function generateTemplateCode(
    originalBuffer: Buffer,
    originalMime: string,
    config: any,
    preferredProvider: 'anthropic' | 'openai' = 'openai'
): Promise<TemplateAnalysisResult> {

    console.log(`🤖 Starting AI generation with ${preferredProvider}...`);

    // 1. Image Preprocessing (Resize & Compress)
    const { buffer: imageData, mimeType } = await preprocessImage(originalBuffer, originalMime);

    // 2. Validate MIME Type (PDF disabled for now)
    if (mimeType === 'application/pdf') {
        throw new Error('PDF inputs are currently not supported. Please use JPEG, PNG, or WebP.');
    }

    let currentProvider = preferredProvider;

    try {
        // Primärer Provider
        let result: TemplateAnalysisResult;
        if (currentProvider === 'anthropic') {
            result = await generateWithAnthropic(imageData, mimeType, config);
        } else {
            result = await generateWithOpenAI(imageData, mimeType, config);
        }


        if (result.success) {
            // ✅ NEU: Validierung vor Return
            const validation = validateTemplateCode(result.code);

            if (!validation.valid) {
                console.error(`❌ ${currentProvider} code validation failed:`, validation.errors);
                throw new Error(`Code validation failed: ${validation.errors.join(', ')} | Snippet: ${result.code.substring(0, 50)}....`);
            }

            if (validation.warnings.length > 0) {
                console.warn(`⚠️ ${currentProvider} validation warnings:`, validation.warnings);
            }

            console.log(`✅ ${currentProvider} validation passed with score: ${validation.score}/100`);

            return result;
        }
        throw new Error(result.error || 'Primary provider failed');

    } catch (primaryError: any) {
        console.error(`❌ ${currentProvider} failed:`, primaryError.message);

        // Fallback zum anderen Provider
        const fallbackProvider = currentProvider === 'anthropic' ? 'openai' : 'anthropic';



        console.error(`🔄 Falling back to ${fallbackProvider}...`);

        try {
            let fallbackResult: TemplateAnalysisResult;
            if (fallbackProvider === 'anthropic') {
                fallbackResult = await generateWithAnthropic(imageData, mimeType, config);
            } else {
                fallbackResult = await generateWithOpenAI(imageData, mimeType, config);
            }


            if (fallbackResult.success) {
                // ✅ NEU: Validierung auch für Fallback
                const validation = validateTemplateCode(fallbackResult.code);

                if (!validation.valid) {
                    console.error(`❌ ${fallbackProvider} (fallback) validation failed:`, validation.errors);
                    throw new Error(`Code validation failed: ${validation.errors.join(', ')} | Snippet: ${fallbackResult.code.substring(0, 50)}....`);
                }

                console.log(`✅ ${fallbackProvider} (fallback) validation passed with score: ${validation.score}/100`);

                if (validation.warnings.length > 0) {
                    console.warn(`⚠️ ${fallbackProvider} validation warnings:`, validation.warnings);
                }

                return fallbackResult;
            }
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
