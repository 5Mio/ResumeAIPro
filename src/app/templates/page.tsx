import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FileText, Briefcase, Code, Heart, GraduationCap, Palette } from 'lucide-react';

export default function TemplatesPage() {
    const categories = [
        {
            icon: Briefcase,
            name: 'Business & Management',
            count: 120,
            description: 'Professionelle Vorlagen für Führungskräfte und Manager'
        },
        {
            icon: Code,
            name: 'IT & Tech',
            count: 95,
            description: 'Moderne Templates für Entwickler und IT-Profis'
        },
        {
            icon: Palette,
            name: 'Kreativ & Design',
            count: 85,
            description: 'Kreative Vorlagen für Designer und Künstler'
        },
        {
            icon: Heart,
            name: 'Gesundheit & Pflege',
            count: 60,
            description: 'Spezialisierte Templates für medizinische Berufe'
        },
        {
            icon: GraduationCap,
            name: 'Bildung & Wissenschaft',
            count: 70,
            description: 'Akademische Vorlagen für Lehrer und Forscher'
        },
        {
            icon: FileText,
            name: 'Allgemein',
            count: 70,
            description: 'Vielseitige Templates für alle Branchen'
        }
    ];

    const templates = [
        {
            name: 'Modern Professional',
            category: 'Business',
            color: 'from-blue-500 to-blue-700',
            popular: true
        },
        {
            name: 'Creative Portfolio',
            category: 'Kreativ',
            color: 'from-purple-500 to-pink-600',
            popular: true
        },
        {
            name: 'Tech Minimalist',
            category: 'IT',
            color: 'from-gray-700 to-gray-900',
            popular: false
        },
        {
            name: 'Executive Elite',
            category: 'Management',
            color: 'from-indigo-600 to-purple-700',
            popular: true
        },
        {
            name: 'Academic Classic',
            category: 'Bildung',
            color: 'from-green-600 to-teal-600',
            popular: false
        },
        {
            name: 'Healthcare Pro',
            category: 'Gesundheit',
            color: 'from-red-500 to-pink-600',
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        500+ <span className="text-gradient">Professionelle Templates</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Wähle aus unserer riesigen Auswahl an professionell gestalteten Lebenslauf-Vorlagen.
                        Für jede Branche, jeden Stil und jede Karrierestufe.
                    </p>
                    <Link href="/signup">
                        <Button variant="primary" size="lg">
                            Alle Templates ansehen
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Categories */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Nach Branche filtern
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Finde die perfekte Vorlage für deine Branche
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <Card key={index} variant="hover">
                                    <div className="flex flex-col items-start">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                            <Icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                                        <p className="text-gray-600 mb-4">{category.description}</p>
                                        <p className="text-sm text-blue-600 font-semibold">{category.count} Templates</p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Template Showcase */}
            <section className="py-20 md:py-32 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Beliebte Templates
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Die am häufigsten verwendeten Vorlagen unserer Nutzer
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((template, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105">
                                    {template.popular && (
                                        <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                                            Beliebt
                                        </div>
                                    )}
                                    <div className={`aspect-[3/4] bg-gradient-to-br ${template.color} p-8 flex flex-col justify-between`}>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-white/30 rounded w-3/4"></div>
                                            <div className="h-3 bg-white/30 rounded w-1/2"></div>
                                            <div className="h-2 bg-white/20 rounded w-full mt-4"></div>
                                            <div className="h-2 bg-white/20 rounded w-5/6"></div>
                                            <div className="h-2 bg-white/20 rounded w-4/6"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 bg-white/20 rounded w-full"></div>
                                            <div className="h-2 bg-white/20 rounded w-5/6"></div>
                                            <div className="h-2 bg-white/20 rounded w-4/6"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">{template.name}</h3>
                                    <p className="text-sm text-gray-600">{template.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/signup">
                            <Button variant="primary" size="lg">
                                Alle 500+ Templates ansehen
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Warum unsere Templates?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">ATS-Optimiert</h3>
                            <p className="text-gray-600">
                                Alle Templates sind für Applicant Tracking Systems optimiert
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Palette className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Anpassbar</h3>
                            <p className="text-gray-600">
                                Farben, Schriftarten und Layouts vollständig anpassbar
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <GraduationCap className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Professionell</h3>
                            <p className="text-gray-600">
                                Von Experten designt und von Recruitern empfohlen
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Finde dein perfektes Template
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Starte jetzt und erstelle deinen professionellen Lebenslauf
                    </p>
                    <Link href="/signup">
                        <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                            Kostenlos starten
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
