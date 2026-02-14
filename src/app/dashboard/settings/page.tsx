import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { User, Bell, CreditCard, Shield, Trash2 } from 'lucide-react';

export default function SettingsPage() {
    const sections = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
        { id: 'billing', label: 'Abrechnung', icon: CreditCard },
        { id: 'security', label: 'Sicherheit', icon: Shield },
    ];

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Einstellungen</h1>
                <p className="text-gray-600">Verwalte dein Konto und deine Präferenzen</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card variant="default">
                        <nav className="space-y-1">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Icon className="w-5 h-5 text-gray-500" />
                                        <span className="font-medium text-gray-700">{section.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </Card>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Profile Section */}
                    <Card variant="default">
                        <h2 className="text-xl font-semibold mb-6">Profil</h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <Button variant="outline" size="sm">Foto ändern</Button>
                                    <p className="text-xs text-gray-500 mt-2">JPG, PNG oder GIF (max. 2MB)</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Vorname"
                                    type="text"
                                    defaultValue="Max"
                                />
                                <Input
                                    label="Nachname"
                                    type="text"
                                    defaultValue="Mustermann"
                                />
                            </div>

                            <Input
                                label="E-Mail"
                                type="email"
                                defaultValue="max@beispiel.de"
                            />

                            <Input
                                label="Telefon"
                                type="tel"
                                defaultValue="+49 123 456789"
                            />

                            <div className="flex justify-end">
                                <Button variant="primary">Änderungen speichern</Button>
                            </div>
                        </div>
                    </Card>

                    {/* Notifications */}
                    <Card variant="default">
                        <h2 className="text-xl font-semibold mb-6">Benachrichtigungen</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-900">E-Mail Benachrichtigungen</p>
                                    <p className="text-sm text-gray-500">Erhalte Updates per E-Mail</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-900">Marketing E-Mails</p>
                                    <p className="text-sm text-gray-500">Tipps und Neuigkeiten</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </Card>

                    {/* Billing */}
                    <Card variant="default">
                        <h2 className="text-xl font-semibold mb-6">Abrechnung</h2>
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-blue-900">Pro Plan</p>
                                        <p className="text-sm text-blue-700">9,99€ / Monat</p>
                                    </div>
                                    <Button variant="outline" size="sm">Plan ändern</Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Zahlungsmethode</h3>
                                <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-8 h-8 text-gray-400" />
                                        <div>
                                            <p className="font-medium">•••• •••• •••• 4242</p>
                                            <p className="text-sm text-gray-500">Läuft ab 12/2025</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Bearbeiten</Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Rechnungshistorie</h3>
                                <div className="space-y-2">
                                    {[
                                        { date: '01.02.2024', amount: '9,99€', status: 'Bezahlt' },
                                        { date: '01.01.2024', amount: '9,99€', status: 'Bezahlt' },
                                        { date: '01.12.2023', amount: '9,99€', status: 'Bezahlt' },
                                    ].map((invoice, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
                                            <div>
                                                <p className="font-medium text-gray-900">{invoice.date}</p>
                                                <p className="text-sm text-gray-500">{invoice.amount}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-green-600">{invoice.status}</span>
                                                <Button variant="ghost" size="sm">Download</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Security */}
                    <Card variant="default">
                        <h2 className="text-xl font-semibold mb-6">Sicherheit</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Passwort ändern</h3>
                                <div className="space-y-4">
                                    <Input
                                        label="Aktuelles Passwort"
                                        type="password"
                                    />
                                    <Input
                                        label="Neues Passwort"
                                        type="password"
                                    />
                                    <Input
                                        label="Passwort bestätigen"
                                        type="password"
                                    />
                                    <Button variant="primary">Passwort aktualisieren</Button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="font-medium text-gray-900 mb-3 text-red-600">Gefahrenzone</h3>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-red-900">Konto löschen</p>
                                            <p className="text-sm text-red-700 mt-1">
                                                Diese Aktion kann nicht rückgängig gemacht werden
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Konto löschen
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
