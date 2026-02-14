export interface TemplateConfig {
    targetAudience: 'jobseeker' | 'student';
    category: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional';
    name: string;
    description: string;
    pro: boolean;
    aiProvider: 'anthropic' | 'openai';
}

export interface TemplateDeploymentResult {
    success: boolean;
    templateId?: string;
    componentName?: string;
    componentPath?: string;
    previewUrl?: string;
    executionTime?: number;
    aiProvider?: string;
    error?: string;
}
