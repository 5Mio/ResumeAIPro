import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { CheckCircle, X } from 'lucide-react';

export default function PricingPage() {
    const plans = [
        {
            name: 'Free',
            price: '0€',
            period: 'für immer kostenlos',
            description: 'Perfekt zum Ausprobieren und für gelegentliche Bewerbungen',
            features: [
                { name: '3 Lebensläufe erstellen', included: true },
                { name: 'Zugriff auf 50 Basis-Templates', included: true },
                { name: 'PDF Export', included: true },
                { name: 'Grundlegende Formatierung', included: true },
                { name: 'Community Support', included: true },
                { name: 'KI-Optimierung', included: false },
                { name: 'DOCX Export', included: false },
                { name: 'Alle Premium Templates', included: false },
                { name: 'Anschreiben-Generator', included: false },
                { name: 'Priority Support', included: false },
            ],
            cta: 'Kostenlos starten',
            variant: 'outline' as const,
            popular: false
        },
        {
            name: 'Pro',
            price: '9,99€',
            period: 'pro Monat',
            description: 'Für ernsthafte Bewerber, die das Beste aus ihrem Lebenslauf herausholen wollen',
            features: [
                { name: 'Unbegrenzte Lebensläufe', included: true },
                { name: 'Alle 500+ Premium Templates', included: true },
                { name: 'PDF & DOCX Export', included: true },
                { name: 'KI-Optimierung & Vorschläge', included: true },
                { name: 'Anschreiben-Generator', included: true },
                { name: 'ATS-Optimierung', included: true },
                { name: 'Mehrsprachige Unterstützung', included: true },
                { name: 'Bewerbungsmanager', included: true },
                { name: 'Priority Support (24h)', included: true },
                { name: 'Keine Wasserzeichen', included: true },
            ],
            cta: 'Pro werden',
            variant: 'primary' as const,
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Individuell',
            period: 'auf Anfrage',
            description: 'Für Teams und Unternehmen mit speziellen Anforderungen',
            features: [
                { name: 'Alles aus Pro', included: true },
                { name: 'Unbegrenzte Team-Mitglieder', included: true },
                { name: 'Custom Branding', included: true },
                { name: 'API-Zugang', included: true },
                { name: 'Dedizierter Account Manager', included: true },
                { name: 'SLA-Garantie', included: true },
                { name: 'On-Premise Option', included: true },
                { name: 'Custom Integrationen', included: true },
                { name: 'Schulungen & Workshops', included: true },
                { name: 'Individuelle Rechnungsstellung', included: true },
            ],
            cta: 'Kontakt aufnehmen',
            variant: 'outline' as const,
            popular: false
        }
    ];

    const faqs = [
        {
            question: 'Kann ich jederzeit kündigen?',
            answer: 'Ja, du kannst dein Pro-Abo jederzeit kündigen. Es gibt keine Mindestlaufzeit oder versteckte Kosten.'
        },
        {
            question: 'Was passiert mit meinen Daten nach der Kündigung?',
            answer: 'Deine Daten bleiben für 30 Tage nach der Kündigung gespeichert. Danach werden sie automatisch gelöscht, es sei denn, du reaktivierst dein Konto.'
        },
        {
            question: 'Gibt es eine Geld-zurück-Garantie?',
            answer: 'Ja, wir bieten eine 14-Tage-Geld-zurück-Garantie. Wenn du nicht zufrieden bist, erstatten wir dir den vollen Betrag.'
        },
        {
            question: 'Kann ich zwischen den Plänen wechseln?',
            answer: 'Ja, du kannst jederzeit upgraden oder downgraden. Bei einem Upgrade wird der Differenzbetrag anteilig berechnet.'
        },
        {
            question: 'Welche Zahlungsmethoden werden akzeptiert?',
            answer: 'Wir akzeptieren alle gängigen Kreditkarten (Visa, Mastercard, American Express), PayPal und SEPA-Lastschrift.'
        },
        {
            question: 'Gibt es Rabatte für Studenten oder Non-Profit-Organisationen?',
            answer: 'Ja, wir bieten 50% Rabatt für Studenten und gemeinnützige Organisationen. Kontaktiere uns für weitere Informationen.'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        Einfache, <span className="text-gradient">transparente Preise</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Wähle den Plan, der zu dir passt. Keine versteckten Kosten, keine Überraschungen.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        14 Tage Geld-zurück-Garantie
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {plans.map((plan, index) => (
                            <Card key={index} variant={plan.popular ? 'featured' : 'default'} className="relative">
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            Beliebt
                                        </div>
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="mb-4">
                                        <span className="text-5xl font-extrabold">{plan.price}</span>
                                        {plan.price !== 'Individuell' && <span className="text-gray-600 ml-2">/ Monat</span>}
                                    </div>
                                    <p className="text-sm text-gray-600">{plan.period}</p>
                                    <p className="text-gray-700 mt-4">{plan.description}</p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            {feature.included ? (
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                            )}
                                            <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                                                {feature.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href={plan.name === 'Enterprise' ? '/contact' : '/signup'}>
                                    <Button variant={plan.variant} size="lg" className="w-full">
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 md:py-32 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Häufig gestellte Fragen
                        </h2>
                        <p className="text-xl text-gray-600">
                            Alles, was du über unsere Preise wissen musst
                        </p>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <Card key={index} variant="default">
                                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Noch Fragen?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                        Unser Support-Team hilft dir gerne weiter
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/contact">
                            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                                Kontakt aufnehmen
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                                Kostenlos testen
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
