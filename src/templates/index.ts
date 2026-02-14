import { ResumeData } from '@/types/resume';
import Modern from './modern/Modern';
import BlueOcean from './creative/BlueOcean';
import DoubleInn from './professional/DoubleInn';

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
        component: DoubleInn,
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
        component: BlueOcean,
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
        component: Modern,
        pro: true,
        features: ['AI-generiert', 'Vollständig editierbar'],
        bestFor: ['Professionals', 'Karrierewechsler']
    },];
