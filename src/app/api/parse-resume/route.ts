import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/anthropic';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        console.error('DEBUG: Received POST request to parse-resume');

        let formData;
        try {
            formData = await request.formData();
        } catch (err) {
            console.error('DEBUG: Failed to parse formData:', err);
            return NextResponse.json({ error: 'Failed to read file data', details: String(err) }, { status: 400 });
        }

        const file = formData.get('file') as File;

        if (!file) {
            console.error('DEBUG: No file found in formData');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }
        console.error(`DEBUG: File received: ${file.name}, size: ${file.size}, type: ${file.type}`);

        let buffer;
        try {
            const arrayBuffer = await file.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
        } catch (err) {
            console.error('DEBUG: Failed to create buffer:', err);
            return NextResponse.json({ error: 'Failed to process file', details: String(err) }, { status: 500 });
        }

        let text = '';
        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        // ---------------------------------------------------------
        // 1. Text Extraction (PDF / DOCX)
        // ---------------------------------------------------------
        if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            try {
                console.error('DEBUG: Processing as PDF...');
                // @ts-ignore
                const pdfParseModule = require('pdf-parse');
                const parseFunc = pdfParseModule.default || pdfParseModule;
                const data = await parseFunc(buffer);

                if (!data || !data.text) throw new Error('PDF parsing returned no text');
                text = data.text;
                console.error(`DEBUG: PDF parsed successfully. Length: ${text.length}`);
            } catch (error) {
                console.error('DEBUG: PDF Parse Error:', error);
                return NextResponse.json({ error: 'Failed to parse PDF content', details: String(error) }, { status: 500 });
            }
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileName.endsWith('.docx')
        ) {
            try {
                console.error('DEBUG: Processing as DOCX...');
                // @ts-ignore
                const mammoth = require('mammoth');
                const result = await mammoth.extractRawText({ buffer: buffer });
                text = result.value;
                if (!text) throw new Error('DOCX parsing returned no text');
                console.error(`DEBUG: DOCX parsed successfully. Length: ${text.length}`);
            } catch (error) {
                console.error('DEBUG: DOCX Parse Error:', error);
                return NextResponse.json({ error: 'Failed to parse DOCX content', details: String(error) }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: 'Unsupported file type. Please upload PDF or DOCX file.' }, { status: 400 });
        }

        // Clean text
        text = text.replace(/\s+/g, ' ').trim().slice(0, 30000);

        // ---------------------------------------------------------
        // 2. AI Analysis (Anthropic with OpenAI Fallback)
        // ---------------------------------------------------------

        const systemPrompt = `You are a Resume Parser AI. Your task is to extract structured data from the resume text provided.
You must return ONLY a valid JSON object matching this TypeScript interface, with no markdown formatting or explanations:

interface ResumeData {
    personal: {
        firstName: string; 
        lastName: string;
        title: string; 
        email: string;
        phone: string;
        location: string;
        summary: string; 
    };
    experience: Array<{
        title: string;
        company: string;
        startDate: string; 
        endDate: string; 
        description: string; 
    }>;
    education: Array<{
        degree: string;
        field: string;
        school: string;
        startDate: string;
        endDate: string;
    }>;
    skills: string[]; 
    languages: Array<{
        language: string;
        level: string; 
    }>;
}

If a field is missing, use empty strings or empty arrays. Do not invent data. Estimate Start/End dates if only years are given.`;

        let jsonString = '{}';

        // Attempt 1: Anthropic (Claude)
        try {
            console.error('DEBUG: Attempting AI analysis with Anthropic (Claude)...');

            if (!process.env.ANTHROPIC_API_KEY) throw new Error('Missing ANTHROPIC_API_KEY');

            const anthropic = getAnthropicClient();
            const message = await anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4096,
                temperature: 0,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: `Here is the resume text to parse:\n\n${text}` },
                ],
            });

            jsonString = message.content[0].type === 'text' ? message.content[0].text : '{}';
            console.error('DEBUG: Anthropic success.');

        } catch (anthropicError: any) {
            console.error('WARN: Anthropic failed:', anthropicError.message);

            // Attempt 2: OpenAI Fallback
            if (process.env.OPENAI_API_KEY) {
                console.error('DEBUG: Falling back to OpenAI...');
                try {
                    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4-turbo-preview",
                        messages: [
                            { role: "system", content: systemPrompt + " Return strictly JSON." },
                            { role: "user", content: `Here is the resume text to parse:\n\n${text}` }
                        ],
                        response_format: { type: "json_object" },
                        temperature: 0,
                    });

                    jsonString = completion.choices[0].message.content || '{}';
                    console.error('DEBUG: OpenAI Success.');
                } catch (openaiError: any) {
                    console.error('CRITICAL: OpenAI Fallback also failed:', openaiError.message);
                    throw new Error(`AI Parsing Failed. Anthropic: ${anthropicError.message}. OpenAI: ${openaiError.message}`);
                }
            } else {
                console.error('CRITICAL: No OpenAI Key for fallback.');
                throw anthropicError; // No fallback possible
            }
        }

        // ---------------------------------------------------------
        // 3. Response Parsing
        // ---------------------------------------------------------
        try {
            const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedData = JSON.parse(cleanJson);
            return NextResponse.json({ data: parsedData });
        } catch (e) {
            console.error('JSON Parse Error from AI response:', e);
            console.log('Raw output:', jsonString);
            return NextResponse.json({ error: 'Failed to structure resume data' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('General Import Error:', error);
        return NextResponse.json({ error: error.message || 'Server error', stack: error.stack }, { status: 500 });
    }
}
