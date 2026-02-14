import { TemplateProps } from '../types';
import { defaultResumeDesign } from '@/types/resume';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ClassicMinimal({ data }: TemplateProps) {
  const design = data.design || defaultResumeDesign;
  const { colors, typography, layout } = design;

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

  const h1Style = {
    fontSize: `${typography.fontSize.h1}pt`,
    fontFamily: typography.fontFamily.heading,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center' as const,
    marginBottom: `${layout.spacing.item}pt`
  };

  const h2Style = {
    fontSize: `${typography.fontSize.h2}pt`,
    fontFamily: typography.fontFamily.heading,
    fontWeight: 'bold',
    color: colors.primary,
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    borderBottom: `1px solid ${colors.primary}`,
    paddingBottom: '4pt',
    marginTop: `${layout.spacing.section}pt`,
    marginBottom: `${layout.spacing.item}pt`
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
    opacity: 0.6
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: `${layout.spacing.section}pt` }}>
        <h1 style={h1Style}>
          {data.personal.firstName} {data.personal.lastName}
        </h1>
        {data.personal.title && (
          <p style={{
            fontSize: `${typography.fontSize.h3}pt`,
            color: colors.text,
            opacity: 0.7,
            marginBottom: '12pt'
          }}>
            {data.personal.title}
          </p>
        )}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          fontSize: `${typography.fontSize.small}pt`
        }}>
          {data.personal.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={10} />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={10} />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={10} />
              <span>{data.personal.location}</span>
            </div>
          )}
        </div>
      </header>

      {/* Profile */}
      {data.personal.summary && (
        <section>
          <h2 style={h2Style}>Profil</h2>
          <p style={{ whiteSpace: 'pre-line', lineHeight: typography.lineHeight }}>
            {data.personal.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section>
          <h2 style={h2Style}>Berufserfahrung</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${layout.spacing.item}pt` }}>
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4pt' }}>
                  <h3 style={h3Style}>{exp.title}</h3>
                  <span style={smallTextStyle}>
                    {exp.startDate} - {exp.endDate || 'Heute'}
                  </span>
                </div>
                <div style={{ fontWeight: '600', marginBottom: '4pt' }}>
                  {exp.company}
                </div>
                <p style={{ whiteSpace: 'pre-line', lineHeight: typography.lineHeight }}>
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
          <h2 style={h2Style}>Ausbildung</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${layout.spacing.item}pt` }}>
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4pt' }}>
                  <h3 style={h3Style}>{edu.degree} in {edu.field}</h3>
                  <span style={smallTextStyle}>
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div style={{ color: colors.text, opacity: 0.7 }}>
                  {edu.school}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Languages */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: `${layout.spacing.section}pt`,
        marginTop: `${layout.spacing.section}pt`
      }}>
        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 style={{ ...h2Style, marginTop: 0 }}>Fähigkeiten</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    padding: '4px 12px',
                    border: `1px solid ${colors.primary}`,
                    borderRadius: '4px',
                    fontSize: `${typography.fontSize.small}pt`,
                    color: colors.primary
                  }}
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
            <h2 style={{ ...h2Style, marginTop: 0 }}>Sprachen</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.languages.map((lang, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600' }}>{lang.language}</span>
                  <span style={smallTextStyle}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
