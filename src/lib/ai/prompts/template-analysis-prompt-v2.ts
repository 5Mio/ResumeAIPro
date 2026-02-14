/**
 * UPDATED AI PROMPT - Version 2.0
 *
 * Inkludiert:
 * - Neues Schema (Foto, Skill-Levels, Social Media)
 * - data.design Integration (KEINE hardcoded styles!)
 * - Konkrete Code-Beispiele
 * - OpenAI & Anthropic optimiert
 */

export const getTemplateAnalysisPromptV2 = (config: any) => `
You are an expert React/TypeScript developer specializing in ResumeAI Pro templates.

Your task: Analyze the uploaded resume template image and generate an IDENTICAL React component.

TARGET AUDIENCE: ${config.targetAudience === 'jobseeker' ? 'Professional job seekers' : 'Students and entry-level'}
CATEGORY: ${config.category}
TEMPLATE NAME: ${config.name}

═══════════════════════════════════════════════════════════════
CRITICAL: OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

YOU MUST OUTPUT **ONLY** RAW TYPESCRIPT CODE.

❌ WRONG (DON'T DO THIS):
\`\`\`tsx
import { ResumeData } from '@/types/resume';
...
\`\`\`

✅ CORRECT (DO THIS):
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin } from 'lucide-react';
...

NO markdown blocks, NO explanations, NO text before/after.
START IMMEDIATELY with: import { ResumeData } from '@/types/resume';

═══════════════════════════════════════════════════════════════
CRITICAL: SCHEMA COMPLIANCE
═══════════════════════════════════════════════════════════════

USE THESE EXACT FIELD NAMES:

✅ CORRECT:
- data.personal.firstName
- data.personal.lastName
- data.personal.title
- data.personal.email
- data.personal.phone
- data.personal.location
- data.personal.summary
- data.personal.photo (optional - URL string)

- exp.title (NOT exp.position!)
- exp.company
- exp.startDate
- exp.endDate
- exp.description

- edu.school (NOT edu.institution!)
- edu.degree
- edu.field
- edu.startDate
- edu.endDate

- data.skills as Array<{ name: string, level: number, category?: string }>
- data.languages as Array<{ language: string, level: string }>

- data.social?.linkedin
- data.social?.github
- data.social?.twitter
- data.social?.instagram
- data.social?.wechat

- data.interests (optional string array)

❌ WRONG (DON'T USE):
- data.personalInfo
- exp.position
- edu.institution
- skills as string[]

═══════════════════════════════════════════════════════════════
CRITICAL: DESIGN SYSTEM INTEGRATION
═══════════════════════════════════════════════════════════════

YOU MUST USE data.design PROPERTIES - NO HARDCODED STYLES!

✅ CORRECT APPROACH:

import { TemplateProps } from '../types';
import { defaultResumeDesign } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

export default function ${toPascalCase(config.name)}({ data }: TemplateProps) {
    // 1. Extract design with fallback
    const design = data.design || defaultResumeDesign;
    const { colors, typography, layout } = design;

    // 2. Define reusable styles
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
        color: colors.primary
    };

    const h2Style = {
        fontSize: \`\${typography.fontSize.h2}pt\`,
        fontFamily: typography.fontFamily.heading,
        fontWeight: 'bold',
        color: colors.primary,
        borderBottom: \`2px solid \${colors.accent}\`,
        paddingBottom: '4pt',
        marginBottom: \`\${layout.spacing.item}pt\`
    };

    return (
        <div style={containerStyle}>
            {/* Your template layout here */}
        </div>
    );
}

❌ WRONG (DON'T DO THIS):
<div className="bg-blue-600 text-white p-8">  // Hardcoded!
<h1 className="text-3xl font-bold">           // Hardcoded!

═══════════════════════════════════════════════════════════════
NEW FEATURES YOU MUST SUPPORT
═══════════════════════════════════════════════════════════════

1. PHOTO SUPPORT (if visible in template image):

{data.personal.photo && (
    <img
        src={data.personal.photo}
        alt={\`\${data.personal.firstName} \${data.personal.lastName}\`}
        style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: \`2px solid \${colors.primary}\`
        }}
    />
)}

2. SKILLS WITH LEVEL BARS:

{data.skills.map((skill, idx) => (
    <div key={idx} style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontWeight: '600' }}>{skill.name}</span>
            <span style={{ fontSize: \`\${typography.fontSize.small}pt\`, opacity: 0.7 }}>
                {skill.level}%
            </span>
        </div>
        <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: colors.background,
            border: \`1px solid \${colors.primary}\`,
            borderRadius: '4px',
            overflow: 'hidden'
        }}>
            <div style={{
                width: \`\${skill.level}%\`,
                height: '100%',
                backgroundColor: colors.accent,
                transition: 'width 0.3s'
            }} />
        </div>
    </div>
))}

3. SOCIAL MEDIA ICONS:

{data.social && (
    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        {data.social.linkedin && (
            <a href={data.social.linkedin} style={{ color: colors.primary }}>
                <Linkedin size={20} />
            </a>
        )}
        {data.social.github && (
            <a href={data.social.github} style={{ color: colors.primary }}>
                <Github size={20} />
            </a>
        )}
    </div>
)}

4. INTERESTS/HOBBIES:

{data.interests && data.interests.length > 0 && (
    <section>
        <h2 style={h2Style}>Interests</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {data.interests.map((interest, idx) => (
                <span
                    key={idx}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: colors.accent + '20',
                        color: colors.primary,
                        borderRadius: '12px',
                        fontSize: \`\${typography.fontSize.small}pt\`
                    }}
                >
                    {interest}
                </span>
            ))}
        </div>
    </section>
)}

═══════════════════════════════════════════════════════════════
TECHNICAL REQUIREMENTS
═══════════════════════════════════════════════════════════════

✅ MUST DO:
1. Import TemplateProps from '../types'
2. Import defaultResumeDesign from '@/types/resume'
3. Use \`const design = data.design || defaultResumeDesign;\`
4. A4 format: width: 794px, minHeight: 1123px
5. All measurements in 'pt' (not px!)
6. Use lucide-react for icons
7. Conditional rendering with && for optional fields
8. All styles must be inline style objects (NOT className with Tailwind)

❌ MUST NOT:
1. Use hardcoded Tailwind classes for colors/fonts/sizes
2. Use className="bg-blue-600" or similar
3. Use className="text-3xl" or similar
4. Forget to import TemplateProps or defaultResumeDesign
5. Use data.personalInfo (use data.personal!)

═══════════════════════════════════════════════════════════════
STRUCTURE TEMPLATE
═══════════════════════════════════════════════════════════════

import { TemplateProps } from '../types';
import { defaultResumeDesign } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Briefcase, GraduationCap } from 'lucide-react';

export default function ${toPascalCase(config.name)}({ data }: TemplateProps) {
    const design = data.design || defaultResumeDesign;
    const { colors, typography, layout } = design;

    const containerStyle = { /* ... */ };
    const h1Style = { /* ... */ };
    const h2Style = { /* ... */ };

    return (
        <div style={containerStyle}>
            {/* Header with optional photo */}
            <header>
                {data.personal.photo && <img src={data.personal.photo} alt="Profile" style={{...}} />}
                <h1 style={h1Style}>{data.personal.firstName} {data.personal.lastName}</h1>
                {data.personal.title && <p>{data.personal.title}</p>}
            </header>

            {/* Contact */}
            <div>
                {data.personal.email && <div><Mail size={14} /> {data.personal.email}</div>}
                {data.personal.phone && <div><Phone size={14} /> {data.personal.phone}</div>}
                {data.personal.location && <div><MapPin size={14} /> {data.personal.location}</div>}
            </div>

            {/* Summary */}
            {data.personal.summary && (
                <section>
                    <h2 style={h2Style}>Profile</h2>
                    <p style={{ whiteSpace: 'pre-line' }}>{data.personal.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section>
                    <h2 style={h2Style}>Experience</h2>
                    {data.experience.map((exp) => (
                        <div key={exp.id}>
                            <h3>{exp.title}</h3>
                            <div>{exp.company}</div>
                            <div>{exp.startDate} - {exp.endDate || 'Present'}</div>
                            <p>{exp.description}</p>
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section>
                    <h2 style={h2Style}>Education</h2>
                    {data.education.map((edu) => (
                        <div key={edu.id}>
                            <h3>{edu.degree} in {edu.field}</h3>
                            <div>{edu.school}</div>
                            <div>{edu.startDate} - {edu.endDate}</div>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills with level bars */}
            {data.skills.length > 0 && (
                <section>
                    <h2 style={h2Style}>Skills</h2>
                    {/* Use skill bar code from above */}
                </section>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
                <section>
                    <h2 style={h2Style}>Languages</h2>
                    {data.languages.map((lang, idx) => (
                        <div key={idx}>{lang.language}: {lang.level}</div>
                    ))}
                </section>
            )}

            {/* Social Media */}
            {data.social && (
                <div>
                    {/* Use social icons code from above */}
                </div>
            )}

            {/* Interests */}
            {data.interests && data.interests.length > 0 && (
                <section>
                    {/* Use interests code from above */}
                </section>
            )}
        </div>
    );
}

═══════════════════════════════════════════════════════════════
FINAL REMINDER
═══════════════════════════════════════════════════════════════

OUTPUT ONLY RAW TYPESCRIPT CODE.
NO markdown formatting (\`\`\`tsx).
NO explanations.
NO text before or after the code.

START YOUR RESPONSE WITH:
import { TemplateProps } from '../types';

NOW GENERATE THE TEMPLATE CODE:
`;

function toPascalCase(str: string): string {
    return str
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/^[a-z]/, (chr) => chr.toUpperCase());
}
