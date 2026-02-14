'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
    Save,
    Download,
    Sparkles,
    ArrowLeft,
    Loader2,
    School,
    Briefcase,
    GraduationCap,
    Heart,
    Upload,
    Palette,
    LayoutTemplate,
    Type,
    X,
    Globe,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import ResumePreview from '@/components/resume/ResumePreview';
import { generatePDF } from '@/lib/pdf-service';
import { useAI } from '@/hooks/useAI';
import { createClient } from '@/lib/supabase-client';
import { TemplateLoader } from '@/lib/templates/template-loader';
import { useRouter } from 'next/navigation';
import { ResumeDesign, defaultResumeDesign } from '@/types/resume';

interface StudentResumeData {
    id?: string;
    title: string;
    personal: {
        firstName: string;
        lastName: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
        website?: string;
        address?: string;
    };
    education: Array<{
        id: string;
        school: string;
        degree: string;
        field: string;
        startDate: string;
        endDate: string;
        description?: string;
    }>;
    experience: Array<{
        id: string;
        title: string;
        company: string;
        startDate: string;
        endDate?: string;
        description: string;
    }>;
    activities: Array<{
        id: string;
        title: string;
        organization: string;
        description: string;
    }>;
    skills: string[];
    languages: Array<{
        language: string;
        level: string;
    }>;
    design: ResumeDesign;
}

const defaultStudentData: StudentResumeData = {
    title: 'Mein Schüler-Lebenslauf',
    personal: {
        firstName: '',
        lastName: '',
        title: 'Schüler / Auszubildender',
        email: '',
        phone: '',
        location: '',
        summary: '',
    },
    education: [],
    experience: [],
    activities: [],
    skills: [],
    languages: [],
    design: defaultResumeDesign,
};

const SECTIONS = [
    { id: 'personal', label: 'Persönliche Daten', icon: null },
    { id: 'education', label: 'Schule & Ausbildung', icon: School },
    { id: 'experience', label: 'Praktika & Jobs', icon: Briefcase },
    { id: 'activities', label: 'Projekte & Engagement', icon: Heart },
    { id: 'skills', label: 'Kenntnisse & Sprachen', icon: Sparkles },
    { id: 'design', label: 'Design & Vorlage', icon: Palette },
];

