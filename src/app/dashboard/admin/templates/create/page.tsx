'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, LayoutTemplate, History } from 'lucide-react';
import Link from 'next/link';

import Button from '@/components/ui/Button';
import TemplateUploader from '@/components/admin/TemplateUploader';
import TemplateConfigForm from '@/components/admin/TemplateConfigForm';
import GenerationStatus from '@/components/admin/GenerationStatus';
import { TemplateConfig } from '@/types/template-generation';
import { GenerationStatus as StatusType } from '@/types/admin';

export default function CreateTemplatePage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [config, setConfig] = useState<TemplateConfig>({
        targetAudience: 'jobseeker',
        category: 'modern',
        name: '',
        description: '',
        pro: false,
        aiProvider: 'anthropic'
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState<StatusType | null>(null);

    const handleGenerate = async () => {
        if (!file || !config.name) {
            alert('Bitte wähle eine Datei und gib einen Namen an.');
            return;
        }

        if (file.type === 'application/pdf' && config.aiProvider === 'openai') {
            alert('OpenAI unterstützt derzeit keine PDFs für die Bildanalyse. Bitte wähle Anthropic oder lade ein Bild (PNG/JPG) hoch.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert('Die Datei ist zu groß (>10MB). Bitte komprimiere das Bild oder wähle eine kleinere Datei.');
            return;
        }

        setIsGenerating(true);
        setStatus({ stage: 'uploading', message: 'Bereite Upload vor...' });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('config', JSON.stringify(config));

        try {
            // Stage changes manually for better UX
            setTimeout(() => setStatus({ stage: 'analyzing', message: 'Claude Vision analysiert das Template...' }), 2000);
            setTimeout(() => setStatus({ stage: 'generating', message: 'React-Code wird geschrieben...' }), 8000);

            const res = await fetch('/api/admin/templates/generate', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Generierung fehlgeschlagen');
            }

            const data = await res.json();

            setStatus({
                stage: 'complete',
                message: `Template "${config.name}" wurde erfolgreich erstellt und deployt!`
            });

            setTimeout(() => {
                router.push('/dashboard/admin/templates');
            }, 3000);

        } catch (error: any) {
            setStatus({
                stage: 'error',
                message: error.message || 'Ein unerwarteter Fehler ist aufgetreten.'
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <header className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/admin/templates">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-50">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Zurück
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">AI Template Generator</h1>
                            <p className="text-[10px] text-indigo-500 uppercase font-black tracking-widest mt-1">Admin Dashboard / New Template</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="border-gray-200 text-gray-600">
                            <History className="w-4 h-4 mr-2" /> Logs
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                            onClick={handleGenerate}
                            disabled={isGenerating || !file || !config.name}
                        >
                            <Sparkles className="w-4 h-4 mr-2" /> {isGenerating ? 'Generiere...' : 'Generierung starten'}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-12 space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                            <LayoutTemplate className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Design Upload</h2>
                            <p className="text-sm text-gray-500 font-medium">Lade eine Vorlage hoch, die die AI nachbauen soll.</p>
                        </div>
                    </div>
                    <TemplateUploader
                        file={file}
                        onFileChange={setFile}
                        disabled={isGenerating}
                    />
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Konfiguration</h2>
                            <p className="text-sm text-gray-500 font-medium">Lege fest, wie das Template registriert werden soll.</p>
                        </div>
                    </div>
                    <TemplateConfigForm
                        config={config}
                        onChange={setConfig}
                        disabled={isGenerating}
                    />
                </section>

                {status && (
                    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <GenerationStatus status={status} />
                    </section>
                )}
            </main>
        </div>
    );
}
