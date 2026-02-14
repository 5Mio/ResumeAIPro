import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization pattern to prevent build-time errors
// and allow server startup without API key
let anthropicInstance: Anthropic | null = null;

export const getAnthropicClient = () => {
    if (anthropicInstance) return anthropicInstance;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey || apiKey.includes('your_anthropic_api_key')) {
        throw new Error('ANTHROPIC_API_KEY is not configured in .env.local');
    }

    anthropicInstance = new Anthropic({
        apiKey: apiKey,
    });

    return anthropicInstance;
};

export const AI_CONFIG = {
    model: 'claude-3-5-sonnet-20241022', // Latest Sonnet model
    maxTokens: 4096,
    temperature: 0.7,
};
