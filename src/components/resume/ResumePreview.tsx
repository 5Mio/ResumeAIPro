import { MapPin, Mail, Phone, Link as LinkIcon, Calendar, GraduationCap, Briefcase } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { TemplateLoader } from '@/lib/templates/template-loader';

interface ResumePreviewProps {
    data: ResumeData;
    id?: string;
}

export default function ResumePreview({ data, id = 'resume-preview' }: ResumePreviewProps) {
    // 1. Check if a custom template is selected
    const selectedTemplate = data.design?.template ? TemplateLoader.getTemplateById(data.design.template) : null;

    if (selectedTemplate && selectedTemplate.component) {
        const TemplateComponent = selectedTemplate.component;
        return <TemplateComponent data={data} />;
    }

    // 2. Default design fallback if no custom template is active
    const design = data.design || {
        layout: {
            margins: { top: 20, right: 20, bottom: 20, left: 20 },
            columns: 1,
            columnDistribution: '70/30',
            spacing: { section: 16, item: 8, paragraph: 4 }
        },
        typography: {
            fontFamily: { body: 'ui-sans-serif, system-ui, sans-serif', heading: 'ui-sans-serif, system-ui, sans-serif' },
            fontSize: { h1: 24, h2: 18, h3: 14, body: 11, small: 9 },
            lineHeight: 1.5
        },
        colors: {
            primary: '#000000',
            text: '#1F2937',
            background: '#FFFFFF',
            accent: '#3B82F6'
        }
    };

    // Construct dynamic styles
    const containerStyle = {
        paddingTop: `${design.layout.margins.top}mm`,
        paddingRight: `${design.layout.margins.right}mm`,
        paddingBottom: `${design.layout.margins.bottom}mm`,
        paddingLeft: `${design.layout.margins.left}mm`,
        fontFamily: design.typography.fontFamily.body,
        color: design.colors.text,
        backgroundColor: design.colors.background,
        lineHeight: design.typography.lineHeight,
        fontSize: `${design.typography.fontSize.body}pt`
    };

    const headingStyle = {
        fontFamily: design.typography.fontFamily.heading,
        color: design.colors.primary,
        fontSize: `${design.typography.fontSize.h1}pt`,
    };

    const sectionTitleStyle = {
        fontFamily: design.typography.fontFamily.heading,
        color: design.colors.primary,
        fontSize: `${design.typography.fontSize.h2}pt`,
        borderColor: design.colors.accent,
        marginBottom: `${design.layout.spacing.section / 2}pt`,
        paddingBottom: '4pt'
    };

    const subTitleStyle = {
        fontSize: `${design.typography.fontSize.h3}pt`,
        marginBottom: `${design.layout.spacing.item / 2}pt`
    };

    const smallTextStyle = {
        fontSize: `${design.typography.fontSize.small}pt`,
        color: '#6B7280'
    };

    return (
        <div id={id} style={containerStyle} className="w-[210mm] min-h-[297mm] shadow-lg mx-auto text-sm leading-normal transition-all duration-300 ease-in-out box-border">
            {/* Header */}
            <header className="border-b-2" style={{ borderColor: design.colors.primary, marginBottom: `${design.layout.spacing.section}pt`, paddingBottom: '16pt' }}>
                <h1 className="font-bold uppercase tracking-wider mb-2" style={headingStyle}>
                    {data.personal.firstName} {data.personal.lastName}
                </h1>
                <p className="font-medium mb-4" style={{ fontSize: `${design.typography.fontSize.h2}pt`, color: '#4B5563' }}>{data.personal.title}</p>

                {data.personal.address && (
                    <div className="mb-2 text-xs text-gray-500 font-mono">
                        {data.personal.address}
                    </div>
                )}

                <div className="flex flex-wrap gap-4" style={smallTextStyle}>
                    {data.personal.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{data.personal.email}</span>
                        </div>
                    )}
                    {data.personal.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{data.personal.phone}</span>
                        </div>
                    )}
                    {data.personal.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{data.personal.location}</span>
                        </div>
                    )}
                    {data.personal.website && (
                        <div className="flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" />
                            <span>{data.personal.website}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Content Body */}
            <div className="space-y-6">

                {/* Summary */}
                {data.personal.summary && (
                    <section style={{ marginBottom: `${design.layout.spacing.section}pt` }}>
                        <h2 className="font-bold uppercase border-b" style={sectionTitleStyle}>
                            Profil
                        </h2>
                        <p className="leading-relaxed whitespace-pre-line">
                            {data.personal.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section style={{ marginBottom: `${design.layout.spacing.section}pt` }}>
                        <h2 className="font-bold uppercase border-b" style={sectionTitleStyle}>
                            Berufserfahrung
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: `${design.layout.spacing.item}pt` }}>
                            {data.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold" style={{ color: '#111827', ...subTitleStyle }}>{exp.title}</h3>
                                        <span style={smallTextStyle}>
                                            {exp.startDate} - {exp.endDate || 'Heute'}
                                        </span>
                                    </div>
                                    <div className="font-medium mb-1" style={{ color: '#374151' }}>{exp.company}</div>
                                    <p className="whitespace-pre-line leading-relaxed" style={{ marginBottom: `${design.layout.spacing.paragraph}pt` }}>
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section style={{ marginBottom: `${design.layout.spacing.section}pt` }}>
                        <h2 className="font-bold uppercase border-b" style={sectionTitleStyle}>
                            Ausbildung
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: `${design.layout.spacing.item}pt` }}>
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold" style={{ color: '#111827', ...subTitleStyle }}>{edu.degree} in {edu.field}</h3>
                                        <span style={smallTextStyle}>
                                            {edu.startDate} - {edu.endDate}
                                        </span>
                                    </div>
                                    <div className="text-gray-700">{edu.school}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Activities (Projects & Engagement) */}
                {data.activities && data.activities.length > 0 && (
                    <section style={{ marginBottom: `${design.layout.spacing.section}pt` }}>
                        <h2 className="font-bold uppercase border-b" style={sectionTitleStyle}>
                            Projekte & Engagement
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: `${design.layout.spacing.item}pt` }}>
                            {data.activities.map((act) => (
                                <div key={act.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold" style={{ color: '#111827', ...subTitleStyle }}>{act.title}</h3>
                                        <div className="font-medium" style={{ color: '#374151' }}>{act.organization}</div>
                                    </div>
                                    <p className="whitespace-pre-line leading-relaxed" style={{ marginBottom: `${design.layout.spacing.paragraph}pt` }}>
                                        {act.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills & Languages Grid if 2-columns were implemented, simplified here for robustness */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Skills */}
                    {data.skills.length > 0 && (
                        <section>
                            <h2 className="font-bold uppercase border-b" style={sectionTitleStyle}>
                                Fähigkeiten
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 rounded text-xs font-medium"
                                        style={{ backgroundColor: design.colors.accent + '20', color: design.colors.primary }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages */}
                    {data.languages.length > 0 && (
                        <section>
                            <h2 className="font-bold uppercase border-b" style={sectionTitleStyle}>
                                Sprachen
                            </h2>
                            <ul className="space-y-1">
                                {data.languages.map((lang, index) => (
                                    <li key={index} className="flex justify-between text-xs">
                                        <span className="font-medium">{lang.language}</span>
                                        <span style={{ color: '#6B7280' }}>{lang.level}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
