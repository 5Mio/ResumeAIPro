'use client';

import { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
    Save,
    Download,
    Sparkles,
    ArrowLeft,
    Loader2,
    Upload,
    Palette,
    LayoutTemplate
} from 'lucide-react';
import Link from 'next/link';
import ResumePreview from '@/components/resume/ResumePreview';
import AnalysisModal from '@/components/resume/AnalysisModal';
import { generatePDF } from '@/lib/pdf-service';
import { useAI } from '@/hooks/useAI';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { ResumeData, defaultResumeData, defaultResumeDesign } from '@/types/resume';
import { TemplateLoader } from '@/lib/templates/template-loader';

const SECTIONS = [
    { id: 'personal', label: 'Persönliche Daten' },
    { id: 'experience', label: 'Berufserfahrung' },
    { id: 'education', label: 'Bildung' },
    { id: 'skills', label: 'Fähigkeiten' },
    { id: 'languages', label: 'Sprachen' },
    { id: 'design', label: 'Design & Layout' }
];

export default function Editor({ initialData, resumeId, userId }: { initialData: any, resumeId: string, userId: string }) {
    const router = useRouter();
    const supabase = createClient();

    const [activeSection, setActiveSection] = useState('personal');
    const [resumeData, setResumeData] = useState<ResumeData>(initialData || defaultResumeData);
    const [isExporting, setIsExporting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { analyzeResume, loading: aiLoading } = useAI();

    useEffect(() => {
        if (!resumeData.design) {
            setResumeData(prev => ({ ...prev, design: defaultResumeDesign }));
        }
    }, [resumeData.design]);

    const handleSave = async () => {
        if (!userId) {
            alert('Bitte melde dich an.');
            return;
        }
        setIsSaving(true);
        try {
            const dataToSave = {
                user_id: userId,
                title: resumeData.title || `${resumeData.personal.firstName} ${resumeData.personal.lastName}` || 'Neuer Lebenslauf',
                content: resumeData,
                updated_at: new Date().toISOString(),
            };
            if (resumeId && resumeId !== 'new') {
                const { error } = await supabase.from('resumes').update(dataToSave).eq('id', resumeId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('resumes').insert(dataToSave).select().single();
                if (error) throw error;
                if (data) router.replace(`/dashboard/editor/${data.id}`);
            }
            setLastSaved(new Date());
        } catch (e) {
            console.error('Save failed:', e);
            alert('Fehler beim Speichern.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        try {
            setIsExporting(true);
            await generatePDF('resume-preview-container', `${resumeData.personal.lastName || 'Resume'}_CV.pdf`);
        } catch (e) {
            console.error('Export failed:', e);
            alert('PDF Export fehlgeschlagen.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await analyzeResume(resumeData);
            if (result) {
                setAnalysisData(result);
                setIsAnalysisOpen(true);
            }
        } catch (e) {
            console.error('Analysis failed:', e);
            alert('Analyse fehlgeschlagen.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const applySuggestion = (path: string, newValue: string) => {
        setResumeData(prev => {
            const newData = { ...prev };
            const parts = path.split('.');
            let current: any = newData;

            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i];
                // Handle array access if path has indices like experience.0
                if (!isNaN(Number(parts[i + 1]))) {
                    current[part] = [...(current[part] || [])];
                } else {
                    current[part] = { ...(current[part] || {}) };
                }
                current = current[part];
            }

            current[parts[parts.length - 1]] = newValue;
            return newData;
        });
    };

    const handleImportClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsImporting(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/parse-resume', { method: 'POST', body: formData });
            if (!res.ok) throw new Error();
            const result = await res.json();
            if (result.data) {
                setResumeData({
                    ...defaultResumeData,
                    ...result.data,
                    experience: (result.data.experience || []).map((ex: any) => ({ ...ex, id: Math.random().toString() })),
                    education: (result.data.education || []).map((ed: any) => ({ ...ed, id: Math.random().toString() })),
                    title: resumeData.title
                });
                alert('Import erfolgreich!');
            }
        } catch (e) {
            alert('Fehler beim Import.');
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white">
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center z-30 shadow-sm">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Zurück
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <input
                            title="Lebenslauf Titel"
                            value={resumeData.title}
                            onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                            className="font-bold text-lg border-none focus:ring-0 p-0 text-gray-800 placeholder-gray-400"
                            placeholder="Mein Lebenslauf"
                        />
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                            {lastSaved ? `Zuletzt gespeichert: ${lastSaved.toLocaleTimeString()}` : 'Änderungen nicht gespeichert'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={isAnalyzing || aiLoading}>
                        {isAnalyzing || aiLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 text-purple-600" />}
                        KI Analyse
                    </Button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                    <Button variant="outline" size="sm" onClick={handleImportClick} disabled={isImporting}>
                        {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        CV Import
                    </Button>
                    <div className="h-6 w-[1px] bg-gray-200 mx-2" />
                    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                        {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        Export
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Speichern
                    </Button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden bg-gray-50">
                <nav className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group flex items-center justify-between ${activeSection === section.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="font-medium">{section.label}</span>
                                {activeSection === section.id && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="flex-1 flex overflow-hidden">
                    <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">
                                    {SECTIONS.find(s => s.id === activeSection)?.label}
                                </h2>

                                {activeSection === 'personal' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <Input label="Vorname" value={resumeData.personal.firstName} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, firstName: e.target.value } })} />
                                            <Input label="Nachname" value={resumeData.personal.lastName} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, lastName: e.target.value } })} />
                                        </div>
                                        <Input label="Jobtitel" value={resumeData.personal.title} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, title: e.target.value } })} />
                                        <div className="grid grid-cols-2 gap-6">
                                            <Input label="Email" value={resumeData.personal.email} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, email: e.target.value } })} />
                                            <Input label="Telefon" value={resumeData.personal.phone} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, phone: e.target.value } })} />
                                        </div>
                                        <Input label="Standort" value={resumeData.personal.location} onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, location: e.target.value } })} />
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Profil</label>
                                            <textarea
                                                className="w-full h-40 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                                value={resumeData.personal.summary}
                                                onChange={(e) => setResumeData({ ...resumeData, personal: { ...resumeData.personal, summary: e.target.value } })}
                                                placeholder="Beschreiben Sie Ihre berufliche Laufbahn und Kernkompetenzen..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'experience' && (
                                    <div className="space-y-6">
                                        <Button variant="outline" className="w-full border-dashed" onClick={() => setResumeData({ ...resumeData, experience: [...resumeData.experience, { id: Math.random().toString(), title: 'Neue Position', company: '', startDate: '', description: '' }] })}>
                                            + Berufserfahrung hinzufügen
                                        </Button>
                                        <div className="space-y-6">
                                            {resumeData.experience.map((exp, idx) => (
                                                <div key={exp.id} className="p-6 border rounded-2xl bg-gray-50 relative group transition-all hover:shadow-md">
                                                    <button
                                                        onClick={() => {
                                                            const n = [...resumeData.experience];
                                                            n.splice(idx, 1);
                                                            setResumeData({ ...resumeData, experience: n });
                                                        }}
                                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-sm"
                                                    >
                                                        Entfernen
                                                    </button>
                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <Input label="Jobtitel" value={exp.title} onChange={e => {
                                                            const n = [...resumeData.experience]; n[idx].title = e.target.value; setResumeData({ ...resumeData, experience: n });
                                                        }} />
                                                        <Input label="Unternehmen" value={exp.company} onChange={e => {
                                                            const n = [...resumeData.experience]; n[idx].company = e.target.value; setResumeData({ ...resumeData, experience: n });
                                                        }} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <Input label="Von" placeholder="MM/JJJJ" value={exp.startDate} onChange={e => {
                                                            const n = [...resumeData.experience]; n[idx].startDate = e.target.value; setResumeData({ ...resumeData, experience: n });
                                                        }} />
                                                        <Input label="Bis" placeholder="MM/JJJJ oder Heute" value={exp.endDate || ''} onChange={e => {
                                                            const n = [...resumeData.experience]; n[idx].endDate = e.target.value; setResumeData({ ...resumeData, experience: n });
                                                        }} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700">Beschreibung / Erfolge</label>
                                                        <textarea
                                                            className="w-full h-32 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                                                            value={exp.description}
                                                            onChange={e => {
                                                                const n = [...resumeData.experience]; n[idx].description = e.target.value; setResumeData({ ...resumeData, experience: n });
                                                            }}
                                                            placeholder="Verantwortlichkeiten und messbare Erfolge..."
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'education' && (
                                    <div className="space-y-6">
                                        <Button variant="outline" className="w-full border-dashed" onClick={() => setResumeData({ ...resumeData, education: [...resumeData.education, { id: Math.random().toString(), school: '', degree: '', field: '', startDate: '', endDate: '' }] })}>
                                            + Ausbildung hinzufügen
                                        </Button>
                                        <div className="space-y-6">
                                            {resumeData.education.map((edu, idx) => (
                                                <div key={edu.id} className="p-6 border rounded-2xl bg-gray-50 relative transition-all hover:shadow-md">
                                                    <button
                                                        onClick={() => {
                                                            const n = [...resumeData.education];
                                                            n.splice(idx, 1);
                                                            setResumeData({ ...resumeData, education: n });
                                                        }}
                                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-sm"
                                                    >
                                                        Entfernen
                                                    </button>
                                                    <Input label="Schule / Universität" value={edu.school} onChange={e => {
                                                        const n = [...resumeData.education]; n[idx].school = e.target.value; setResumeData({ ...resumeData, education: n });
                                                    }} className="mb-4" />
                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <Input label="Abschluss" value={edu.degree} onChange={e => {
                                                            const n = [...resumeData.education]; n[idx].degree = e.target.value; setResumeData({ ...resumeData, education: n });
                                                        }} />
                                                        <Input label="Fachbereich" value={edu.field} onChange={e => {
                                                            const n = [...resumeData.education]; n[idx].field = e.target.value; setResumeData({ ...resumeData, education: n });
                                                        }} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input label="Von" placeholder="JJJJ" value={edu.startDate} onChange={e => {
                                                            const n = [...resumeData.education]; n[idx].startDate = e.target.value; setResumeData({ ...resumeData, education: n });
                                                        }} />
                                                        <Input label="Bis" placeholder="JJJJ" value={edu.endDate} onChange={e => {
                                                            const n = [...resumeData.education]; n[idx].endDate = e.target.value; setResumeData({ ...resumeData, education: n });
                                                        }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'skills' && (
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {resumeData.skills.map((skill, idx) => (
                                                <span key={idx} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium border border-blue-100 flex items-center gap-2 shadow-sm">
                                                    {skill}
                                                    <button onClick={() => {
                                                        const n = [...resumeData.skills]; n.splice(idx, 1); setResumeData({ ...resumeData, skills: n });
                                                    }} className="hover:text-red-500">×</button>
                                                </span>
                                            ))}
                                        </div>
                                        <Input placeholder="Neue Fähigkeit eingeben + Enter" onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                const v = (e.target as HTMLInputElement).value.trim();
                                                if (v) { setResumeData({ ...resumeData, skills: [...resumeData.skills, v] }); (e.target as HTMLInputElement).value = ''; }
                                            }
                                        }} />
                                    </div>
                                )}

                                {activeSection === 'languages' && (
                                    <div className="space-y-4">
                                        <Button variant="outline" className="w-full border-dashed" onClick={() => setResumeData({ ...resumeData, languages: [...resumeData.languages, { language: '', level: '' }] })}>
                                            + Sprache hinzufügen
                                        </Button>
                                        {resumeData.languages.map((lang, idx) => (
                                            <div key={idx} className="flex gap-4 p-4 border rounded-xl bg-gray-50">
                                                <Input placeholder="Sprache" value={lang.language} className="flex-1" onChange={e => {
                                                    const n = [...resumeData.languages]; n[idx].language = e.target.value; setResumeData({ ...resumeData, languages: n });
                                                }} />
                                                <Input placeholder="Level" value={lang.level} className="w-32" onChange={e => {
                                                    const n = [...resumeData.languages]; n[idx].level = e.target.value; setResumeData({ ...resumeData, languages: n });
                                                }} />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeSection === 'design' && (
                                    <div className="space-y-10">
                                        {/* 1. Template Selector */}
                                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100">
                                            <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                                                <LayoutTemplate className="w-5 h-5" /> Vorlage auswählen
                                            </h3>
                                            <div className="grid grid-cols-3 gap-6">
                                                {/* System-Templates */}
                                                {['modern', 'classic', 'creative'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), template: t } }))}
                                                        className={`p-4 bg-white border-2 rounded-xl transition-all capitalize font-semibold shadow-sm ${(resumeData.design?.template || 'modern') === t
                                                            ? 'border-purple-600 ring-2 ring-purple-100 text-purple-700'
                                                            : 'border-transparent hover:border-gray-200 text-gray-500'
                                                            }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}

                                                {/* AI-generierte Templates */}
                                                {TemplateLoader.getJobseekerTemplates().map(template => (
                                                    <button
                                                        key={template.id}
                                                        onClick={() => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), template: template.id } }))}
                                                        className={`relative p-4 bg-white border-2 rounded-xl transition-all font-semibold shadow-sm overflow-hidden group ${resumeData.design?.template === template.id
                                                            ? 'border-indigo-600 ring-2 ring-indigo-100 text-indigo-700'
                                                            : 'border-transparent hover:border-gray-200 text-gray-500'
                                                            }`}
                                                    >
                                                        <div className="text-xs truncate">{template.name}</div>
                                                        {template.pro && (
                                                            <div className="absolute top-0 right-0 bg-yellow-400 text-[8px] font-black px-2 py-0.5 rounded-bl-lg text-white uppercase tracking-tighter shadow-sm">
                                                                Pro
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 2. Layout Controls */}
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                                <LayoutTemplate className="w-5 h-5 text-blue-500" /> Layout & Spalten
                                            </h3>
                                            <div className="flex items-center justify-between bg-white p-4 rounded-xl border">
                                                <div>
                                                    <p className="font-semibold text-gray-800">Spalten-Modus</p>
                                                    <p className="text-xs text-gray-500">Wechsle zwischen ein- und zweispaltigem Layout</p>
                                                </div>
                                                <button
                                                    onClick={() => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), layout: { ...(prev.design?.layout || defaultResumeDesign.layout), columns: prev.design?.layout.columns === 1 ? 2 : 1 } } }))}
                                                    className={`px-4 py-2 rounded-lg font-bold transition-all ${resumeData.design?.layout.columns === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {resumeData.design?.layout.columns} Spalten
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Seitenränder (mm)</p>
                                                    {['top', 'right', 'bottom', 'left'].map(side => (
                                                        <div key={side} className="space-y-1">
                                                            <div className="flex justify-between text-xs font-medium">
                                                                <span className="capitalize">{side}</span>
                                                                <span>{(resumeData.design?.layout.margins as any)[side]}mm</span>
                                                            </div>
                                                            <input
                                                                type="range" min="0" max="50"
                                                                value={(resumeData.design?.layout.margins as any)[side]}
                                                                onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), layout: { ...(prev.design?.layout || defaultResumeDesign.layout), margins: { ...(prev.design?.layout.margins || defaultResumeDesign.layout.margins), [side]: parseInt(e.target.value) } } } }))}
                                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="space-y-4">
                                                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Abstände (pt)</p>
                                                    {['section', 'item', 'paragraph'].map(type => (
                                                        <div key={type} className="space-y-1">
                                                            <div className="flex justify-between text-xs font-medium">
                                                                <span className="capitalize">{type}</span>
                                                                <span>{(resumeData.design?.layout.spacing as any)[type]}pt</span>
                                                            </div>
                                                            <input
                                                                type="range" min="0" max="40"
                                                                value={(resumeData.design?.layout.spacing as any)[type]}
                                                                onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), layout: { ...(prev.design?.layout || defaultResumeDesign.layout), spacing: { ...(prev.design?.layout.spacing || defaultResumeDesign.layout.spacing), [type]: parseInt(e.target.value) } } } }))}
                                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. Typography Controls */}
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                                <Palette className="w-5 h-5 text-emerald-500" /> Typografie & Text
                                            </h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Schriftart (Body)</label>
                                                    <select
                                                        value={resumeData.design?.typography.fontFamily.body}
                                                        onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), typography: { ...(prev.design?.typography || defaultResumeDesign.typography), fontFamily: { ...(prev.design?.typography.fontFamily || defaultResumeDesign.typography.fontFamily), body: e.target.value } } } }))}
                                                        className="w-full p-2 border rounded-lg bg-white"
                                                    >
                                                        <option value="Inter">Inter</option>
                                                        <option value="Roboto">Roboto</option>
                                                        <option value="Outfit">Outfit</option>
                                                        <option value="serif">Serif</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Zeilenabstand</label>
                                                    <input
                                                        type="range" min="1" max="2" step="0.1"
                                                        value={resumeData.design?.typography.lineHeight}
                                                        onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), typography: { ...(prev.design?.typography || defaultResumeDesign.typography), lineHeight: parseFloat(e.target.value) } } }))}
                                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Schriftgrößen (pt)</p>
                                                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                                    {['h1', 'h2', 'h3', 'body', 'small'].map(size => (
                                                        <div key={size} className="space-y-1">
                                                            <div className="flex justify-between text-xs font-medium">
                                                                <span className="uppercase">{size}</span>
                                                                <span>{(resumeData.design?.typography.fontSize as any)[size]}pt</span>
                                                            </div>
                                                            <input
                                                                type="range" min="6" max="32"
                                                                value={(resumeData.design?.typography.fontSize as any)[size]}
                                                                onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), typography: { ...(prev.design?.typography || defaultResumeDesign.typography), fontSize: { ...(prev.design?.typography.fontSize || defaultResumeDesign.typography.fontSize), [size]: parseInt(e.target.value) } } } }))}
                                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 4. Full Color Palette */}
                                        <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 text-white shadow-xl">
                                            <h3 className="flex items-center gap-2 font-bold text-white mb-8 text-lg">
                                                <Palette className="w-6 h-6 text-purple-400" /> Farbpalette
                                            </h3>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                                {[
                                                    { key: 'primary', label: 'Hauptfarbe' },
                                                    { key: 'accent', label: 'Akzent' },
                                                    { key: 'text', label: 'Text' },
                                                    { key: 'background', label: 'Hintergrund' }
                                                ].map(color => (
                                                    <div key={color.key} className="space-y-3">
                                                        <label className="text-[10px] items-center gap-1 font-black text-gray-400 uppercase tracking-tighter flex">
                                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: (resumeData.design?.colors as any)[color.key] }} />
                                                            {color.label}
                                                        </label>
                                                        <div className="relative group">
                                                            <input
                                                                type="color"
                                                                className="w-full h-12 rounded-xl cursor-pointer border-2 border-gray-700 bg-gray-800 p-1 transition-all hover:border-purple-500"
                                                                value={(resumeData.design?.colors as any)[color.key] || '#000000'}
                                                                onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), colors: { ...(prev.design?.colors || defaultResumeDesign.colors), [color.key]: e.target.value } } }))}
                                                            />
                                                            <span className="absolute -bottom-6 left-1 text-[9px] font-mono text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {(resumeData.design?.colors as any)[color.key]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="flex-1 bg-gray-200 p-12 hidden xl:flex justify-center overflow-y-auto">
                        <div className="sticky top-0 h-fit">
                            <div id="resume-preview-container" className="bg-white shadow-2xl origin-top transition-transform duration-500 hover:scale-[1.02]">
                                <ResumePreview data={resumeData} />
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <AnalysisModal
                isOpen={isAnalysisOpen}
                onClose={() => setIsAnalysisOpen(false)}
                data={analysisData}
                onApplySuggestion={applySuggestion}
            />
        </div>
    );
}
