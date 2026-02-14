import { NextRequest, NextResponse } from 'next/server';
import { anthropic, AI_CONFIG } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
    try {
        const {
            name,
            jobTitle,
            experience,
            skills,
            targetPosition,
            targetCompany
        } = await request.json();

        if (!name || !jobTitle) {
            return NextResponse.json(
                { error: 'Name and job title are required' },
                { status: 400 }
            );
        }

        const systemPrompt = `Du bist ein professioneller Karriereberater und Experte für Bewerbungsschreiben.
Deine Aufgabe ist es, überzeugende und personalisierte Anschreiben zu erstellen.

Regeln:
- Verwende eine professionelle, aber persönliche Ansprache
- Strukturiere das Anschreiben in Einleitung, Hauptteil und Schluss
- Hebe relevante Erfahrungen und Erfolge hervor
- Zeige Begeisterung für die Position und das Unternehmen
- Halte es prägnant (max. 1 Seite)
- Vermeide Standardfloskeln
- Fokussiere auf den Mehrwert für das Unternehmen`;

        const userPrompt = `Erstelle ein professionelles Anschreiben für:

Bewerber: ${name}
Aktuelle Position: ${jobTitle}
${experience ? `Erfahrung: ${experience}` : ''}
${skills ? `Fähigkeiten: ${skills}` : ''}
${targetPosition ? `Zielposition: ${targetPosition}` : ''}
${targetCompany ? `Zielunternehmen: ${targetCompany}` : ''}

Erstelle ein überzeugendes Anschreiben, das die Stärken des Bewerbers hervorhebt und zeigt, warum er/sie perfekt für die Position geeignet ist.`;

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

        const coverLetter = message.content[0].type === 'text'
            ? message.content[0].text
            : '';

        return NextResponse.json({
            coverLetter,
            tips: [
                'Personalisiere das Anschreiben für jede Bewerbung',
                'Recherchiere das Unternehmen und erwähne spezifische Details',
                'Zeige, wie deine Erfahrung dem Unternehmen hilft',
                'Halte es prägnant und fokussiert',
            ],
        });
    } catch (error) {
        console.error('AI Cover Letter Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate cover letter' },
            { status: 500 }
        );
    }
}
