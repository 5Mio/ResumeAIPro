import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FileText, Plus, GraduationCap } from 'lucide-react';
import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ResumeList from '@/components/dashboard/ResumeList';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const { data: resumes, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });

    // Mock stats for now (could be real later)
    const stats = [
        { label: 'Lebensläufe', value: resumes?.length.toString() || '0', sublabel: 'Gesamt' },
        { label: 'Bewerbungen', value: '0', sublabel: 'Diesen Monat' }, // Placeholder
        { label: 'Status', value: 'Pro', sublabel: 'Abo aktiv' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Hallo, {session.user.user_metadata?.full_name || 'Nutzer'}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Hier ist deine Übersicht. Was möchtest du heute tun?
                    </p>
                </div>
                <Link href="/dashboard/editor/new">
                    <Button variant="primary" size="lg" className="shadow-lg shadow-blue-200">
                        <Plus className="w-5 h-5 mr-2" />
                        Neuer Lebenslauf
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, index) => (
                    <Card key={index} variant="default" className="border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    {stat.sublabel}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-500" />
                        Deine Dokumente
                    </h2>
                </div>

                <ResumeList
                    initialResumes={resumes || []}
                    tableName="resumes"
                    basePath="/dashboard/editor"
                />
            </div>

            {/* Mode Switcher */}
            <div className="mt-12 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                        <Plus className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <p className="font-bold text-indigo-900">Noch Schüler oder Student?</p>
                        <p className="text-sm text-indigo-600">Nutze unseren speziellen Schüler-Modus für Praktika und Ausbildung.</p>
                    </div>
                </div>
                <Link href="/dashboard/student">
                    <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-700 hover:bg-white bg-indigo-50">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Zum Schüler-Modus wechseln &rarr;
                    </Button>
                </Link>
            </div>
        </div>
    );
}
