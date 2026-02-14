import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FileText, Plus, GraduationCap, Briefcase } from 'lucide-react';
import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ResumeList from '@/components/dashboard/ResumeList';

export const dynamic = 'force-dynamic';

export default async function StudentDashboardPage() {
    const supabase = createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const { data: resumes, error } = await supabase
        .from('student_resumes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });

    const stats = [
        { label: 'Schüler-CVs', value: resumes?.length.toString() || '0', sublabel: 'Gesamt' },
        { label: 'Bewerbungen', value: '0', sublabel: 'Praktika' },
        { label: 'Status', value: 'Starter', sublabel: 'Kostenlos' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-indigo-100 rounded-md">
                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Schüler Dashboard
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Verwalte deine Lebensläufe für Ausbildung, Studium und Praktika.
                    </p>
                </div>
                <Link href="/dashboard/student/editor/new">
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                        <Plus className="w-5 h-5 mr-2" />
                        Neuer Schüler-CV
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, index) => (
                    <Card key={index} variant="default" className="border-l-4 border-l-indigo-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
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
                    tableName="student_resumes"
                    basePath="/dashboard/student/editor"
                />
            </div>

            {/* Mode Switcher */}
            <div className="mt-12 bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-blue-900">Bereit für den ersten Job?</p>
                        <p className="text-sm text-blue-600">Nutze den Profi-Modus für Bewerbungen auf Vollzeitstellen.</p>
                    </div>
                </div>
                <Link href="/dashboard">
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-white bg-blue-50">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Zum Profi-Modus wechseln &rarr;
                    </Button>
                </Link>
            </div>
        </div>
    );
}
