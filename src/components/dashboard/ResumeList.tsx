'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FileText, MoreVertical, Download, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

interface Resume {
    id: string;
    title: string;
    updated_at: string;
    content: any;
}

interface ResumeListProps {
    initialResumes: Resume[];
    tableName?: 'resumes' | 'student_resumes';
    basePath?: string; // e.g. /dashboard/editor or /dashboard/student/editor
}

export default function ResumeList({ initialResumes, tableName = 'resumes', basePath = '/dashboard/editor' }: ResumeListProps) {
    const [resumes, setResumes] = useState<Resume[]>(initialResumes);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Möchtest du diesen Lebenslauf wirklich unwiderruflich löschen?')) return;

        try {
            setIsDeleting(id);
            const { error } = await supabase.from(tableName).delete().eq('id', id);

            if (error) throw error;

            setResumes(resumes.filter(r => r.id !== id));
            router.refresh();
        } catch (error) {
            console.error('Error deleting resume:', error);
            alert('Fehler beim Löschen des Lebenslaufs.');
        } finally {
            setIsDeleting(null);
        }
    };

    if (resumes.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Noch keine Lebensläufe</h3>
                <p className="text-gray-500 mb-6">Erstelle deinen ersten professionellen Lebenslauf in Minuten.</p>
                <Link href={`${basePath}/new`}>
                    <Button variant="primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Lebenslauf erstellen
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
                <Card key={resume.id} variant="hover" className="h-full flex flex-col">
                    {/* Preview Area */}
                    <div className="aspect-[210/297] bg-gray-100 rounded-t-lg mb-4 flex items-center justify-center overflow-hidden border-b border-gray-200 relative group">
                        {/* Simple visual representation of a document */}
                        <div className="w-[80%] h-[90%] bg-white shadow-sm flex flex-col p-2 space-y-2 pointer-events-none opacity-50 transition-opacity group-hover:opacity-80">
                            <div className="h-2 w-1/3 bg-gray-300 rounded"></div>
                            <div className="h-1 w-full bg-gray-200 rounded"></div>
                            <div className="h-1 w-full bg-gray-200 rounded"></div>
                            <div className="h-16 w-full bg-gray-100 rounded mt-4"></div>
                            <div className="flex-1"></div>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                            <Link href={`${basePath}/${resume.id}`}>
                                <Button variant="primary" size="sm">Öffnen</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Info Area */}
                    <div className="flex-1 flex flex-col p-2">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">
                                {resume.title}
                            </h3>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 mt-auto">
                            <span>
                                Aktualisiert: {new Date(resume.updated_at).toLocaleDateString('de-DE', {
                                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <Link href={`${basePath}/${resume.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Edit className="w-3 h-3 mr-2" />
                                    Bearbeiten
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(resume.id)}
                                disabled={isDeleting === resume.id}
                            >
                                {isDeleting === resume.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}

            {/* Add New Card */}
            <Link href={`${basePath}/new`} className="h-full">
                <div className="border-2 border-dashed border-gray-300 rounded-xl h-full flex flex-col items-center justify-center p-8 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer min-h-[300px]">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                        <Plus className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Neuer Lebenslauf</h3>
                    <p className="text-sm text-gray-500 text-center mt-2">Erstelle einen neuen Lebenslauf von Grund auf oder nutze eine Vorlage</p>
                </div>
            </Link>
        </div>
    );
}
