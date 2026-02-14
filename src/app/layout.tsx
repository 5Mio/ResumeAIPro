import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'ResumeAI - KI Lebenslauf erstellen | 500+ Templates',
  description: 'Erstelle professionelle Lebensläufe mit KI-Unterstützung in wenigen Minuten. ATS-optimiert, 500+ Templates, PDF/DOCX Export.',
  keywords: 'lebenslauf erstellen, cv generator, bewerbung, ki lebenslauf, resume builder',
  authors: [{ name: 'ResumeAI' }],
  openGraph: {
    type: 'website',
    url: 'https://resumeai.de/',
    title: 'ResumeAI - KI-gestützte Lebenslauf-Erstellung',
    description: 'Erstellen Sie professionelle Lebensläufe mit KI-Unterstützung',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ResumeAI',
      },
    ],
    locale: 'de_DE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">
        <Header />
        <main className="pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
