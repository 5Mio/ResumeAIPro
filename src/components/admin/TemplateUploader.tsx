'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

interface TemplateUploaderProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
    disabled?: boolean;
}

export default function TemplateUploader({ file, onFileChange, disabled }: TemplateUploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700">Template-Bild oder PDF hochladen</label>

            {!file ? (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !disabled && inputRef.current?.click()}
                    className={`relative h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
                        ${dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf"
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <div className="p-4 bg-indigo-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-indigo-600" />
                    </div>
                    <p className="text-gray-600 font-semibold">Klicken oder Datei hierher ziehen</p>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG oder PDF (max. 10MB)</p>
                </div>
            ) : (
                <div className="relative p-6 border border-indigo-100 bg-indigo-50/30 rounded-3xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            {file.type.includes('pdf') ? (
                                <FileText className="w-6 h-6 text-red-500" />
                            ) : (
                                <ImageIcon className="w-6 h-6 text-indigo-500" />
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm truncate max-w-[200px]">{file.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onFileChange(null)}
                        disabled={disabled}
                        className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
