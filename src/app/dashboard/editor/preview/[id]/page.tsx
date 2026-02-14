'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { templates } from '@/templates';
import { ArrowLeft, Monitor, Smartphone, Layout, Info, Camera, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useState, useRef, useEffect, Suspense } from 'react';
import { ResumeData } from '@/types/resume';
import { toJpeg } from 'html-to-image';

// Mock data for preview (same as before)
const mockData: ResumeData = {
    title: 'Modern Preview',
    personal: {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@beispiel.de',
        phone: '+49 123 456789',
        location: 'Berlin, Deutschland',
        address: 'Musterstraße 1, 12345 Berlin',
        title: 'Senior Software Architect',
        summary: 'Erfahrener Full-Stack Entwickler mit Fokus auf skalierbare Cloud-Lösungen und moderne Web-Technologien. Über 10 Jahre Erfahrung in der Leitung von agilen Teams.',
        website: 'www.mustermann.de'
    },
    experience: [
        {
            id: '1',
            company: 'Tech Solutions GmbH',
            title: 'Senior Software Architect',
            startDate: '2020-01',
            endDate: undefined,
            description: 'Leitung der Software-Architektur für Enterprise-Kunden. Einführung von Microservices und CI/CD Pipelines.'
        },
        {
            id: '2',
            company: 'StartUp Innovate',
            title: 'Full Stack Developer',
            startDate: '2016-06',
            endDate: '2019-12',
            description: 'Entwicklung von React-basierten Dashboards und Node.js APIs.'
        }
    ],
    education: [
        {
            id: 'edu1',
            school: 'TU Berlin',
            degree: 'Master of Science Informatik',
            field: 'Software Engineering',
            startDate: '2014-10',
            endDate: '2016-05'
        }
    ],
    skills: ['React', 'Next.js', 'Typescript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Agile'],
    languages: [
        { language: 'Deutsch', level: 'Muttersprache' },
        { language: 'Englisch', level: 'Verhandlungssicher' }
    ],
    design: {
        template: 'modern',
        layout: {
            margins: { top: 20, right: 20, bottom: 20, left: 20 },
            columns: 1,
            columnDistribution: '70/30',
            spacing: { section: 16, item: 8, paragraph: 4 },
        },
        typography: {
            fontFamily: { body: 'Inter', heading: 'Inter' },
            fontSize: { h1: 24, h2: 18, h3: 14, body: 11, small: 9 },
            lineHeight: 1.5,
        },
        colors: {
            primary: '#2563EB',
            text: '#1F2937',
            background: '#FFFFFF',
            accent: '#3B82F6',
        },
    }
};

function PreviewContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const autoCapture = searchParams.get('auto') === 'true';

    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isCapturing, setIsCapturing] = useState(false);
    const [captureStatus, setCaptureStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [showMarketing, setShowMarketing] = useState(false); // Controls visibility for reliable capture
    const containerRef = useRef<HTMLDivElement>(null);
    const marketingRef = useRef<HTMLDivElement>(null);

    const template = templates.find(t => t.id === params.id);

    const handleCapturePreview = async (useMarketing = false) => {
        if (!template) return;

        // Show marketing wrapper temporarily for high-quality capture
        if (useMarketing) setShowMarketing(true);

        setIsCapturing(true);
        setCaptureStatus('idle');

        try {
            // Wait for DOM and component rendering to finish
            await new Promise(resolve => setTimeout(resolve, 3000));

            const target = useMarketing ? marketingRef.current : containerRef.current;
            if (!target) throw new Error('Capture target not found');

            console.log(`📸 Starting capture for ${template.id} (Marketing: ${useMarketing})`);

            const options = useMarketing ? {
                quality: 0.95,
                backgroundColor: '#ffffff',
                width: 1200,
                height: 630,
                pixelRatio: 2, // Higher density for better quality
            } : {
                quality: 0.95,
                backgroundColor: '#ffffff',
                width: 794,
                height: 1123,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            };

            const dataUrl = await toJpeg(target, options);

            if (!dataUrl || dataUrl.length < 2000) {
                throw new Error('Capture produced an empty image');
            }

            const res = await fetch('/api/admin/templates/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId: template.id,
                    imageData: dataUrl
                })
            });

            if (!res.ok) throw new Error('Preview save failed');

            setCaptureStatus('success');
            console.log(`✅ Preview successfully saved for ${template.id}`);
            setTimeout(() => setCaptureStatus('idle'), 3000);
        } catch (error) {
            console.error('❌ Capture error:', error);
            setCaptureStatus('error');
        } finally {
            setIsCapturing(false);
            if (useMarketing) setShowMarketing(false);
        }
    };

    useEffect(() => {
        if (autoCapture && template) {
            console.log('🤖 Auto-capture triggered for:', template.id);
            handleCapturePreview(true);
        }
    }, [autoCapture, template]);

    if (!template) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col p-4">
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center max-w-md">
                    <h1 className="text-xl font-black text-red-600 mb-2 uppercase tracking-tight">Template nicht gefunden</h1>
                    <p className="text-red-500 mb-6 text-sm font-medium">Das Template mit der ID "{params.id}" konnte nicht im System gefunden werden.</p>
                    <Link href="/dashboard/admin/templates">
                        <Button className="bg-red-600 text-white hover:bg-red-700">Zurück zur Übersicht</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const TemplateComponent = template.component;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* Hidden/Visible Marketing Wrapper for high-quality thumbnail capture */}
            <div
                ref={marketingRef}
                className={`fixed ${showMarketing ? 'left-0 top-0 z-[100]' : '-left-[4000px] z-[-10]'} w-[1200px] h-[630px] bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex items-center justify-center p-12 overflow-hidden`}
            >
                <div className="relative transform rotate-1 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden bg-white w-[380px] h-[537px]">
                    <div className="scale-[0.48] origin-top-left w-[794px] h-[1123px]">
                        <TemplateComponent data={mockData} />
                    </div>
                </div>
                {/* Branding elements */}
                <div className="absolute top-12 left-12">
                    <div className="flex items-center gap-3 text-white">
                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div className="font-black text-3xl tracking-tighter italic uppercase">ResumeAI Pro</div>
                    </div>
                </div>
                <div className="absolute bottom-12 right-12 text-white/90 flex flex-col items-end">
                    <div className="text-5xl font-black tracking-tighter uppercase mb-2">PREMIUM TEMPLATE</div>
                    <div className="text-xl font-medium opacity-70 uppercase tracking-[0.3em]">{template.name} EDITION</div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
            </div>

            <header className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/admin/templates">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-50">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Admin
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                            Preview: {template.name}
                            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-widest">{template.category}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <button
                        onClick={() => setViewMode('desktop')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-indigo-600 shadow-indigo-100' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Desktop Vorschau"
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-indigo-600 shadow-indigo-100' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Mobile Vorschau"
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <button
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Informationen"
                    >
                        <Info className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="primary"
                        size="sm"
                        className={`shadow-lg ${captureStatus === 'success' ? 'bg-green-600' : 'bg-indigo-600'} text-white`}
                        onClick={() => handleCapturePreview(true)}
                        disabled={isCapturing}
                    >
                        {isCapturing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : captureStatus === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        {isCapturing ? 'Styling...' : captureStatus === 'success' ? 'Marketing-Preview fertig' : 'Marketing Preview generieren'}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className={`border-gray-200 ${captureStatus === 'success' ? 'text-green-600 border-green-200 bg-green-50' : ''}`}
                        onClick={() => handleCapturePreview(false)}
                        disabled={isCapturing}
                    >
                        {isCapturing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Camera className="w-4 h-4 mr-2" />
                        )}
                        Simple Preview
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-12 flex justify-center bg-gray-100/50">
                <div className={`transition-all duration-700 ease-in-out bg-white shadow-2xl ring-1 ring-black/5 origin-top ${viewMode === 'desktop'
                    ? 'w-[210mm] min-h-[297mm]'
                    : 'w-[375px] min-h-[667px]'
                    }`}>
                    <div
                        ref={containerRef}
                        className="w-full h-full relative p-0 m-0 overflow-hidden transform-gpu"
                    >
                        <TemplateComponent data={mockData} />
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 px-8 py-3 flex items-center justify-between text-[10px] text-gray-400">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live Preview Mode
                    </div>
                    <div className="font-medium">Using Mock Data: "Max Mustermann"</div>
                </div>
                <div className="flex items-center gap-2 font-black uppercase tracking-widest">
                    <span>Target: {template.bestFor.join(', ')}</span>
                </div>
            </footer>
        </div>
    );
}

export default function TemplatePreviewPage() {
    return (
        <Suspense fallback={<div>Lade Vorschau...</div>}>
            <PreviewContent />
        </Suspense>
    );
}
