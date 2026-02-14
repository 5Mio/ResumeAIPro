import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, AI_CONFIG } from '@/lib/anthropic';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const ANALYSIS_PROMPT = `Du bist ein hochqualifizierter KI-Resume-Optimierer. Deine Aufgabe ist es, einen Lebenslauf (ResumeData JSON) detailliert zu analysieren und basierend auf der offiziellen "KI-Optimierer Spezifikation" zu bewerten.

### ANALYSE-KATEGORIEN & GEWICHTUNG:
1. **Grammatik & Rechtschreibung** (15%): Prüfe auf Tippfehler, Interpunktion, Zeitformen und Kongruenz.
2. **Formulierung & Stil** (20%): Prüfe auf Aktiv vs. Passiv, starke Verben, Füllwörter und Konsistenz.
3. **Struktur & Format** (10%): Prüfe auf Vollständigkeit der Sektionen, Chronologie und Einrückungen.
4. **ATS-Optimierung** (20%): Prüfe auf Keywords (Hard/Soft Skills), Standard-Sektionsnamen und Formatierung.
5. **Inhaltliche Stärke** (20%): Prüfe auf Achievement-Orientierung (STAR-Methode) und Relevanz.
6. **Quantifizierung** (10%): Prüfe auf Zahlen, Prozente und messbare Erfolge.
7. **Layout & Design** (5%): Prüfe auf Margins (15-25pt), Line-Height (1.4-1.6) und Typografie.

### AUSGABE-FORMAT (STRENGES JSON):
Du MUSST ein valides JSON-Objekt zurückgeben mit folgender Struktur:
{
  "overall_score": number (0-100),
  "rating": "Exzellent" | "Gut" | "OK" | "Verbesserungsbedarf",
  "summary": string (2-3 Sätze Zusammenfassung),
  "categories": [
    {
      "category": string (Name der Kategorie),
      "score": number (0-100),
      "issues": [
        {
          "type": string,
          "severity": "error" | "warning" | "info",
          "location": string (z.B. "Berufserfahrung - Position 1"),
          "current": string (Der problematische Original-Text),
          "suggested": string (Der korrigierte/optimierte Text),
          "explanation": string (Kurze Erklärung),
          "example": string (optionales Beispiel),
          "patchPath": string (JSON-Pfad zum Feld, z.B. "experience.0.description" oder "personal.summary")
        }
      ]
    }
  ],
  "top_priorities": string[] (Die 3 wichtigsten Punkte),
  "strengths": string[] (3 Stärken),
  "weaknesses": string[] (3 Schwächen),
  "estimated_time_to_fix": string (z.B. "30-45 Minuten")
}

### WICHTIGE REGELN:
- Antworte AUSSCHLIESSLICH im JSON-Format.
- Sei streng aber konstruktiv.
- Für ATS-Optimierung: Vergleiche Skills mit gängigen Branchenstandards.
- Für Quantifizierung: Schlage konkrete Zahlen vor, wo sie fehlen könnten.
- Alle Texte in Deutsch.`;

export async function POST(request: NextRequest) {
    try {
        const { resumeData } = await request.json();

        if (!resumeData) {
            return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
        }

        let analysisResult = null;

        // Attempt 1: Anthropic (Claude)
        try {
            if (!process.env.ANTHROPIC_API_KEY) throw new Error('Missing ANTHROPIC_API_KEY');

            const anthropic = getAnthropicClient();
            const message = await anthropic.messages.create({
                model: AI_CONFIG.model,
                max_tokens: 4000,
                temperature: 0.3, // Lower temperature for structured output
                system: ANALYSIS_PROMPT,
                messages: [
                    {
                        role: 'user',
                        content: `Analysiere diesen Lebenslauf nach der Spezifikation:\n\n${JSON.stringify(resumeData, null, 2)}`,
                    },
                ],
            });

            if (message.content[0].type === 'text') {
                analysisResult = JSON.parse(message.content[0].text);
            }
        } catch (anthropicError: any) {
            console.error('Anthropic Analysis Error:', anthropicError.message);

            // Attempt 2: OpenAI Fallback
            if (process.env.OPENAI_API_KEY) {
                console.log('Falling back to OpenAI for analysis...');
                try {
                    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4-turbo-preview",
                        response_format: { type: "json_object" },
                        messages: [
                            { role: "system", content: ANALYSIS_PROMPT },
                            { role: "user", content: `Analysiere diesen Lebenslauf nach der Spezifikation:\n\n${JSON.stringify(resumeData, null, 2)}` }
                        ],
                        temperature: 0.3,
                    });

                    const content = completion.choices[0].message.content;
                    if (content) {
                        analysisResult = JSON.parse(content);
                    }
                } catch (openaiError: any) {
                    console.error('OpenAI Analysis Error:', openaiError.message);
                    throw new Error(`AI Analysis Failed. Anthropic: ${anthropicError.message}. OpenAI: ${openaiError.message}`);
                }
            } else {
                throw anthropicError;
            }
        }

        return NextResponse.json(analysisResult);
    } catch (error: any) {
        console.error('Global Analysis Error:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred during analysis' },
            { status: 500 }
        );
    }
}
