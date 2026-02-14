import { TemplateProps } from '../types';
import { defaultResumeDesign } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap } from 'lucide-react';

export default function ModernProfessional({ data }: TemplateProps) {
  // 1. Design-Properties mit Fallback extrahieren
  const design = data.design || defaultResumeDesign;
  const { colors, typography, layout } = design;

  // 2. Häufig verwendete Styles berechnen
  const containerStyle = {
    width: '794px',
    minHeight: '1123px',
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: typography.fontFamily.body,
    fontSize: `${typography.fontSize.body}pt`,
    lineHeight: typography.lineHeight,
    padding: `${layout.margins.top}pt ${layout.margins.right}pt ${layout.margins.bottom}pt ${layout.margins.left}pt`
  };

  const sidebarStyle = {
    width: '256px',
    background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})`,
    color: colors.background,
    padding: '32px 24px'
  };

  const mainContentStyle = {
    flex: 1,
    padding: '32px 40px'
  };

  const h1Style = {
    fontSize: `${typography.fontSize.h1}pt`,
    fontFamily: typography.fontFamily.heading,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: `${layout.spacing.section}pt`
  };

  const h2Style = {
    fontSize: `${typography.fontSize.h2}pt`,
    fontFamily: typography.fontFamily.heading,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: `${layout.spacing.item}pt`,
    borderBottom: `2px solid ${colors.accent}`,
    paddingBottom: '4pt'
  };

  const h3Style = {
    fontSize: `${typography.fontSize.h3}pt`,
    fontFamily: typography.fontFamily.heading,
    fontWeight: '600',
    color: colors.text,
    marginBottom: `${layout.spacing.paragraph}pt`
  };

  const smallTextStyle = {
    fontSize: `${typography.fontSize.small}pt`,
    color: colors.text,
    opacity: 0.7
  };

  return (
    <div style={containerStyle} className="flex">
      {/* SIDEBAR */}
      <aside style={sidebarStyle}>
        {/* Header */}
        <div style={{ marginBottom: `${layout.spacing.section}pt` }}>
          <h1 style={h1Style}>
            {data.personal.firstName}
            <br />
            {data.personal.lastName}
          </h1>
          {data.personal.title && (
            <p style={{
              fontSize: `${typography.fontSize.h3}pt`,
              marginBottom: `${layout.spacing.item}pt`,
              opacity: 0.9
            }}>
              {data.personal.title}
            </p>
          )}
        </div>

        {/* Contact */}
        <div style={{
          marginBottom: `${layout.spacing.section}pt`,
          fontSize: `${typography.fontSize.small}pt`
        }}>
          {data.personal.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Mail size={12} />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Phone size={12} />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={12} />
              <span>{data.personal.location}</span>
            </div>
          )}
          {data.personal.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <Globe size={12} />
              <span>{data.personal.website}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div style={{ marginBottom: `${layout.spacing.section}pt` }}>
            <h3 style={{
              fontSize: `${typography.fontSize.h3}pt`,
              fontWeight: 'bold',
              marginBottom: `${layout.spacing.item}pt`,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Fähigkeiten
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: colors.background,
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: `${typography.fontSize.small}pt`,
                    fontWeight: '500'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div>
            <h3 style={{
              fontSize: `${typography.fontSize.h3}pt`,
              fontWeight: 'bold',
              marginBottom: `${layout.spacing.item}pt`,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Sprachen
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.languages.map((lang, index) => (
                <div key={index} style={{ fontSize: `${typography.fontSize.small}pt` }}>
                  <div style={{ fontWeight: '600' }}>{lang.language}</div>
                  <div style={{ opacity: 0.8 }}>{lang.level}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main style={mainContentStyle}>
        {/* Profile */}
        {data.personal.summary && (
          <section style={{ marginBottom: `${layout.spacing.section}pt` }}>
            <h2 style={h2Style}>Profil</h2>
            <p style={{
              whiteSpace: 'pre-line',
              lineHeight: typography.lineHeight
            }}>
              {data.personal.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section style={{ marginBottom: `${layout.spacing.section}pt` }}>
            <h2 style={{ ...h2Style, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={20} />
              Berufserfahrung
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${layout.spacing.item}pt` }}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4pt' }}>
                    <h3 style={h3Style}>{exp.title}</h3>
                    <span style={smallTextStyle}>
                      {exp.startDate} - {exp.endDate || 'Heute'}
                    </span>
                  </div>
                  <div style={{
                    fontWeight: '600',
                    color: colors.primary,
                    marginBottom: '4pt',
                    fontSize: `${typography.fontSize.body}pt`
                  }}>
                    {exp.company}
                  </div>
                  <p style={{
                    whiteSpace: 'pre-line',
                    lineHeight: typography.lineHeight
                  }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 style={{ ...h2Style, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={20} />
              Ausbildung
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${layout.spacing.item}pt` }}>
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4pt' }}>
                    <h3 style={h3Style}>{edu.degree} in {edu.field}</h3>
                    <span style={smallTextStyle}>
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div style={{
                    color: colors.text,
                    opacity: 0.8,
                    fontSize: `${typography.fontSize.body}pt`
                  }}>
                    {edu.school}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
