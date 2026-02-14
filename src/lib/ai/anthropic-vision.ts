import Anthropic from '@anthropic-ai/sdk';
import { getTemplateAnalysisPrompt } from './prompts/template-analysis-prompt';
import { TemplateAnalysisResult } from '@/types/ai-response';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateWithAnthropic(
    imageData: Buffer,
    mimeType: string,
    config: any
): Promise<TemplateAnalysisResult> {

    if (mimeType === 'application/pdf') {
        throw new Error('Anthropic Vision does not support PDF files. Please use JPEG, PNG, GIF, or WebP.');
    }

    const startTime = Date.now();
    const base64Image = imageData.toString('base64');
    const prompt = getTemplateAnalysisPrompt(config);

    try {
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            temperature: 0.3,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: mimeType as any,
                                data: base64Image,
                            },
                        },
                        {
                            type: 'text',
                            text: prompt,
                        },
                    ],
                },
            ],
        });

        const executionTime = Date.now() - startTime;

        // Defensive parsing
        if (!message.content || message.content.length === 0) {
            throw new Error('Empty response from Anthropic API');
        }

        let generatedCode = '';
        const textContent = message.content.find(c => c.type === 'text');

        if (!textContent || !('text' in textContent)) {
            throw new Error('Invalid response format: No text content found');
        }

        generatedCode = textContent.text;

        return {
            success: true,
            provider: 'anthropic',
            code: cleanCode(generatedCode),
            executionTime,
            rawResponse: message,
        };
    } catch (error: any) {
        return {
            success: false,
            provider: 'anthropic',
            code: '',
            executionTime: Date.now() - startTime,
            rawResponse: null,
            error: error.message
        };
    }
}

function cleanCode(code: string): string {
    return code
        .replace(/```tsx\n/g, '')
        .replace(/```typescript\n/g, '')
        .replace(/```\n/g, '')
        .replace(/```$/g, '')
        .trim();
}
