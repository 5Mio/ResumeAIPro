import { NextRequest, NextResponse } from 'next/server';
import { anthropic, AI_CONFIG } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
    try {
        const { jobTitle, company, responsibilities } = await request.json();

        if (!jobTitle) {
            return NextResponse.json(
                { error: 'Job title is required' },
                { status: 400 }
            );
        }

        const systemPrompt = `Du bist ein professioneller Karriereberater und Experte für Lebenslauf-Erstellung.
Deine Aufgabe ist es, überzeugende und professionelle Beschreibungen für Berufserfahrungen zu generieren.

Regeln:
- Verwende Bullet Points (•)
- Beginne jeden Punkt mit einem starken Aktionsverb
- Quantifiziere Erfolge wenn möglich
- Fokussiere auf Ergebnisse und Impact
- Halte es prägnant (3-5 Bullet Points)
- Optimiere für ATS (Applicant Tracking Systems)
- Verwende branchenübliche Keywords`;

        const userPrompt = `Erstelle eine professionelle Beschreibung für folgende Position:

Position: ${jobTitle}
${company ? `Unternehmen: ${company}` : ''}
${responsibilities ? `Bisherige Beschreibung: ${responsibilities}` : ''}

Generiere 3-5 überzeugende Bullet Points, die die Verantwortlichkeiten und Erfolge beschreiben.`;

        const message = await anthropic.messages.create({
            model: AI_CONFIG.model,
            max_tokens: AI_CONFIG.maxTokens,
            temperature: 0.8,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: userPrompt,
                },
            ],
        });

        const generatedText = message.content[0].type === 'text'
            ? message.content[0].text
            : '';

        return NextResponse.json({
            description: generatedText,
            suggestions: [
                'Passe die Beschreibung an deine tatsächlichen Erfolge an',
                'Füge spezifische Zahlen und Metriken hinzu',
                'Verwende branchenspezifische Keywords',
            ],
        });
    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate description' },
            { status: 500 }
        );
    }
}
