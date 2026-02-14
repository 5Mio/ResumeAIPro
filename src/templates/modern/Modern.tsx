import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export default function Modern({ data }: TemplateProps) {
  const { personal, experience, education, skills, languages, design } = data;

  return (
    <div
      className="flex flex-col h-full min-h-screen"
      style={{
        fontFamily: design.typography.fontFamily.body,
        color: design.colors.text,
        backgroundColor: design.colors.background,
      }}
    >
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-gray-50 p-8 border-r border-gray-100">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: design.colors.primary, fontFamily: design.typography.fontFamily.heading }}>
              {personal.firstName} {personal.lastName}
            </h1>
            <p className="text-lg font-bold text-gray-600">{personal.title}</p>
          </div>

          <p className="text-sm leading-relaxed text-gray-500 mb-8">{personal.summary}</p>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Kontakt</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              {personal.phone}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              {personal.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              {personal.location}
            </div>
            {personal.website && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Globe className="w-4 h-4 text-gray-400" />
                {personal.website}
              </div>
            )}
          </div>

          <div className="mt-12">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600 shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Sprachen</h3>
            <div className="space-y-3">
              {languages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-700">{lang.language}</span>
                  <span className="text-xs text-gray-400 uppercase font-black tracking-widest">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 p-10 bg-white">
          <section className="mb-12">
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3" style={{ color: design.colors.primary }}>
              <span className="w-8 h-1" style={{ backgroundColor: design.colors.primary }} />
              Berufserfahrung
            </h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white bg-indigo-500 shadow-sm" style={{ backgroundColor: design.colors.primary }} />
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{exp.title}</h4>
                      <p className="text-sm font-bold text-gray-500">{exp.company}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {exp.startDate} - {exp.endDate || 'Heute'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3" style={{ color: design.colors.primary }}>
              <span className="w-8 h-1" style={{ backgroundColor: design.colors.primary }} />
              Ausbildung
            </h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                    <p className="text-sm font-bold text-gray-500">{edu.school}</p>
                    <p className="text-xs text-gray-400 mt-1">{edu.field}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}