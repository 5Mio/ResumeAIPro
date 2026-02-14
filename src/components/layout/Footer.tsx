import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Footer() {
    const footerLinks = {
        produkt: [
            { name: 'Features', href: '/features' },
            { name: 'Preise', href: '/pricing' },
            { name: 'Vorlagen', href: '/templates' },
            { name: 'Beispiele', href: '/examples' },
        ],
        ressourcen: [
            { name: 'Blog', href: '/blog' },
            { name: 'FAQ', href: '/faq' },
            { name: 'Anleitungen', href: '/guides' },
            { name: 'Support', href: '/support' },
        ],
        unternehmen: [
            { name: 'Über uns', href: '/about' },
            { name: 'Karriere', href: '/careers' },
            { name: 'Kontakt', href: '/contact' },
            { name: 'Partner', href: '/partners' },
        ],
        legal: [
            { name: 'Impressum', href: '/impressum' },
            { name: 'Datenschutz', href: '/privacy' },
            { name: 'AGB', href: '/terms' },
            { name: 'Cookie-Richtlinie', href: '/cookies' },
        ],
    };

    const socialLinks = [
        { name: 'Facebook', icon: Facebook, href: '#' },
        { name: 'Twitter', icon: Twitter, href: '#' },
        { name: 'LinkedIn', icon: Linkedin, href: '#' },
        { name: 'Instagram', icon: Instagram, href: '#' },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                            <span className="text-2xl font-bold">ResumeAI</span>
                        </Link>
                        <p className="text-gray-400 text-sm mb-6">
                            Erstelle professionelle Lebensläufe mit KI-Unterstützung in wenigen Minuten.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                                        aria-label={social.name}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Produkt */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Produkt</h3>
                        <ul className="space-y-3">
                            {footerLinks.produkt.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ressourcen */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Ressourcen</h3>
                        <ul className="space-y-3">
                            {footerLinks.ressourcen.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Unternehmen */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Unternehmen</h3>
                        <ul className="space-y-3">
                            {footerLinks.unternehmen.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-gray-800 pt-8 mb-8">
                    <div className="max-w-md">
                        <h3 className="font-semibold text-lg mb-2">Newsletter abonnieren</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Erhalte Tipps und Updates direkt in dein Postfach.
                        </p>
                        <form className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="deine@email.de"
                                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                            />
                            <Button variant="primary" size="md">
                                Abonnieren
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} ResumeAI. Alle Rechte vorbehalten.</p>
                </div>
            </div>
        </footer>
    );
}
