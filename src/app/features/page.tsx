import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Sparkles, FileText, Zap, Download, CheckCircle, Brain, Globe, Shield, Clock, Users, Award } from 'lucide-react';

export default function FeaturesPage() {
    const mainFeatures = [
        {
            icon: Brain,
            title: 'KI-gestützte Optimierung',
            description: 'Unsere fortschrittliche KI analysiert deinen Lebenslauf und gibt dir intelligente Vorschläge für bessere Formulierungen, optimale Struktur und wirkungsvolle Beschreibungen.',
            benefits: [
                'Automatische Verbesserungsvorschläge',
                'Branchenspezifische Optimierung',
                'Keyword-Optimierung für ATS',
                'Grammatik- und Stilprüfung'
            ]
        },
        {
            icon: FileText,
            title: '500+ Professionelle Templates',
            description: 'Wähle aus über 500 professionell gestalteten Vorlagen für jede Branche, Karrierestufe und persönlichen Stil.',
            benefits: [
                'Moderne und klassische Designs',
                'Branchenspezifische Vorlagen',
                'Anpassbare Farbschemata',
                'Ein- und mehrspaltige Layouts'
            ]
        },
        {
            icon: Zap,
            title: 'ATS-Optimierung',
            description: 'Dein Lebenslauf wird garantiert von Applicant Tracking Systems (ATS) erkannt und korrekt geparst.',
            benefits: [
                '95%+ ATS-Kompatibilität',
                'Optimierte Formatierung',
                'Keyword-Analyse',
                'Strukturierte Datenfelder'
            ]
        },
        {
            icon: Download,
            title: 'Flexible Export-Optionen',
            description: 'Exportiere deinen Lebenslauf in verschiedenen Formaten und passe ihn für unterschiedliche Bewerbungen an.',
            benefits: [
                'PDF Export (hochauflösend)',
                'DOCX Export (editierbar)',
                'Online-Link zum Teilen',
                'Druckoptimierte Version'
            ]
        },
        {
            icon: Globe,
            title: 'Mehrsprachige Unterstützung',
            description: 'Erstelle Lebensläufe in mehreren Sprachen und erreiche internationale Arbeitgeber.',
            benefits: [
                'Deutsch, Englisch, Französisch',
                'Automatische Übersetzung',
                'Kulturspezifische Anpassungen',
                'Lokalisierte Vorlagen'
            ]
        },
        {
            icon: Shield,
            title: 'Datenschutz & Sicherheit',
            description: 'Deine Daten sind bei uns sicher. DSGVO-konform und mit modernsten Sicherheitsstandards.',
            benefits: [
                'Ende-zu-Ende-Verschlüsselung',
                'DSGVO-konform',
                'Keine Weitergabe an Dritte',
                'Regelmäßige Backups'
            ]
        }
    ];

    const additionalFeatures = [
        { icon: Clock, title: 'Echtzeit-Vorschau', description: 'Sieh alle Änderungen sofort in der Live-Vorschau' },
        { icon: Users, title: 'Anschreiben-Generator', description: 'Erstelle passende Anschreiben mit KI-Unterstützung' },
        { icon: Award, title: 'Bewerbungsmanager', description: 'Verwalte alle deine Bewerbungen an einem Ort' },
        { icon: CheckCircle, title: 'Rechtschreibprüfung', description: 'Automatische Korrektur von Rechtschreib- und Grammatikfehlern' },
        { icon: Sparkles, title: 'Smart Suggestions', description: 'Intelligente Vorschläge basierend auf deiner Branche' },
        { icon: FileText, title: 'Import-Funktion', description: 'Importiere bestehende Lebensläufe (PDF, DOCX, LinkedIn)' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        Alle Features für deinen <span className="text-gradient">perfekten Lebenslauf</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        ResumeAI bietet dir alle Tools, die du brauchst, um einen professionellen,
                        ATS-optimierten Lebenslauf zu erstellen, der dich von der Masse abhebt.
                    </p>
                    <Link href="/signup">
                        <Button variant="primary" size="lg">
                            Kostenlos starten
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Main Features */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-20">
                        {mainFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <div key={index} className={`grid md:grid-cols-2 gap-12 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                                    <div className={isEven ? '' : 'md:order-2'}>
                                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                            <Icon className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{feature.title}</h2>
                                        <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                                        <ul className="space-y-3">
                                            {feature.benefits.map((benefit, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className={isEven ? '' : 'md:order-1'}>
                                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-xl flex items-center justify-center">
                                            <Icon className="w-32 h-32 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Additional Features Grid */}
            <section className="py-20 md:py-32 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Und noch viel mehr...
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Entdecke alle Features, die ResumeAI zu deinem perfekten Bewerbungshelfer machen
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {additionalFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={index} variant="hover">
                                    <div className="flex flex-col items-start">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                            <Icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Bereit, loszulegen?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Erstelle jetzt deinen professionellen Lebenslauf mit allen Features
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                                Kostenlos starten
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                                Preise ansehen
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
