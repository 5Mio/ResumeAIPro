'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { signIn } from '@/app/auth/actions'; // Server action we just created
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const result = await signIn(formData);

        // If we get here, it means there was an error (success redirects)
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // If success, the redirect happens on server side
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
                        Willkommen zurück
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Oder{' '}
                        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            registriere dich kostenlos
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
                            autoComplete="current-password"
                            required
                            placeholder="••••••••"
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Angemeldet bleiben
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Passwort vergessen?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full flex justify-center"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Anmelden
                            </Button>
                        </div>
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
