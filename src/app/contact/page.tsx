import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        Wir sind <span className="text-gradient">für dich da</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Hast du Fragen, Feedback oder brauchst Hilfe? Unser Team steht dir gerne zur Verfügung.
                    </p>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Schreib uns eine Nachricht</h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Vorname"
                                        type="text"
                                        placeholder="Max"
                                        required
                                    />
                                    <Input
                                        label="Nachname"
                                        type="text"
                                        placeholder="Mustermann"
                                        required
                                    />
                                </div>

                                <Input
                                    label="E-Mail"
                                    type="email"
                                    placeholder="max@beispiel.de"
                                    required
                                />

                                <Input
                                    label="Telefon (optional)"
                                    type="tel"
                                    placeholder="+49 123 456789"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Betreff
                                    </label>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option>Allgemeine Anfrage</option>
                                        <option>Technischer Support</option>
                                        <option>Feedback</option>
                                        <option>Enterprise Anfrage</option>
                                        <option>Partnerschaft</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nachricht *
                                    </label>
                                    <textarea
                                        rows={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Wie können wir dir helfen?"
                                        required
                                    ></textarea>
                                </div>

                                <Button variant="primary" size="lg" className="w-full">
                                    Nachricht senden
                                </Button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Kontaktinformationen</h2>
                                <p className="text-gray-600 mb-8">
                                    Du kannst uns auch direkt über folgende Kanäle erreichen:
                                </p>
                            </div>

                            <div className="space-y-6">
                                <Card variant="default">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">E-Mail</h3>
                                            <p className="text-gray-600">support@resumeai.de</p>
                                            <p className="text-sm text-gray-500 mt-1">Wir antworten innerhalb von 24 Stunden</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card variant="default">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Telefon</h3>
                                            <p className="text-gray-600">+49 (0) 30 1234 5678</p>
                                            <p className="text-sm text-gray-500 mt-1">Mo-Fr: 9:00 - 18:00 Uhr</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card variant="default">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Adresse</h3>
                                            <p className="text-gray-600">
                                                ResumeAI GmbH<br />
                                                Musterstraße 123<br />
                                                10115 Berlin, Deutschland
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                <Card variant="default">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Öffnungszeiten</h3>
                                            <p className="text-gray-600">
                                                Montag - Freitag: 9:00 - 18:00 Uhr<br />
                                                Samstag - Sonntag: Geschlossen
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Teaser */}
            <section className="py-20 md:py-32 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Häufig gestellte Fragen
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Vielleicht findest du deine Antwort bereits in unseren FAQs
                    </p>
                    <Button variant="outline" size="lg">
                        Zu den FAQs
                    </Button>
                </div>
            </section>
        </div>
    );
}
