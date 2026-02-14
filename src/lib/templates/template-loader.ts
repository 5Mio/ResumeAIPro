import { templates } from '@/templates';
import { TemplateConfig } from '@/templates';

export class TemplateLoader {
    static getJobseekerTemplates(): TemplateConfig[] {
        return templates.filter(t => {
            // In a real scenario, we would filter by target_audience metadata
            // For now, let's assume all templates in central registry are available
            return true;
        });
    }

    static getStudentTemplates(): TemplateConfig[] {
        return templates.filter(t => {
            return true;
        });
    }

    static getTemplateById(id: string): TemplateConfig | undefined {
        return templates.find(t => t.id === id);
    }

    static getTemplatesByCategory(category: string): TemplateConfig[] {
        return templates.filter(t => t.category === category);
    }
}
