import { TargetAudience } from '@/types/ai-types';

/**
 * Prompt Engineering for AI Template Generation
 * Separate prompts for Jobseeker vs Student templates
 *
 * ✅ FIXED: Updated to match actual ResumeData schema
 */

export function getTemplateAnalysisPrompt(targetAudience: TargetAudience): string {
  const basePrompt = `You are an expert frontend developer specializing in creating professional resume templates using React, TypeScript, and Tailwind CSS.

**CRITICAL REQUIREMENTS:**
1. Analyze the provided template image and create a SIMILAR but ORIGINAL interpretation
2. DO NOT copy the exact design - create your own version inspired by the layout
3. Use only Tailwind CSS utility classes (NO custom CSS)
4. Component must accept ResumeData as props
5. Must be A4 format (210mm x 297mm = 794px x 1123px at 96 DPI)
6. Export as default function
7. Use lucide-react for icons
8. Ensure text is fully editable (no hardcoded content)
9. Responsive and print-optimized

**IMPORTANT: Use EXACTLY this TypeScript Interface:**
interface ResumeData {
  id?: string;
  title: string;
  personal: {
    firstName: string;
    lastName: string;
    title: string;         // Job title or role
    email: string;
    phone: string;
    location: string;
    address?: string;
    summary: string;        // Professional summary
    website?: string;
  };
  experience: Array<{
    id: string;
    title: string;          // ❗ Use "title" (NOT "position")
    company: string;
    startDate: string;
    endDate?: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    field: string;
    school: string;         // ❗ Use "school" (NOT "institution")
    startDate: string;
    endDate: string;
  }>;
  skills: string[];         // ❗ Simple string array (NOT objects!)
  languages: Array<{
    language: string;       // ❗ Use "language" (NOT "name")
    level: string;
  }>;
}

**CRITICAL: Field Names**
- ✅ data.personal (NOT data.personalInfo)
- ✅ exp.title (NOT exp.position)
- ✅ edu.school (NOT edu.institution)
- ✅ skills as string[] (NOT objects with id/name/level)
- ✅ lang.language (NOT lang.name)

**Example Usage:**
// ✅ CORRECT
<h1>{data.personal.firstName}</h1>
<div>{exp.title} at {exp.company}</div>
<div>{edu.degree} at {edu.school}</div>
{data.skills.map((skill, i) => <span key={i}>{skill}</span>)}
{data.languages.map((lang, i) => <div key={i}>{lang.language}: {lang.level}</div>)}

// ❌ WRONG
<h1>{data.personalInfo.firstName}</h1>  // Wrong: personalInfo
<div>{exp.position}</div>                // Wrong: position
<div>{edu.institution}</div>             // Wrong: institution
{data.skills.map(s => s.name)}           // Wrong: skills is string[]
{data.languages.map(l => l.name)}        // Wrong: use lang.language
`;

  const audienceSpecific = {
    jobseeker: `
**TARGET AUDIENCE: Job Seekers (Professionals)**
- Focus on professional experience and skills
- Emphasize career progression
- Highlight technical and soft skills
- Modern, business-appropriate design
- Use professional color schemes (blues, grays, blacks)
- Clear hierarchy for experience section
- Include space for certifications/achievements

**DESIGN PRINCIPLES:**
- Clean, scannable layout for ATS systems
- Professional typography (Inter, Roboto, or similar)
- Strategic use of color for emphasis
- Clear section separation
- Easy-to-read font sizes (10-12pt body, 14-16pt headings)`,

    student: `
**TARGET AUDIENCE: Students (Schüler/Young Professionals)**
- Focus on education and potential
- Emphasize projects, internships, volunteer work
- Highlight academic achievements
- Fresh, approachable design
- Use friendly color schemes (teal, green, purple accents)
- Showcase skills and languages prominently
- Space for academic projects and extracurricular activities

**DESIGN PRINCIPLES:**
- Energetic but professional layout
- Modern typography (Poppins, Nunito, or similar)
- Creative use of color without being unprofessional
- Sections for projects, volunteer work, courses
- Approachable and confidence-inspiring design`,
  };

  return `${basePrompt}

${audienceSpecific[targetAudience]}

**OUTPUT FORMAT:**
Return ONLY the complete React component code. No explanations, no markdown formatting.

Component example structure:
import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function TemplateName({ data }: { data: ResumeData }) {
  return (
    <div className="w-[794px] h-[1123px] bg-white p-8 print:p-0">
      {/* Header */}
      <h1>{data.personal.firstName} {data.personal.lastName}</h1>
      {data.personal.title && <div>{data.personal.title}</div>}

      {/* Contact */}
      {data.personal.email && <span>{data.personal.email}</span>}

      {/* Experience */}
      {data.experience.map((exp) => (
        <div key={exp.id}>
          <div>{exp.title}</div>
          <div>{exp.company}</div>
          <div>{exp.startDate} - {exp.endDate || 'Heute'}</div>
          {exp.description && <p>{exp.description}</p>}
        </div>
      ))}

      {/* Education */}
      {data.education.map((edu) => (
        <div key={edu.id}>
          <div>{edu.degree}{edu.field && \` in \${edu.field}\`}</div>
          <div>{edu.school}</div>
        </div>
      ))}

      {/* Skills */}
      {data.skills.map((skill, index) => (
        <span key={index}>{skill}</span>
      ))}

      {/* Languages */}
      {data.languages.map((lang, index) => (
        <div key={index}>{lang.language}: {lang.level}</div>
      ))}
    </div>
  );
}

**IMPORTANT:**
- Analyze the layout, color scheme, typography, and structure
- Create your OWN interpretation (avoid copyright issues)
- Ensure all data from ResumeData props is displayed
- Use conditional rendering for optional fields (&&)
- Make it print-friendly with proper spacing
- Return ONLY the code, nothing else
- VERIFY all field names match the schema above`;
}

export function getCodeCleanupInstructions(): string {
  return `Clean the generated code:
1. Remove any markdown code blocks
2. Remove explanatory text before/after code
3. Ensure proper imports
4. Verify TypeScript syntax
5. VERIFY field names: personal, title, school, language, skills as string[]
6. Return only valid React component code`;
}
