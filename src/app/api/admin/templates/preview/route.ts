import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Admin check
        if (!user || user.email?.toLowerCase() !== 'adnan1981@gmx.de') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { templateId, imageData } = await request.json();

        if (!templateId || !imageData) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // Remove the data:image/jpeg;base64, part
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const previewsDir = path.join(process.cwd(), 'public', 'templates', 'previews');

        // Ensure directory exists
        await fs.mkdir(previewsDir, { recursive: true });

        const fileName = `${templateId}.jpg`;
        const filePath = path.join(previewsDir, fileName);

        await fs.writeFile(filePath, buffer);

        const previewPath = `/templates/previews/${fileName}`;

        // 4. Update Database
        const { error: dbError } = await supabase
            .from('admin_templates')
            .update({ preview_image_url: previewPath })
            .eq('template_id', templateId);

        if (dbError) {
            console.error('⚠️ [PreviewAPI] Database update failed:', dbError);
        } else {
            console.log(`✅ [PreviewAPI] Database updated for ${templateId}`);
        }

        console.log(`✅ [PreviewAPI] Preview saved for ${templateId}: ${filePath}`);

        return NextResponse.json({
            success: true,
            path: previewPath
        });

    } catch (error: any) {
        console.error('❌ [PreviewAPI] Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
