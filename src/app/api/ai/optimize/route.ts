import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, AI_CONFIG } from '@/lib/anthropic';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { text, context } = await request.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Text is required and must be a string' },
                { status: 400 }
            );
        }

        const systemPrompt = `Du bist ein professioneller Karriereberater und Experte für Lebenslauf-Optimierung. 
Deine Aufgabe ist es, Texte für Lebensläufe zu verbessern und zu optimieren.

Kontext: ${context || 'Allgemeine Lebenslauf-Optimierung'}

Regeln:
- Verwende aktive Verben und kraftvolle Formulierungen
- Quantifiziere Erfolge wenn möglich (z.B. "Steigerung um 30%")
- Halte es prägnant und professionell
- Vermeide Füllwörter und Floskeln
- Fokussiere auf messbare Ergebnisse und Erfolge
- Verwende Bullet Points für bessere Lesbarkeit
- Optimiere für ATS (Applicant Tracking Systems)`;

        let optimizedText = '';

        // Attempt 1: Anthropic (Claude)
        try {
            if (!process.env.ANTHROPIC_API_KEY) throw new Error('Missing ANTHROPIC_API_KEY');

            const anthropic = getAnthropicClient();
            const message = await anthropic.messages.create({
                model: AI_CONFIG.model,
                max_tokens: AI_CONFIG.maxTokens,
                temperature: AI_CONFIG.temperature,
                system: systemPrompt,
                messages: [
                    {
                        role: 'user',
                        content: `Optimiere folgenden Text für einen Lebenslauf:\n\n${text}\n\nGib nur den optimierten Text zurück, ohne zusätzliche Erklärungen.`,
                    },
                ],
            });

            optimizedText = message.content[0].type === 'text'
                ? message.content[0].text
                : '';

        } catch (anthropicError: any) {
            console.error('Anthropic Optimization Error:', anthropicError.message);

            // Attempt 2: OpenAI Fallback
            if (process.env.OPENAI_API_KEY) {
                console.log('Falling back to OpenAI for optimization...');
                try {
                    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4-turbo-preview",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: `Optimiere folgenden Text für einen Lebenslauf:\n\n${text}\n\nGib nur den optimierten Text zurück, ohne zusätzliche Erklärungen.` }
                        ],
                        temperature: AI_CONFIG.temperature || 0.7,
                    });

                    optimizedText = completion.choices[0].message.content || '';
                } catch (openaiError: any) {
                    console.error('OpenAI Optimization Error:', openaiError.message);
                    throw new Error(`AI Optimization Failed. Anthropic: ${anthropicError.message}. OpenAI: ${openaiError.message}`);
                }
            } else {
                throw anthropicError; // No fallback
            }
        }

        return NextResponse.json({
            original: text,
            optimized: optimizedText,
            suggestions: [
                'Verwende mehr aktive Verben',
                'Quantifiziere deine Erfolge',
                'Fokussiere auf messbare Ergebnisse',
            ],
        });
    } catch (error: any) {
        console.error('AI Optimization Global Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to optimize text' },
            { status: 500 }
        );
    }
}
