'use client';

import { useState } from 'react';

interface OptimizeResponse {
    original: string;
    optimized: string;
    suggestions: string[];
}

interface GenerateDescriptionResponse {
    description: string;
    suggestions: string[];
}

interface GenerateCoverLetterResponse {
    coverLetter: string;
    tips: string[];
}

interface AnalyzeResumeResponse {
    overall_score: number;
    rating: string;
    summary: string;
    categories: Array<{
        category: string;
        score: number;
        issues: Array<{
            type: string;
            severity: 'error' | 'warning' | 'info';
            location: string;
            current: string;
            suggested: string;
            explanation: string;
            example?: string;
            patchPath?: string;
        }>;
    }>;
    top_priorities: string[];
    strengths: string[];
    weaknesses: string[];
    estimated_time_to_fix: string;
}

export function useAI() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const optimizeText = async (
        text: string,
        context?: string
    ): Promise<OptimizeResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, context }),
            });

            if (!response.ok) {
                throw new Error('Failed to optimize text');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const generateDescription = async (
        jobTitle: string,
        company?: string,
        responsibilities?: string
    ): Promise<GenerateDescriptionResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/generate-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobTitle, company, responsibilities }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate description');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const generateCoverLetter = async (params: {
        name: string;
        jobTitle: string;
        experience?: string;
        skills?: string;
        targetPosition?: string;
        targetCompany?: string;
    }): Promise<GenerateCoverLetterResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/generate-cover-letter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                throw new Error('Failed to generate cover letter');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const analyzeResume = async (
        resumeData: any
    ): Promise<AnalyzeResumeResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/analyze-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resumeData }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze resume');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        optimizeText,
        generateDescription,
        generateCoverLetter,
        analyzeResume,
    };
}
