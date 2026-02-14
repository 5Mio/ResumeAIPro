'use client';

import { Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { GenerationStatus as StatusType } from '@/types/admin';

interface GenerationStatusProps {
    status: StatusType;
}

export default function GenerationStatus({ status }: GenerationStatusProps) {
    const isError = status.stage === 'error';
    const isComplete = status.stage === 'complete';

    return (
        <div className={`p-6 rounded-3xl border transition-all animate-in fade-in slide-in-from-bottom-4 duration-500
            ${isError ? 'bg-red-50 border-red-100 text-red-900' :
                isComplete ? 'bg-green-50 border-green-100 text-green-900' :
                    'bg-indigo-50 border-indigo-100 text-indigo-900'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isError ? 'bg-white/50' : isComplete ? 'bg-white/50' : 'bg-white shadow-sm'}`}>
                    {isError ? (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    ) : isComplete ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">
                            {status.stage === 'uploading' && 'Datei wird hochgeladen...'}
                            {status.stage === 'analyzing' && 'AI analysiert das Design...'}
                            {status.stage === 'generating' && 'React-Code wird generiert...'}
                            {status.stage === 'deploying' && 'Template wird deployt...'}
                            {status.stage === 'complete' && 'Erfolgreich erstellt!'}
                            {status.stage === 'error' && 'Fehler aufgetreten'}
                        </p>
                        {!isError && !isComplete && (
                            <div className="flex gap-1">
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
                            </div>
                        )}
                    </div>
                    <p className={`text-xs mt-1 font-medium ${isError ? 'text-red-500' : isComplete ? 'text-green-600' : 'text-indigo-500'}`}>
                        {status.message}
                    </p>
                </div>
                {isComplete && (
                    <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
                )}
            </div>

            {!isError && !isComplete && (
                <div className="mt-4 h-1.5 w-full bg-indigo-100/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
                        style={{
                            width: status.stage === 'uploading' ? '20%' :
                                status.stage === 'analyzing' ? '45%' :
                                    status.stage === 'generating' ? '75%' :
                                        status.stage === 'deploying' ? '90%' : '100%'
                        }}
                    />
                </div>
            )}
        </div>
    );
}
