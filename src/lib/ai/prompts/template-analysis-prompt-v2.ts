export const getTemplateAnalysisPrompt = (config: any) => `
Du bist ein erstklassiger React-Entwickler, spezialisiert auf ResumeAI Pro Templates.

ZIELGRUPPE: ${config.targetAudience === 'jobseeker' ? 'Erfahrene Berufstätige' : 'Schüler und Studenten'}
KATEGORIE: ${config.category}
NAME: ${config.name}

═══════════════════════════════════════════════════════════════
KRITISCH: SCHEMA-KONFORMITÄT
═══════════════════════════════════════════════════════════════

Du MUSST diese exakten Field-Namen verwenden:

**RICHTIG:**
- ✅ data.personal.firstName
- ✅ data.personal.photo (URL zum Foto - optional)
- ✅ exp.title (NICHT exp.position!)
- ✅ edu.school (NICHT edu.institution!)
- ✅ data.skills als Array<{ name: string, level: number, category?: string }>
- ✅ data.social?.linkedin, data.social?.github, data.social?.wechat
- ✅ data.interests (optional)

**FALSCH:**
- ❌ data.personalInfo
- ❌ exp.position
- ❌ edu.institution
- ❌ skills als string[]

═══════════════════════════════════════════════════════════════
KRITISCH: DESIGN SYSTEM INTEGRATION
═══════════════════════════════════════════════════════════════

Du MUSST data.design Properties verwenden - KEINE hardcoded Tailwind classes!

**RICHTIG:**
\`\`\`tsx
const design = data.design || defaultResumeDesign;

<div style={{
    backgroundColor: design.colors.primary,
    color: design.colors.background,
    padding: \`\${design.layout.margins.top}pt\`,
    fontFamily: design.typography.fontFamily.body
}}>
    <h1 style={{
        fontSize: \`\${design.typography.fontSize.h1}pt\`,
        fontFamily: design.typography.fontFamily.heading,
        color: design.colors.primary
    }}>
        {data.personal.firstName} {data.personal.lastName}
    </h1>
</div>
\`\`\`

**FALSCH:**
\`\`\`tsx
<div className="bg-blue-600 text-white p-8">  // ❌ Hardcoded!
    <h1 className="text-3xl font-bold">       // ❌ Hardcoded!
        {data.personal.firstName}
    </h1>
</div>
\`\`\`

═══════════════════════════════════════════════════════════════
NEUE FEATURES
═══════════════════════════════════════════════════════════════

**1. FOTO SUPPORT (wenn im Template-Bild vorhanden):**
\`\`\`tsx
{data.personal.photo && (
    <img
        src={data.personal.photo}
        alt={\`\${data.personal.firstName} \${data.personal.lastName}\`}
        style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: \`2px solid \${design.colors.primary}\`
        }}
    />
)}
\`\`\`

**2. SKILLS MIT LEVEL-BARS:**
\`\`\`tsx
{data.skills.map((skill, idx) => (
    <div key={idx} style={{ marginBottom: '12px' }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px'
        }}>
            <span style={{
                fontWeight: '600',
                fontSize: \`\${design.typography.fontSize.body}pt\`
            }}>
                {skill.name}
            </span>
            <span style={{
                fontSize: \`\${design.typography.fontSize.small}pt\`,
                opacity: 0.7
            }}>
                {skill.level}%
            </span>
        </div>
        <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: design.colors.background,
            border: \`1px solid \${design.colors.primary}\`,
            borderRadius: '4px',
            overflow: 'hidden'
        }}>
            <div style={{
                width: \`\${skill.level}%\`,
                height: '100%',
                backgroundColor: design.colors.accent,
                transition: 'width 0.3s ease'
            }} />
        </div>
    </div>
))}
\`\`\`

**3. SOCIAL MEDIA ICONS:**
\`\`\`tsx
import { Linkedin, Github, Twitter, Instagram } from 'lucide-react';

{data.social && (
    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        {data.social.linkedin && (
            <a
                href={data.social.linkedin}
                style={{ color: design.colors.primary }}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Linkedin size={20} />
            </a>
        )}
        {data.social.github && (
            <a
                href={data.social.github}
                style={{ color: design.colors.primary }}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Github size={20} />
            </a>
        )}
        {data.social.wechat && (
            <div style={{
                fontSize: \`\${design.typography.fontSize.small}pt\`,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }}>
                <MessageCircle size={16} />
                <span>{data.social.wechat}</span>
            </div>
        )}
    </div>
)}
\`\`\`

**4. INTERESTS/HOBBIES:**
\`\`\`tsx
{data.interests && data.interests.length > 0 && (
    <section style={{ marginBottom: \`\${design.layout.spacing.section}pt\` }}>
        <h2 style={{
            fontSize: \`\${design.typography.fontSize.h2}pt\`,
            fontFamily: design.typography.fontFamily.heading,
            color: design.colors.primary,
            marginBottom: \`\${design.layout.spacing.item}pt\`
        }}>
            Interessen
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {data.interests.map((interest, idx) => (
                <span
                    key={idx}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: design.colors.accent + '20',
                        color: design.colors.primary,
                        borderRadius: '12px',
                        fontSize: \`\${design.typography.fontSize.small}pt\`
                    }}
                >
                    {interest}
                </span>
            ))}
        </div>
    </section>
)}
\`\`\`

═══════════════════════════════════════════════════════════════
TECHNISCHE ANFORDERUNGEN
═══════════════════════════════════════════════════════════════

1. ✅ Import \`defaultResumeDesign\` from '@/types/resume'
2. ✅ Verwende IMMER: \`const design = data.design || defaultResumeDesign;\`
3. ✅ A4-Format: width: 794px, minHeight: 1123px
4. ✅ Alle Abstände in \`pt\` (nicht px!)
5. ✅ Conditional Rendering mit \`&&\` für optionale Felder
6. ✅ Icons von 'lucide-react'
7. ❌ KEINE hardcoded Tailwind classes für Farben/Fonts
8. ❌ KEINE hardcoded Größen/Abstände

═══════════════════════════════════════════════════════════════
CODE-STRUKTUR
═══════════════════════════════════════════════════════════════

\`\`\`tsx
import { TemplateProps } from '../types';
import { defaultResumeDesign } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

export default function ${toPascalCase(config.name)}({ data }: TemplateProps) {
    // 1. Design mit Fallback
    const design = data.design || defaultResumeDesign;
    const { colors, typography, layout } = design;

    // 2. Helper Styles
    const containerStyle = {
        width: '794px',
        minHeight: '1123px',
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: typography.fontFamily.body,
        fontSize: \`\${typography.fontSize.body}pt\`,
        lineHeight: typography.lineHeight,
        padding: \`\${layout.margins.top}pt \${layout.margins.right}pt \${layout.margins.bottom}pt \${layout.margins.left}pt\`
    };

    const h1Style = {
        fontSize: \`\${typography.fontSize.h1}pt\`,
        fontFamily: typography.fontFamily.heading,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: \`\${layout.spacing.section}pt\`
    };

    const h2Style = {
        fontSize: \`\${typography.fontSize.h2}pt\`,
        fontFamily: typography.fontFamily.heading,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: \`\${layout.spacing.item}pt\`,
        borderBottom: \`2px solid \${colors.accent}\`,
        paddingBottom: '4pt'
    };

    // 3. Template Rendering
    return (
        <div style={containerStyle}>
            {/* Implementiere Template-spezifisches Layout hier */}
        </div>
    );
}
\`\`\`

═══════════════════════════════════════════════════════════════
ANTWORT-FORMAT
═══════════════════════════════════════════════════════════════

ANTWORTE NUR MIT DEM REINEN TSX-CODE.
KEIN MARKDOWN (\`\`\`tsx), KEIN TEXT DAVOR ODER DANACH.
NUR DER PURE CODE!
`;

function toPascalCase(str: string): string {
    return str
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[a-z]/, (chr) => chr.toUpperCase());
}
