export type TargetAudience = 'jobseeker' | 'student';

export type AIModel = 'claude-3-opus' | 'claude-3-sonnet' | 'gpt-4-turbo';

export interface AIResponse {
    content: string;
    tokens: number;
}
