export interface AdminUser {
    id: string;
    email: string;
    role: 'admin';
}

export type DeploymentStatus = 'idle' | 'uploading' | 'analyzing' | 'generating' | 'deploying' | 'complete' | 'error';

export interface GenerationStatus {
    stage: DeploymentStatus;
    message: string;
    templateId?: string;
    error?: string;
}
