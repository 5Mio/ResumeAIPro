import { TemplateProps } from '../types';
import { defaultResumeDesign } from '@/types/resume';
import { Mail, Phone, MapPin, Star } from 'lucide-react';

export default function CreativeBold({ data }: TemplateProps) {
  const design = data.design || defaultResumeDesign;
  const { colors, typography, layout } = design;

  // Helper: Lightness for gradients
  const lightenColor = (color: string, amount: number) => {
    // Simple hex color lightener
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) & 0xff) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const containerStyle = {
    width: '794px',
    minHeight: '1123px',
    background: `linear-gradient(135deg, ${lightenColor(colors.primary, 240)}, ${lightenColor(colors.accent, 230)})`,
    color: colors.text,
    fontFamily: typography.fontFamily.body,
    fontSize: `${typography.fontSize.body}pt`,
    lineHeight: typography.lineHeight,
    padding: `${layout.margins.top}pt ${layout.margins.right}pt ${layout.margins.bottom}pt ${layout.margins.left}pt`
  };

  const cardStyle = {
    backgroundColor: colors.background,
    borderRadius: '16px',
    padding: '24px',
    marginBottom: `${layout.spacing.section}pt`,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const headerCardStyle = {
    ...cardStyle,
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
    color: colors.background,
    textAlign: 'center' as const
  };

  const h1Style = {
    fontSize: `${typography.fontSize.h1}pt`,
    fontFamily: typography.fontFamily.heading,
    fontWeight: 'bold',
    marginBottom: `${layout.spacing.item}pt`
  };

  const h2Style = {
    fontSize: `${typography.fontSize.h2}pt`,
    fontFamily: typography.fontFamily.heading,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: `${layout.spacing.item}pt`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const h3Style = {
    fontSize: `${typography.fontSize.h3}pt`,
    fontFamily: typography.fontFamily.heading,
    fontWeight: '600',
    marginBottom: `${layout.spacing.paragraph}pt`
  };

  const smallTextStyle = {
    fontSize: `${typography.fontSize.small}pt`,
    opacity: 0.7
  };

  return (
    <div style={containerStyle}>
      {/* Header Card */}
      <div style={headerCardStyle}>
        <h1 style={h1Style}>
          {data.personal.firstName} {data.personal.lastName}
        </h1>
        {data.personal.title && (
          <p style={{
            fontSize: `${typography.fontSize.h3}pt`,
            fontWeight: '500',
            marginBottom: '16pt',
            opacity: 0.9
          }}>
            {data.personal.title}
          </p>
        )}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          fontSize: `${typography.fontSize.small}pt`
        }}>
          {data.personal.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={12} />
              <span>{data.personal.email}</span>
            </div>
          )}
          {data.personal.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={12} />
              <span>{data.personal.phone}</span>
            </div>
          )}
          {data.personal.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={12} />
              <span>{data.personal.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile */}
      {data.personal.summary && (
        <div style={cardStyle}>
          <h2 style={h2Style}>
            <Star size={18} color={colors.accent} />
            Profil
          </h2>
          <p style={{ whiteSpace: 'pre-line', lineHeight: typography.lineHeight }}>
            {data.personal.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={cardStyle}>
          <h2 style={h2Style}>Berufserfahrung</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${layout.spacing.item}pt` }}>
            {data.experience.map((exp) => (
              <div
                key={exp.id}
                style={{
                  paddingLeft: '16px',
                  borderLeft: `3px solid ${colors.accent}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4pt' }}>
                  <h3 style={h3Style}>{exp.title}</h3>
                  <span style={smallTextStyle}>
                    {exp.startDate} - {exp.endDate || 'Heute'}
                  </span>
                </div>
                <div style={{
                  fontWeight: '600',
                  color: colors.primary,
                  marginBottom: '4pt'
                }}>
                  {exp.company}
                </div>
                <p style={{ whiteSpace: 'pre-line', lineHeight: typography.lineHeight }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div style={cardStyle}>
          <h2 style={h2Style}>Ausbildung</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${layout.spacing.item}pt` }}>
            {data.education.map((edu) => (
              <div
                key={edu.id}
                style={{
                  paddingLeft: '16px',
                  borderLeft: `3px solid ${colors.accent}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4pt' }}>
                  <h3 style={h3Style}>{edu.degree} in {edu.field}</h3>
                  <span style={smallTextStyle}>
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div style={{ opacity: 0.7 }}>{edu.school}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
