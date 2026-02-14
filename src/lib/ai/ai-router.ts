import { generateWithAnthropic } from './anthropic-vision';
import { generateWithOpenAI } from './openai-vision';
import { TemplateAnalysisResult } from '@/types/ai-response';
import { preprocessImage } from '../utils/image-processor';
import { validateTemplateCode } from './validators/template-validator';

export async function generateTemplateCode(
    originalBuffer: Buffer,
    originalMime: string,
    config: any,
    preferredProvider: 'anthropic' | 'openai' = 'anthropic'
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
                console.error('❌ Validation failed (Primary) - Details:', JSON.stringify(validation.errors, null, 2));
                console.error('📝 Failed Code Snippet (Primary):', result.code.substring(0, 500) + '...');
                throw new Error(`Code validation failed: ${validation.errors.join(', ')}`);
            }

            if (validation.warnings.length > 0) {
                console.warn('⚠️ Validation warnings (Primary):', JSON.stringify(validation.warnings, null, 2));
            }

            return result;
        }
        throw new Error(result.error || 'Primary provider failed');

    } catch (primaryError: any) {
        console.error(`❌ ${currentProvider} failed:`, primaryError.message);

        // Fallback zum anderen Provider
        const fallbackProvider = currentProvider === 'anthropic' ? 'openai' : 'anthropic';



        console.log(`🔄 Falling back to ${fallbackProvider}...`);

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
                    console.error('❌ Validation failed (Fallback) - Details:', JSON.stringify(validation.errors, null, 2));
                    console.error('📝 Failed Code Snippet (Fallback):', fallbackResult.code.substring(0, 500) + '...');
                    throw new Error(`Code validation failed: ${validation.errors.join(', ')}`);
                }

                if (validation.warnings.length > 0) {
                    console.warn('⚠️ Validation warnings (Fallback):', JSON.stringify(validation.warnings, null, 2));
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