export default function StudentEditor({ initialData, resumeId, userId }: { initialData?: StudentResumeData | null, resumeId?: string, userId: string }) {
    const router = useRouter();
    const supabase = createClient();

    const [activeSection, setActiveSection] = useState('personal');
    const [resumeData, setResumeData] = useState<StudentResumeData>(initialData || defaultStudentData);
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { optimizeText, loading: aiLoading } = useAI();

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
                title: resumeData.title || 'Schüler Lebenslauf',
                content: resumeData,
                updated_at: new Date().toISOString(),
            };
            if (resumeId && resumeId !== 'new') {
                const { error } = await supabase.from('student_resumes').update(dataToSave).eq('id', resumeId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('student_resumes').insert(dataToSave).select().single();
                if (error) throw error;
                if (data) router.replace(`/dashboard/student/editor/${data.id}`);
            }
            setLastSaved(new Date());
        } catch (e) {
            alert('Fehler beim Speichern.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await generatePDF('resume-preview-container', `${resumeData.personal.lastName || 'Student'}_CV.pdf`);
        } catch (e) {
            alert('Export fehlgeschlagen.');
        } finally {
            setIsExporting(false);
        }
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
                    ...defaultStudentData,
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
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center z-30 shadow-sm border-indigo-100">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/student">
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Zurück
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-indigo-600" />
                            <input
                                title="Titel"
                                value={resumeData.title}
                                onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                                className="font-bold text-lg border-none focus:ring-0 p-0 text-gray-800 placeholder-gray-400"
                            />
                        </div>
                        <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold ml-7">
                            {lastSaved ? `Zuletzt gespeichert: ${lastSaved.toLocaleTimeString()}` : 'Änderungen nicht gespeichert'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={handleImportClick} disabled={isImporting}>
                        {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        CV Import
                    </Button>
                    <div className="h-6 w-[1px] bg-indigo-100 mx-2" />
                    <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={handleExport} disabled={isExporting}>
                        {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        Export
                    </Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Speichern
                    </Button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden bg-indigo-50/20">
                <nav className="w-64 bg-white border-r border-indigo-100 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        {SECTIONS.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all group flex items-center gap-3 ${activeSection === section.id
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-indigo-50'
                                        }`}
                                >
                                    {Icon && <Icon className={`w-4 h-4 ${activeSection === section.id ? 'text-white' : 'text-indigo-400'}`} />}
                                    <span className="font-medium text-sm">{section.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                </nav>

                <div className="flex-1 flex overflow-hidden">
                    <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-indigo-50 pb-4">
                                    {SECTIONS.find(s => s.id === activeSection)?.label}
                                </h2>

                                {activeSection === 'personal' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <Input label="Vorname" value={resumeData.personal.firstName} onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, firstName: e.target.value } })} />
                                            <Input label="Nachname" value={resumeData.personal.lastName} onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, lastName: e.target.value } })} />
                                        </div>
                                        <Input label="Status" value={resumeData.personal.title} placeholder="z.B. Schüler an der Max-Mustermann-Schule" onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, title: e.target.value } })} />
                                        <div className="grid grid-cols-2 gap-6">
                                            <Input label="E-Mail" value={resumeData.personal.email} onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, email: e.target.value } })} />
                                            <Input label="Telefon" value={resumeData.personal.phone} onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, phone: e.target.value } })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Motivation / Über mich</label>
                                            <textarea
                                                className="w-full h-40 p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
                                                value={resumeData.personal.summary}
                                                onChange={e => setResumeData({ ...resumeData, personal: { ...resumeData.personal, summary: e.target.value } })}
                                                placeholder="Was fasziniert dich an diesem Bereich? Warum bist du der Richtige?"
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'education' && (
                                    <div className="space-y-6">
                                        <Button variant="outline" className="w-full border-dashed border-indigo-200 text-indigo-600" onClick={() => setResumeData({ ...resumeData, education: [...resumeData.education, { id: Math.random().toString(), school: '', degree: '', field: '', startDate: '', endDate: '' }] })}>
                                            + Schule hinzufügen
                                        </Button>
                                        {resumeData.education.map((edu, idx) => (
                                            <div key={edu.id} className="p-6 border border-indigo-50 rounded-2xl bg-indigo-50/30 relative">
                                                <button onClick={() => {
                                                    const n = [...resumeData.education]; n.splice(idx, 1); setResumeData({ ...resumeData, education: n });
                                                }} className="absolute top-4 right-4 text-red-500 text-xs font-bold">Löschen</button>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <Input label="Schule / Institution" value={edu.school} onChange={e => {
                                                        const n = [...resumeData.education]; n[idx].school = e.target.value; setResumeData({ ...resumeData, education: n });
                                                    }} />
                                                    <Input label="Abschluss (angestrebt)" placeholder="z.B. Abitur" value={edu.degree} onChange={e => {
                                                        const n = [...resumeData.education]; n[idx].degree = e.target.value; setResumeData({ ...resumeData, education: n });
                                                    }} />
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <Input label="Zweig / Fach" placeholder="z.B. Wirtschaft" value={edu.field} onChange={e => {
                                                        const n = [...resumeData.education]; n[idx].field = e.target.value; setResumeData({ ...resumeData, education: n });
                                                    }} />
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
                                )}

                                {activeSection === 'experience' && (
                                    <div className="space-y-6">
                                        <Button variant="outline" className="w-full border-dashed border-indigo-200 text-indigo-600" onClick={() => setResumeData({ ...resumeData, experience: [...resumeData.experience, { id: Math.random().toString(), title: '', company: '', startDate: '', description: '' }] })}>
                                            + Praktikum / Nebenjob hinzufügen
                                        </Button>
                                        {resumeData.experience.map((exp, idx) => (
                                            <div key={exp.id} className="p-6 border border-indigo-50 rounded-2xl bg-indigo-50/30 relative">
                                                <button onClick={() => {
                                                    const n = [...resumeData.experience]; n.splice(idx, 1); setResumeData({ ...resumeData, experience: n });
                                                }} className="absolute top-4 right-4 text-red-500 text-xs font-bold">Löschen</button>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <Input label="Tätigkeit" value={exp.title} onChange={e => {
                                                        const n = [...resumeData.experience]; n[idx].title = e.target.value; setResumeData({ ...resumeData, experience: n });
                                                    }} />
                                                    <Input label="Firma" value={exp.company} onChange={e => {
                                                        const n = [...resumeData.experience]; n[idx].company = e.target.value; setResumeData({ ...resumeData, experience: n });
                                                    }} />
                                                </div>
                                                <textarea
                                                    className="w-full p-4 border rounded-xl text-sm h-24"
                                                    placeholder="Was waren deine Aufgaben?"
                                                    value={exp.description}
                                                    onChange={e => {
                                                        const n = [...resumeData.experience]; n[idx].description = e.target.value; setResumeData({ ...resumeData, experience: n });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeSection === 'activities' && (
                                    <div className="space-y-6">
                                        <Button variant="outline" className="w-full border-dashed border-indigo-200 text-indigo-600" onClick={() => setResumeData({ ...resumeData, activities: [...resumeData.activities, { id: Math.random().toString(), title: '', organization: '', description: '' }] })}>
                                            + Projekt / Engagement hinzufügen
                                        </Button>
                                        {resumeData.activities.map((act, idx) => (
                                            <div key={act.id} className="p-6 border border-indigo-50 rounded-2xl bg-indigo-50/30 relative">
                                                <button onClick={() => {
                                                    const n = [...resumeData.activities]; n.splice(idx, 1); setResumeData({ ...resumeData, activities: n });
                                                }} className="absolute top-4 right-4 text-red-500 text-xs font-bold">Löschen</button>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <Input label="Titel / Rolle" placeholder="z.B. Klassensprecher" value={act.title} onChange={e => {
                                                        const n = [...resumeData.activities]; n[idx].title = e.target.value; setResumeData({ ...resumeData, activities: n });
                                                    }} />
                                                    <Input label="Organisation" placeholder="z.B. SV / Sportverein" value={act.organization} onChange={e => {
                                                        const n = [...resumeData.activities]; n[idx].organization = e.target.value; setResumeData({ ...resumeData, activities: n });
                                                    }} />
                                                </div>
                                                <textarea
                                                    className="w-full p-4 border border-indigo-100 rounded-xl text-sm h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    placeholder="Beschreibe kurz was du gemacht hast..."
                                                    value={act.description}
                                                    onChange={e => {
                                                        const n = [...resumeData.activities]; n[idx].description = e.target.value; setResumeData({ ...resumeData, activities: n });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeSection === 'skills' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-indigo-500" /> Kenntnisse
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {resumeData.skills.map((skill, idx) => (
                                                    <span key={idx} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                                                        {skill}
                                                        <button onClick={() => {
                                                            const n = [...resumeData.skills]; n.splice(idx, 1); setResumeData({ ...resumeData, skills: n });
                                                        }} className="hover:text-red-200"><X className="w-3.5 h-3.5" /></button>
                                                    </span>
                                                ))}
                                            </div>
                                            <Input
                                                placeholder="z.B. Microsoft Word, Canva, Python... (Enter drücken)"
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        const val = (e.target as HTMLInputElement).value.trim();
                                                        if (val) {
                                                            setResumeData({ ...resumeData, skills: [...resumeData.skills, val] });
                                                            (e.target as HTMLInputElement).value = '';
                                                            e.preventDefault();
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div className="pt-6 border-t border-indigo-50">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Globe className="w-5 h-5 text-indigo-500" /> Sprachen
                                            </h3>
                                            <Button variant="outline" className="w-full border-dashed border-indigo-200 text-indigo-600 mb-4" onClick={() => setResumeData({ ...resumeData, languages: [...resumeData.languages, { language: '', level: 'Grundkenntnisse' }] })}>
                                                + Sprache hinzufügen
                                            </Button>
                                            <div className="space-y-3">
                                                {resumeData.languages.map((lang, idx) => (
                                                    <div key={idx} className="flex gap-3 items-center">
                                                        <Input className="flex-1" placeholder="Sprache" value={lang.language} onChange={e => {
                                                            const n = [...resumeData.languages]; n[idx].language = e.target.value; setResumeData({ ...resumeData, languages: n });
                                                        }} />
                                                        <select
                                                            className="p-2.5 border border-indigo-100 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            value={lang.level}
                                                            onChange={e => {
                                                                const n = [...resumeData.languages]; n[idx].level = e.target.value; setResumeData({ ...resumeData, languages: n });
                                                            }}
                                                        >
                                                            <option>Grundkenntnisse</option>
                                                            <option>Gut</option>
                                                            <option>Fließend</option>
                                                            <option>Muttersprache</option>
                                                        </select>
                                                        <button onClick={() => {
                                                            const n = [...resumeData.languages]; n.splice(idx, 1); setResumeData({ ...resumeData, languages: n });
                                                        }} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'design' && (
                                    <div className="space-y-10">
                                        {/* 1. Template Selector */}
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
                                            <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                                <LayoutTemplate className="w-5 h-5" /> Vorlage auswählen
                                            </h3>
                                            <div className="grid grid-cols-3 gap-6">
                                                {/* System-Templates */}
                                                {['modern', 'classic', 'creative'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), template: t as any } }))}
                                                        className={`p-4 bg-white border-2 rounded-xl transition-all capitalize font-semibold shadow-sm ${(resumeData.design?.template || 'modern') === t
                                                            ? 'border-indigo-600 ring-2 ring-indigo-100 text-indigo-700'
                                                            : 'border-transparent hover:border-gray-200 text-gray-500'
                                                            }`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}

                                                {/* AI-generierte Templates */}
                                                {TemplateLoader.getStudentTemplates().map(template => (
                                                    <button
                                                        key={template.id}
                                                        onClick={() => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), template: template.id as any } }))}
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
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-indigo-50 pb-2">
                                                <LayoutTemplate className="w-5 h-5 text-indigo-500" /> Layout & Struktur
                                            </h3>
                                            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-indigo-100">
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">Spalten-Modus</p>
                                                    <p className="text-[11px] text-gray-500">Wechsle zwischen ein- und zweispaltigem Layout</p>
                                                </div>
                                                <button
                                                    onClick={() => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), layout: { ...(prev.design?.layout || defaultResumeDesign.layout), columns: prev.design?.layout.columns === 1 ? 2 : 1 } } }))}
                                                    className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${resumeData.design?.layout.columns === 2 ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                >
                                                    {resumeData.design?.layout.columns || 1} Spalten
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Seitenränder (mm)</p>
                                                    {['top', 'right', 'bottom', 'left'].map(side => (
                                                        <div key={side} className="space-y-1">
                                                            <div className="flex justify-between text-[11px] font-bold text-gray-600">
                                                                <span className="capitalize">{side}</span>
                                                                <span>{(resumeData.design?.layout.margins as any)[side]}mm</span>
                                                            </div>
                                                            <input
                                                                type="range" min="0" max="50"
                                                                value={(resumeData.design?.layout.margins as any)[side]}
                                                                onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), layout: { ...(prev.design?.layout || defaultResumeDesign.layout), margins: { ...(prev.design?.layout.margins || defaultResumeDesign.layout.margins), [side]: parseInt(e.target.value) } } } }))}
                                                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">Abstände (pt)</p>
                                                    {['section', 'item', 'paragraph'].map(type => (
                                                        <div key={type} className="space-y-1">
                                                            <div className="flex justify-between text-[11px] font-bold text-gray-600">
                                                                <span className="capitalize">{type}</span>
                                                                <span>{(resumeData.design?.layout.spacing as any)[type]}pt</span>
                                                            </div>
                                                            <input
                                                                type="range" min="0" max="40"
                                                                value={(resumeData.design?.layout.spacing as any)[type]}
                                                                onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), layout: { ...(prev.design?.layout || defaultResumeDesign.layout), spacing: { ...(prev.design?.layout.spacing || defaultResumeDesign.layout.spacing), [type]: parseInt(e.target.value) } } } }))}
                                                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. Typography Controls */}
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-indigo-50 pb-2">
                                                <Type className="w-5 h-5 text-purple-500" /> Typografie & Text
                                            </h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Schriftart (Body)</label>
                                                    <select
                                                        value={resumeData.design?.typography.fontFamily.body}
                                                        onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), typography: { ...(prev.design?.typography || defaultResumeDesign.typography), fontFamily: { ...(prev.design?.typography.fontFamily || defaultResumeDesign.typography.fontFamily), body: e.target.value } } } }))}
                                                        className="w-full p-2 text-sm border border-indigo-100 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    >
                                                        <option value="Inter">Inter</option>
                                                        <option value="Roboto">Roboto</option>
                                                        <option value="Outfit">Outfit</option>
                                                        <option value="serif">Serif</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Zeilenabstand</label>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="range" min="1" max="2" step="0.1"
                                                            value={resumeData.design?.typography.lineHeight}
                                                            onChange={e => setResumeData(prev => ({
                                                                ...prev,
                                                                design: {
                                                                    ...(prev.design || defaultResumeDesign),
                                                                    typography: {
                                                                        ...(prev.design?.typography || defaultResumeDesign.typography),
                                                                        lineHeight: parseFloat(e.target.value)
                                                                    }
                                                                }
                                                            }))}
                                                            className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                        />
                                                        <span className="text-xs font-bold text-indigo-600">{resumeData.design?.typography.lineHeight}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mt-4">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Schriftgrößen (pt)</p>
                                                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                                    {Object.entries(resumeData.design?.typography.fontSize || defaultResumeDesign.typography.fontSize).map(([key, val]) => (
                                                        <div key={key} className="space-y-1">
                                                            <div className="flex justify-between text-[11px] font-medium text-gray-500">
                                                                <span className="uppercase text-[9px] font-black">{key}</span>
                                                                <span className="font-bold text-indigo-600">{val}pt</span>
                                                            </div>
                                                            <input
                                                                type="range" min="8" max="32"
                                                                value={val}
                                                                onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), typography: { ...(prev.design?.typography || defaultResumeDesign.typography), fontSize: { ...(prev.design?.typography.fontSize || defaultResumeDesign.typography.fontSize), [key]: parseInt(e.target.value) } } } }))}
                                                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 4. Full Color Palette */}
                                        <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors" />
                                            <h3 className="flex items-center gap-2 font-bold mb-8 text-lg relative z-10">
                                                <Palette className="w-6 h-6 text-indigo-400" /> Farbpalette
                                            </h3>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
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
                                                        <div className="relative">
                                                            <input
                                                                type="color"
                                                                className="w-full h-12 rounded-xl cursor-pointer border-2 border-gray-700 bg-gray-800 p-1 transition-all hover:border-indigo-500"
                                                                value={(resumeData.design?.colors as any)[color.key] || '#000000'}
                                                                onChange={e => setResumeData(prev => ({ ...prev, design: { ...(prev.design || defaultResumeDesign), colors: { ...(prev.design?.colors || defaultResumeDesign.colors), [color.key]: e.target.value } } }))}
                                                            />
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

                    <section className="flex-1 bg-indigo-50/30 p-12 hidden xl:flex justify-center overflow-y-auto">
                        <div className="sticky top-0 h-fit">
                            <div id="resume-preview-container" className="bg-white shadow-2xl origin-top transition-transform hover:scale-[1.02]">
                                <ResumePreview data={{ ...resumeData, design: resumeData.design || defaultResumeDesign }} />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
