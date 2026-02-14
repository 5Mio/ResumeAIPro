import { createServerClient } from '@/lib/supabase-server';
import { Database } from '@/types/supabase';
import { cache } from 'react';

type Resume = Database['public']['Tables']['resumes']['Row'];
type InsertResume = Database['public']['Tables']['resumes']['Insert'];
type UpdateResume = Database['public']['Tables']['resumes']['Update'];

// Get all resumes for the current user
export const getResumes = cache(async () => {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching resumes:', error);
        return [];
    }

    return data as Resume[];
});

// Get a single resume by ID
export const getResume = cache(async (id: string) => {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching resume ${id}:`, error);
        return null;
    }

    return data as Resume;
});

// Create a new resume
export const createResume = async (resume: InsertResume) => {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('resumes')
        .insert(resume)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Resume;
};

// Update an existing resume
export const updateResume = async (id: string, resume: UpdateResume) => {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('resumes')
        .update({ ...resume, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Resume;
};

// Delete a resume
export const deleteResume = async (id: string) => {
    const supabase = createServerClient();

    const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
};
