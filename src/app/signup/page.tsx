'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { signUp } from '@/app/auth/actions'; // Server action
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = await signUp(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else if (result?.message) {
            setSuccess(true);
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <Card variant="default" className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Bestätigung gesendet!</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Bitte überprüfe deine E-Mails, um dein Konto zu bestätigen.
                        </p>
                        <Link href="/login">
                            <Button variant="primary" className="w-full">
                                Zum Login
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Zurück zur Startseite
                    </Link>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Konto erstellen
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Oder{' '}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            melde dich an
                        </Link>
                    </p>
                </div>

                <Card variant="default" className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form action={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Vollständiger Name"
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            required
                            placeholder="Max Mustermann"
                        />

                        <Input
                            label="E-Mail Adresse"
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="max@beispiel.de"
                        />

                        <Input
                            label="Passwort"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            placeholder="Mindestens 8 Zeichen"
                        />

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full flex justify-center"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Registrieren
                            </Button>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            Mit der Registrierung stimmst du unseren{' '}
                            <a href="#" className="underline">Nutzungsbedingungen</a> und der{' '}
                            <a href="#" className="underline">Datenschutzerklärung</a> zu.
                        </p>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Oder weiter mit
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button variant="outline" className="w-full">
                                Google
                            </Button>
                            <Button variant="outline" className="w-full">
                                GitHub
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
