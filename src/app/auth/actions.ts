'use server';

import { createServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const fullName = String(formData.get('fullName'));
    const supabase = createServerClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    // If email confirmation is enabled, redirect to a waiting page
    return { message: 'Check your email to confirm your account.' };
}

export async function signIn(formData: FormData) {
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const supabase = createServerClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect('/dashboard');
}

export async function signOut() {
    const supabase = createServerClient();
    await supabase.auth.signOut();
    redirect('/');
}
