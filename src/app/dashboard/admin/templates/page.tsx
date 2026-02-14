'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, LayoutTemplate, MoreVertical, ExternalLink, Calendar, User, Eye, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import Button from '@/components/ui/Button';
import { Database } from '@/types/supabase';

export default function AdminTemplatesPage() {
    const supabase = createClient();
    const [templates, setTemplates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('admin_templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <header className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Template Management</h1>
                        <p className="text-[10px] text-indigo-500 uppercase font-black tracking-widest mt-1">Admin Dashboard / Overview</p>
                    </div>

                    <Link href="/dashboard/admin/templates/create">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                            <Plus className="w-4 h-4 mr-2" /> Neues Template generieren
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-bold animate-pulse">Lade Templates...</p>
                    </div>
                ) : templates.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <LayoutTemplate className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Noch keine Templates</h2>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">
                            Du hast noch keine AI-generierten Templates. Starte jetzt mit deiner ersten Vorlage!
                        </p>
                        <Link href="/dashboard/admin/templates/create">
                            <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                                <Plus className="w-4 h-4 mr-2" /> Erstes Template erstellen
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <div key={template.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 overflow-hidden group">
                                <div className="aspect-[210/297] bg-gray-50 relative border-b border-gray-50 overflow-hidden">
                                    {template.preview_image_url ? (
                                        <img
                                            key={template.preview_image_url} // Force re-render on change
                                            src={template.preview_image_url}
                                            alt={template.name}
                                            className="w-full h-full object-cover object-top"
                                            onError={(e) => {
                                                console.error('Image load error:', template.preview_image_url);
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center opacity-40 group-hover:opacity-100 transition-opacity">
                                            <LayoutTemplate className="w-12 h-12 text-gray-300 mb-4 group-hover:text-indigo-600 group-hover:scale-110 transition-all" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Keine Vorschau verfügbar</p>
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${template.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {template.status}
                                        </div>
                                        {template.is_pro && (
                                            <div className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                Pro
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-black text-gray-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{template.name}</h3>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">{template.category} • {template.target_audience}</p>
                                        </div>
                                        <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(template.created_at).toLocaleDateString('de-DE')}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <User className="w-3.5 h-3.5" />
                                            {template.ai_provider}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/dashboard/editor/preview/${template.template_id}`} className="w-full">
                                            <Button variant="outline" size="sm" className="w-full border-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 py-2.5">
                                                <Eye className="w-3.5 h-3.5 mr-2" /> Vorschau
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="sm" className="w-full text-red-400 hover:bg-red-50 hover:text-red-500 py-2.5">
                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
