'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { ArrowLeft, History, CheckCircle2, XCircle, Clock, Info, ExternalLink, Calendar, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');
    const supabase = createClient();

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            let query = supabase
                .from('template_generation_logs')
                .select(`
                    *,
                    admin_templates (name)
                `)
                .order('created_at', { ascending: false });

            if (filter === 'success') query = query.eq('success', true);
            if (filter === 'error') query = query.eq('success', false);

            const { data, error } = await query;
            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setIsLoading(false);
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
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <History className="w-6 h-6 text-indigo-600" />
                                Generation Logs
                            </h1>
                            <p className="text-[10px] text-indigo-500 uppercase font-black tracking-widest mt-1">Admin Dashboard / Audit Trail</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                        {(['all', 'success', 'error'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setFilter(mode)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === mode
                                        ? 'bg-white shadow-sm text-indigo-600 shadow-indigo-100'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {mode === 'all' ? 'Alle' : mode === 'success' ? 'Erfolg' : 'Fehler'}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-bold animate-pulse">Lade Protokolle...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center shadow-sm">
                        <History className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Keine Protokolle gefunden</h2>
                        <p className="text-gray-500 text-sm">Es wurden noch keine Generierungen mit diesem Filter protokolliert.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Zeitpunkt</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Template</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Provider</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Dauer</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Aktionen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {new Date(log.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                    {new Date(log.created_at).toLocaleDateString('de-DE')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {log.success ? (
                                                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Erfolgreich</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-full w-fit">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-700">Fehler</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-gray-700 group-hover:text-indigo-600 transition-colors">
                                                {log.admin_templates?.name || 'Unbekannt'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black uppercase tracking-tighter">
                                                {log.ai_provider}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                                                <Clock className="w-3.5 h-3.5" />
                                                {(log.execution_time_ms / 1000).toFixed(1)}s
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {!log.success && log.error_message && (
                                                <button
                                                    onClick={() => alert(`Fehlerdetails:\n${log.error_message}`)}
                                                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all opacity-0 group-hover:opacity-100"
                                                    title="Fehler anzeigen"
                                                >
                                                    <Info className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
