'use client';

import { useState } from 'react';
import {
    X,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    AlertTriangle,
    Info,
    Check,
    Zap,
    TrendingUp,
    Clock,
    CheckCircle2
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface Issue {
    type: string;
    severity: 'error' | 'warning' | 'info';
    location: string;
    current: string;
    suggested: string;
    explanation: string;
    example?: string;
    patchPath?: string;
}

interface Category {
    category: string;
    score: number;
    issues: Issue[];
}

interface AnalysisData {
    overall_score: number;
    rating: string;
    summary: string;
    categories: Category[];
    top_priorities: string[];
    strengths: string[];
    weaknesses: string[];
    estimated_time_to_fix: string;
}

interface AnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: AnalysisData | null;
    onApplySuggestion: (patchPath: string, suggested: string) => void;
}

export default function AnalysisModal({ isOpen, onClose, data, onApplySuggestion }: AnalysisModalProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [appliedIssues, setAppliedIssues] = useState<Set<string>>(new Set());

    if (!isOpen || !data) return null;

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const handleApply = (issue: Issue, index: number, catIndex: number) => {
        if (!issue.patchPath) return;
        onApplySuggestion(issue.patchPath, issue.suggested);
        const issueKey = `${catIndex}-${index}`;
        setAppliedIssues(prev => new Set(prev).add(issueKey));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <header className="px-8 py-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Zap className="w-6 h-6 fill-amber-400 text-amber-400" />
                            KI-Lebenslauf-Analyse
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">Vollständige Optimierung nach Branchenstandard</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                    {/* Top Stats */}
                    <div className="grid md:grid-cols-12 gap-6">
                        <div className="md:col-span-4 bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-100">
                            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="64" cy="64" r="58"
                                        fill="transparent"
                                        stroke="#E5E7EB"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="64" cy="64" r="58"
                                        fill="transparent"
                                        stroke="url(#gradient)"
                                        strokeWidth="8"
                                        strokeDasharray={364.4}
                                        strokeDashoffset={364.4 - (364.4 * data.overall_score) / 100}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#3B82F6" />
                                            <stop offset="100%" stopColor="#8B5CF6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-gray-900">{data.overall_score}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-2 ${data.overall_score >= 90 ? 'bg-green-100 text-green-700' :
                                    data.overall_score >= 75 ? 'bg-blue-100 text-blue-700' :
                                        'bg-amber-100 text-amber-700'
                                }`}>
                                {data.rating}
                            </div>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Fix in {data.estimated_time_to_fix}
                            </p>
                        </div>

                        <div className="md:col-span-8 space-y-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                                <h3 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Analyse-Zusammenfassung
                                </h3>
                                <p className="text-blue-800 text-sm leading-relaxed">{data.summary}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {data.top_priorities.map((priority, i) => (
                                    <div key={i} className="bg-white border rounded-xl p-4 shadow-sm border-l-4 border-l-blue-500">
                                        <span className="text-[10px] font-bold text-blue-500 uppercase block mb-1">Priorität {i + 1}</span>
                                        <p className="text-xs font-semibold text-gray-700 leading-tight">{priority}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Categories Accordion */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Detaillierte Analyse</h3>
                        <div className="space-y-3">
                            {data.categories.map((cat, catIdx) => (
                                <div key={cat.category} className="border rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                                    <button
                                        onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
                                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${cat.score >= 80 ? 'bg-green-500' : cat.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${cat.score}%` }}
                                                />
                                            </div>
                                            <span className="font-bold text-gray-800">{cat.category}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-bold text-gray-500">{cat.score}/100</span>
                                            {expandedCategory === cat.category ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                        </div>
                                    </button>

                                    {expandedCategory === cat.category && (
                                        <div className="px-5 pb-5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            {cat.issues.length === 0 ? (
                                                <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                                                    <CheckCircle2 className="w-5 h-5" /> Alles perfekt in dieser Kategorie!
                                                </div>
                                            ) : (
                                                cat.issues.map((issue, idx) => {
                                                    const isApplied = appliedIssues.has(`${catIdx}-${idx}`);
                                                    return (
                                                        <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex items-center gap-3">
                                                                    {getSeverityIcon(issue.severity)}
                                                                    <span className="font-bold text-gray-800">{issue.type}</span>
                                                                    <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase">{issue.location}</span>
                                                                </div>
                                                                {issue.patchPath && !isApplied && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="primary"
                                                                        onClick={() => handleApply(issue, idx, catIdx)}
                                                                        className="h-8 py-0 px-3 text-xs"
                                                                    >
                                                                        <Check className="w-3 h-3 mr-1" /> Übernehmen
                                                                    </Button>
                                                                )}
                                                                {isApplied && (
                                                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                                                                        <Check className="w-3 h-3" /> Angewandt
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Aktuell</label>
                                                                    <p className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-100 line-through decoration-red-300 italic">
                                                                        {issue.current}
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Vorschlag</label>
                                                                    <p className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100 font-medium font-mono">
                                                                        {issue.suggested}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="pt-2 border-t border-gray-200">
                                                                <p className="text-xs text-gray-600 leading-relaxed italic">
                                                                    <span className="font-bold text-gray-500 mr-2">Warum?</span>
                                                                    {issue.explanation}
                                                                </p>
                                                                {issue.example && (
                                                                    <p className="text-[10px] text-blue-600 mt-2 bg-blue-50 p-2 rounded">
                                                                        <span className="font-bold mr-1">Tipp:</span> {issue.example}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="px-8 py-6 border-t bg-gray-50 flex justify-between items-center whitespace-nowrap overflow-x-auto gap-4 custom-scrollbar">
                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stärken</span>
                            <div className="flex gap-2 mt-1">
                                {data.strengths.slice(0, 2).map((s, i) => (
                                    <span key={i} className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Button variant="primary" onClick={onClose} className="rounded-2xl px-10">
                        Fertig
                    </Button>
                </footer>
            </div>
        </div>
    );
}
