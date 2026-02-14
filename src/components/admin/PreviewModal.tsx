'use client';

import { useState } from 'react';
import { X, Check, Copy, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PreviewModalProps {
    code: string;
    onClose: () => void;
    onDeploy: () => void;
    isDeploying: boolean;
}

export default function PreviewModal({ code, onClose, onDeploy, isDeploying }: PreviewModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Code Preview</h2>
                        <p className="text-sm text-gray-500 font-medium">Überprüfe den generierten Code vor dem Deployment</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={handleCopy}
                            className="bg-gray-50 border-gray-200 text-gray-700"
                        >
                            {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'Kopiert' : 'Code kopieren'}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-6 h-6 text-gray-400" />
                        </Button>
                    </div>
                </div>

                {/* Code Editor / Settings */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Code View */}
                    <div className="flex-1 bg-[#1e1e1e] overflow-auto p-6 font-mono text-sm relative">
                        <pre className="text-gray-300">
                            <code>{code}</code>
                        </pre>
                    </div>

                    {/* Sidebar Info */}
                    <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-auto">
                        <div className="space-y-6">
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                                <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> Nächste Schritte
                                </h3>
                                <p className="text-xs text-indigo-700 leading-relaxed">
                                    Wenn du auf "Deploy" klickst, wird das Template automatisch:
                                    <br />1. Als `.tsx` Datei gespeichert
                                    <br />2. In die `index.ts` Registry eingetragen
                                    <br />3. In der Datenbank registriert
                                </p>
                            </div>

                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 py-6 text-lg font-bold"
                                onClick={onDeploy}
                                disabled={isDeploying}
                            >
                                {isDeploying ? 'Deploying...' : 'Jetzt Deployen 🚀'}
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full border-gray-200 text-gray-600 hover:bg-white"
                                onClick={onClose}
                                disabled={isDeploying}
                            >
                                Abbrechen & Bearbeiten
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
