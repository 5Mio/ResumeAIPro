import { ResumeData } from '@/types/resume';
import ModernProfessional from './modern/ModernProfessional';
import CreativeBold from './creative/CreativeBold';
import ClassicMinimal from './classic/ClassicMinimal';

export interface TemplateConfig {
    id: string;
    name: string;
    description: string;
    category: string;
    preview: string;
    component: React.ComponentType<{ data: ResumeData }>;
    pro: boolean;
    features: string[];
    bestFor: string[];
}

export const templates: TemplateConfig[] = [
    {
        id: 'double-inn',
        name: 'Double Inn',
        description: 'AI-generiertes Template',
        category: 'professional',
        preview: '/templates/previews/double-inn.jpg',
        component: ClassicMinimal,
        pro: false,
        features: ['AI-generiert', 'Vollständig editierbar'],
        bestFor: ['Professionals', 'Karrierewechsler']
    },
    {
        id: 'blue-ocean',
        name: 'Blue Ocean',
        description: 'AI-generiertes Template',
        category: 'creative',
        preview: '/templates/previews/blue-ocean.jpg',
        component: CreativeBold,
        pro: true,
        features: ['AI-generiert', 'Vollständig editierbar'],
        bestFor: ['Schüler', 'Studenten']
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'AI-generiertes Template',
        category: 'modern',
        preview: '/templates/previews/modern.jpg',
        component: ModernProfessional,
        pro: true,
        features: ['AI-generiert', 'Vollständig editierbar'],
        bestFor: ['Professionals', 'Karrierewechsler']
    },
];
