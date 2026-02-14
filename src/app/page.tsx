import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Sparkles, FileText, Zap, Download, CheckCircle, Star, GraduationCap, Briefcase } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: 'KI-Optimierung',
      description: 'Intelligente Vorschläge für bessere Formulierungen und optimale Struktur.',
    },
    {
      icon: FileText,
      title: '500+ Templates',
      description: 'Professionelle Vorlagen für jede Branche und Karrierestufe.',
    },
    {
      icon: Zap,
      title: 'ATS-Optimiert',
      description: 'Dein Lebenslauf wird von Bewerbungssystemen garantiert erkannt.',
    },
    {
      icon: Download,
      title: 'PDF/DOCX Export',
      description: 'Exportiere deinen Lebenslauf in allen gängigen Formaten.',
    },
    {
      icon: CheckCircle,
      title: 'Live-Editor',
      description: 'Sieh Änderungen in Echtzeit und bearbeite direkt im Browser.',
    },
    {
      icon: FileText,
      title: 'Anschreiben-Generator',
      description: 'Erstelle passende Anschreiben mit KI-Unterstützung.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Template wählen',
      description: 'Wähle aus über 500 professionellen Vorlagen die perfekte für dich aus.',
    },
    {
      number: '02',
      title: 'Daten eingeben',
      description: 'Fülle deine Informationen aus oder importiere deinen bestehenden Lebenslauf.',
    },
    {
      number: '03',
      title: 'Exportieren',
      description: 'Lade deinen perfekten Lebenslauf als PDF oder DOCX herunter.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Marketing Manager',
      content: 'Die perfekte CV-Optimierung hat mir den Job gebracht! Absolut empfehlenswert.',
      rating: 5,
    },
    {
      name: 'Michael K.',
      role: 'Software Developer',
      content: 'Schnell, einfach und professionell. Genau das, was ich gesucht habe.',
      rating: 5,
    },
    {
      name: 'Lisa T.',
      role: 'Projektmanagerin',
      content: 'KI-Optimierung hat meine Bewerbung auf ein neues Level gehoben!',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '0€',
      period: 'für immer',
      features: [
        '3 Lebensläufe',
        'Basis Templates',
        'PDF Export',
        'Community Support',
      ],
      cta: 'Kostenlos starten',
      variant: 'outline' as const,
    },
    {
      name: 'Pro',
      price: '9,99€',
      period: 'pro Monat',
      features: [
        'Unbegrenzte Lebensläufe',
        'Alle 500+ Templates',
        'PDF & DOCX Export',
        'KI-Optimierung',
        'Anschreiben-Generator',
        'Priority Support',
      ],
      cta: 'Pro werden',
      variant: 'primary' as const,
      featured: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Jetzt mit KI-Analyse & Optimierung
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Dein perfekter Lebenslauf - <span className="text-gradient">In Minuten erstellt</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Wähle deinen Karriere-Status für ein maßgeschneidertes Erlebnis:
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/dashboard/student/editor/new" className="flex-1">
                  <div className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 cursor-pointer h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <GraduationCap className="w-16 h-16 text-blue-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-gray-900">Schüler & Student</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Optimiert für Praktika, Ausbildung und den ersten Job.
                    </p>
                    <div className="mt-4 text-blue-600 text-sm font-medium group-hover:underline">
                      Jetzt starten →
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard/editor/new" className="flex-1">
                  <div className="group relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-purple-100 cursor-pointer h-full">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Briefcase className="w-16 h-16 text-purple-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-gray-900">Berufstätig</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Für Fachkräfte, Experten und Führungskräfte.
                    </p>
                    <div className="mt-4 text-purple-600 text-sm font-medium group-hover:underline">
                      Jetzt starten →
                    </div>
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Kostenlos testen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>In 5 Minuten fertig</span>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right hidden lg:block">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                {/* Abstract visualization of CV creation */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
                <div className="relative z-10 text-center p-8 bg-white rounded-xl shadow-lg max-w-xs">
                  <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="font-bold text-gray-900 mb-2">KI-Analyse aktiv</h3>
                  <p className="text-sm text-gray-500">
                    Wir passen den Editor automatisch an deine Karrierestufe an.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Alles, was du brauchst
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professionelle Tools für den perfekten Lebenslauf
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
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

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              So einfach geht's
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              In nur 3 Schritten zum perfekten Lebenslauf
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Was unsere Nutzer sagen
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tausende zufriedene Kunden vertrauen auf ResumeAI
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="default">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Einfache Preise
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Wähle den Plan, der zu dir passt
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} variant={plan.featured ? 'featured' : 'default'}>
                {plan.featured && (
                  <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    Beliebt
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant={plan.variant} size="lg" className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Bereit für deinen Traumjob?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Erstelle jetzt deinen professionellen Lebenslauf und hebe dich von der Masse ab.
          </p>
          <Link href="/signup">
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Kostenlos starten
            </Button>
          </Link>
          <p className="mt-4 text-sm opacity-75">Keine Kreditkarte erforderlich • In 5 Minuten fertig</p>
        </div>
      </section>
    </div>
  );
}
