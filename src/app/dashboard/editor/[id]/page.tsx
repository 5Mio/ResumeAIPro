import { createServerClient } from '@/lib/supabase-server';
import Editor from './Editor';
import { redirect } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditorPage({ params }: PageProps) {
    const supabase = createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // If creating new resume, allow "new" ID or uuid
    // If ID is a valid UUID, fetch data
    let resumeData = null;

    if (params.id !== 'new') {
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', params.id)
            .eq('user_id', session.user.id)
            .single();

        if (data && data.content) {
            // Cast the content JSON to our ResumeData type
            resumeData = { ...data.content as any, id: data.id, title: data.title };
        }
    }

    return (
        <Editor
            initialData={resumeData}
            resumeId={params.id}
            userId={session.user.id}
        />
    );
}
