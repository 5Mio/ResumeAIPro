'use client';

import { TemplateConfig } from '@/types/template-generation';
import { Layout, Users, Star, Brain } from 'lucide-react';

interface TemplateConfigFormProps {
    config: TemplateConfig;
    onChange: (config: TemplateConfig) => void;
    disabled?: boolean;
}

export default function TemplateConfigForm({ config, onChange, disabled }: TemplateConfigFormProps) {
    const handleChange = (field: keyof TemplateConfig, value: any) => {
        onChange({ ...config, [field]: value });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Star className="w-4 h-4 text-indigo-500" /> Template-Name
                    </label>
                    <input
                        type="text"
                        value={config.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="z.B. Modern Professional Blue"
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                        disabled={disabled}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" /> Zielgruppe
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {(['jobseeker', 'student'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => handleChange('targetAudience', t)}
                                disabled={disabled}
                                className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${config.targetAudience === t
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200'
                                    }`}
                            >
                                {t === 'jobseeker' ? 'Jobsucher' : 'Schüler'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Layout className="w-4 h-4 text-indigo-500" /> Kategorie
                    </label>
                    <select
                        value={config.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium appearance-none"
                        disabled={disabled}
                    >
                        <option value="modern">Modern</option>
                        <option value="classic">Klassisch</option>
                        <option value="creative">Kreativ</option>
                        <option value="minimal">Minimalistisch</option>
                        <option value="professional">Professionell</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-indigo-500" /> AI Provider
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {(['anthropic', 'openai'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => handleChange('aiProvider', p)}
                                disabled={disabled}
                                className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm flex items-center justify-center gap-2 ${config.aiProvider === p
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200'
                                    }`}
                            >
                                <span className="capitalize">{p}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                        <p className="text-sm font-bold text-gray-700">Premium Template</p>
                        <p className="text-[10px] text-gray-400 font-medium">Nur für Pro-Nutzer verfügbar</p>
                    </div>
                    <button
                        onClick={() => handleChange('pro', !config.pro)}
                        disabled={disabled}
                        className={`w-12 h-6 rounded-full transition-all relative ${config.pro ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.pro ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </div>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Star className="w-4 h-4 text-indigo-500" /> Features
                    </label>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div>
                                <p className="text-sm font-bold text-gray-700">Foto Support</p>
                                <p className="text-[10px] text-gray-400 font-medium">Template unterstützt Profilbilder</p>
                            </div>
                            <button
                                onClick={() => handleChange('features', { ...config.features, supportsPhoto: !config.features?.supportsPhoto })}
                                disabled={disabled}
                                className={`w-12 h-6 rounded-full transition-all relative ${config.features?.supportsPhoto ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.features?.supportsPhoto ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div>
                                <p className="text-sm font-bold text-gray-700">Skill Level Bars</p>
                                <p className="text-[10px] text-gray-400 font-medium">Skills mit Fortschrittsbalken</p>
                            </div>
                            <button
                                onClick={() => handleChange('features', { ...config.features, supportsSkillLevels: !config.features?.supportsSkillLevels })}
                                disabled={disabled}
                                className={`w-12 h-6 rounded-full transition-all relative ${config.features?.supportsSkillLevels ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.features?.supportsSkillLevels ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div>
                                <p className="text-sm font-bold text-gray-700">Social Media Icons</p>
                                <p className="text-[10px] text-gray-400 font-medium">LinkedIn, GitHub etc.</p>
                            </div>
                            <button
                                onClick={() => handleChange('features', { ...config.features, supportsSocialMedia: !config.features?.supportsSocialMedia })}
                                disabled={disabled}
                                className={`w-12 h-6 rounded-full transition-all relative ${config.features?.supportsSocialMedia ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.features?.supportsSocialMedia ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
