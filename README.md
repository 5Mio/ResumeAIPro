# ResumeAI Pro 🚀

ResumeAI Pro ist eine hochmoderne, KI-gestützte Plattform zur Erstellung von Lebensläufen. Mit Hilfe von Anthropic Claude und OpenAI GPT-4 hilft die Anwendung Nutzern dabei, professionelle, ATS-optimierte Lebensläufe in kürzester Zeit zu erstellen.

## ✨ Features

- **🤖 KI-Vollanalyse**: Umfassende Analyse des Lebenslaufs in 7 Kategorien (Grammatik, Stil, ATS-Kompatibilität, Quantifizierung etc.).
- **⚡ One-Click Apply**: KI-Vorschläge können mit einem Klick direkt in den Editor übernommen werden.
- **🎨 Profi-Design Editor**: Vollständige Kontrolle über Layout, Abstände, Typografie und Farbschemata.
- **📄 Multi-Format Import**: Importiere vorhandene Lebensläufe als PDF oder DOCX.
- **📥 Hochwertiger PDF-Export**: Generiere druckfertige PDFs direkt im Browser.
- **🔐 Sicherer Cloud-Speicher**: Lebensläufe werden sicher in Supabase gespeichert und sind jederzeit abrufbar.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **KI**: Anthropic Claude 3.5 Sonnet, OpenAI GPT-4 Turbo
- **Utilities**: jsPDF, html2canvas, Mammoth (DOCX parsing)

## 🚀 Setup & Installation

1.  **Repository klonen**:
    ```bash
    git clone [repository-url]
    cd resumeai-pro
    ```

2.  **Abhängigkeiten installieren**:
    ```bash
    npm install
    ```

3.  **Umgebungsvariablen konfigurieren**:
    Erstelle eine `.env.local` Datei im Stammverzeichnis mit folgenden Werten:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=deine_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=dein_anon_key
    ANTHROPIC_API_KEY=dein_anthropic_key
    OPENAI_API_KEY=dein_openai_key
    ```

4.  **Entwicklungsserver starten**:
    ```bash
    npm run dev
    ```

## 📐 Architektur

Das Projekt folgt einer sauberen Trennung von Verantwortlichkeiten:
- `/src/app`: Next.js App Router Pfade und API-Endpunkte.
- `/src/components`: Wiederverwendbare UI-Komponenten und fachliche Komponenten (Editor, Preview).
- `/src/hooks`: Custom React Hooks für KI-Logik und State.
- `/src/lib`: Hilfsfunktionen für PDF-Erstellung, Supabase-Client und API-Wrapper.
- `/src/types`: Zentrale TypeScript-Definitionen für konsistente Datenstrukturen.

---
Entwickelt mit ❤️ für moderne Karrierewege.
