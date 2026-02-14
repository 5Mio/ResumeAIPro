import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { generateTemplateCode } from '@/lib/ai/ai-router';
import { TemplateFileManager } from '@/lib/template-generator/file-manager';
import { TemplateDatabaseManager } from '@/lib/database/template-db';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // 2 minutes for full generation

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    let uploadConfig: any = null;

    // Admin check logic moved inside try, but we need to parse FormData safely.
    // However, NextRequest.formData() can fail if body is invalid.
    // We will follow the user's specific request to parse config early.

    let config: any = null;
    let file: File | null = null;
    let buffer: Buffer | null = null;

    // 1. Parse FormData first (as requested)
    try {
        const formData = await request.formData();
        file = formData.get('file') as File;
        const configJson = formData.get('config') as string;

        if (!file || !configJson) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        config = JSON.parse(configJson);
        uploadConfig = config;

        // Sanitize Input
        config.name = config.name.replace(/[^a-zA-Z0-9\s-]/g, '').trim();

        buffer = Buffer.from(await file.arrayBuffer());

    } catch (e: any) {
        console.error('❌ Parse Error:', e);
        return NextResponse.json({ error: 'Invalid FormData or JSON' }, { status: 400 });
    }

    if (!config || typeof config.name !== 'string') {
        console.error('❌ Invalid Config:', config);
        return NextResponse.json({ error: 'Invalid configuration: Name is required' }, { status: 400 });
    }

    try {
        const supabase = createServerClient();
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();

        console.log('👤 Auth Check:', {
            hasSession: !!session,
            hasUser: !!user,
            email: user?.email,
            adminEmail: 'adnan1981@gmx.de'
        });

        // Admin check
        if (!user || user.email?.toLowerCase() !== 'adnan1981@gmx.de') {
            console.error('❌ Unauthorized access attempt:', user?.email || 'Guest');
            return NextResponse.json({
                error: 'Unauthorized',
                debug: `Logged in as: ${user?.email || 'Guest'}`,
                session: !!session
            }, { status: 403 });
        }

        if (!file) {
            throw new Error('File object is null after FormData parsing');
        }

        // Validate File Size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({
                error: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB`
            }, { status: 400 });
        }

        // 1. AI Analysis & Generation
        console.log('🤖 Starting AI generation...');
        if (!buffer) {
            throw new Error('Buffer is null');
        }

        const aiResult = await generateTemplateCode(buffer, file.type, config);

        if (!aiResult.success) {
            console.error('❌ AI Generation failed:', aiResult.error);
            // Check if error is validation related to customize status code? 
            // For now keep it as 500 or let it fall to catch block
            throw new Error(aiResult.error || 'AI Generation failed');
        }
        console.log('✅ AI generation complete, code length:', aiResult.code?.length);

        if (config.previewOnly) {
            console.log('👀 Preview mode: Returning code without deployment');
            return NextResponse.json({
                success: true,
                previewOnly: true,
                code: aiResult.code,
                executionTime: aiResult.executionTime
            });
        }

        // 2. File Deployment
        console.log('📂 Deploying files...');
        const fileManager = new TemplateFileManager();
        const deployResult = await fileManager.deployTemplate(aiResult.code, config);
        if (!deployResult.success) {
            console.error('❌ File deployment failed:', deployResult.error);
            throw new Error(deployResult.error || 'File deployment failed');
        }
        console.log('✅ File deployment complete');

        // 3. Database Entry
        console.log('💾 Saving to database...');
        const dbManager = new TemplateDatabaseManager();
        const templateId = toKebabCase(config.name);

        const dbId = await dbManager.createTemplate({
            name: config.name,
            description: config.description || 'AI-generiertes Template',
            template_id: templateId,
            category: config.category,
            target_audience: config.targetAudience,
            ai_provider: aiResult.provider,
            generation_time_ms: aiResult.executionTime,
            component_path: deployResult.componentPath || '',
            component_code: aiResult.code,
            component_name: toPascalCase(config.name),
            status: 'active',
            is_pro: config.pro,
            created_by: user!.id
        });
        console.log('✅ Template saved to DB:', dbId);

        await dbManager.logGeneration({
            template_id: dbId,
            ai_provider: aiResult.provider,
            success: true,
            execution_time_ms: aiResult.executionTime,
            created_by: user!.id
        });

        return NextResponse.json({
            success: true,
            templateId,
            dbId,
            previewUrl: `/dashboard/editor/preview/${templateId}?auto=true`,
            executionTime: Date.now() - startTime
        });

    } catch (error: any) {
        console.error('❌ Generation API error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
            details: error
        }, { status: 500 });
    }
}

function toPascalCase(str: string): string {
    return str
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[a-z]/, (chr) => chr.toUpperCase());
}

function toKebabCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
