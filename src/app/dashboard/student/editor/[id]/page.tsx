import { createServerClient } from '@/lib/supabase-server';
import StudentEditor from './StudentEditor';
import { redirect } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

export const dynamic = 'force-dynamic';

export default async function StudentEditorPage({ params }: PageProps) {
    const supabase = createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // Load from student_resumes table!
    let resumeData = null;

    if (params.id !== 'new') {
        const { data, error } = await supabase
            .from('student_resumes')
            .select('*')
            .eq('id', params.id)
            .eq('user_id', session.user.id)
            .single();

        if (data && data.content) {
            resumeData = { ...data.content as any, id: data.id, title: data.title };
        }
    }

    return (
        <StudentEditor
            initialData={resumeData}
            resumeId={params.id}
            userId={session.user.id}
        />
    );
}
