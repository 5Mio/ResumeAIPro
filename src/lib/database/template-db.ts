import { createServerClient } from '@/lib/supabase-server';

export interface TemplateMetadata {
    id?: string;
    name: string;
    description: string;
    template_id: string;
    category: string;
    target_audience: string;
    source_file_url?: string;
    ai_provider: string;
    generation_time_ms?: number;
    component_path: string;
    component_code: string;
    component_name: string;
    preview_image_url?: string;
    status: 'draft' | 'active' | 'archived' | 'error';
    is_pro: boolean;
    created_by: string;
}

export class TemplateDatabaseManager {
    async createTemplate(metadata: TemplateMetadata): Promise<string> {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('admin_templates')
            .insert({
                name: metadata.name,
                description: metadata.description,
                template_id: metadata.template_id,
                category: metadata.category,
                target_audience: metadata.target_audience,
                source_file_url: metadata.source_file_url,
                ai_provider: metadata.ai_provider,
                generation_time_ms: metadata.generation_time_ms,
                component_path: metadata.component_path,
                component_code: metadata.component_code,
                component_name: metadata.component_name,
                preview_image_url: metadata.preview_image_url,
                status: metadata.status,
                is_pro: metadata.is_pro,
                created_by: metadata.created_by,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Database insertion failed:', error);
            throw new Error(`Failed to create template: ${error.message}`);
        }

        return data.id;
    }

    async logGeneration(log: {
        template_id?: string;
        ai_provider: string;
        success: boolean;
        error_message?: string;
        execution_time_ms?: number;
        created_by: string;
    }): Promise<void> {
        const supabase = createServerClient();
        await supabase.from('template_generation_logs').insert(log);
    }
}
