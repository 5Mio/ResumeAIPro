import OpenAI from 'openai';
import { getTemplateAnalysisPrompt } from './prompts/template-analysis-prompt-v2';
import { TemplateAnalysisResult } from '@/types/ai-response';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export async function generateWithOpenAI(
    imageData: Buffer,
    mimeType: string,
    config: any
): Promise<TemplateAnalysisResult> {

    if (mimeType === 'application/pdf') {
        throw new Error('OpenAI Vision does not support PDF files. Please use JPEG, PNG, GIF, or WebP.');
    }

    const startTime = Date.now();
    const base64Image = imageData.toString('base64');
    const prompt = getTemplateAnalysisPrompt(config);

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            max_tokens: 4096,
            temperature: 0.3,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`,
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
        const generatedCode = response.choices[0]?.message?.content || '';

        return {
            success: true,
            provider: 'openai',
            code: cleanCode(generatedCode),
            executionTime,
            rawResponse: response,
        };
    } catch (error: any) {
        return {
            success: false,
            provider: 'openai',
            code: '',
            executionTime: Date.now() - startTime,
            rawResponse: null,
            error: error.message
        };
    }
}

function cleanCode(code: string): string {
    // 1. Suche nach Markdown Code Block
    const codeBlockMatch = code.match(/```(?:tsx|typescript|jsx|js)?\s*([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
        return codeBlockMatch[1].trim();
    }

    // 2. Fallback: Entferne mögliche Markdown-Syntax falls kein vollständiger Block gefunden
    // (z.B. wenn Code am Ende abgeschnitten ist oder nur öffnende Backticks hat)
    let cleaned = code
        .replace(/```tsx\s*/g, '')
        .replace(/```typescript\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

    return cleaned;
}
