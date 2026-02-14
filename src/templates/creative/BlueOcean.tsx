import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Instagram, Linkedin, Facebook } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export default function BlueOcean({ data }: TemplateProps) {
  const { personal, experience, education, skills, design } = data;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Heute';
    return new Date(dateString).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col md:flex-row bg-white h-full min-h-[297mm]" style={{ fontFamily: design?.typography?.fontFamily?.body || 'sans-serif' }}>
      <div className="bg-blue-900 text-white p-8 md:w-1/3 shrink-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider">{personal.firstName} <br />{personal.lastName}</h1>
          <p className="text-blue-200 uppercase tracking-widest text-sm">{personal.title}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 opacity-90">
            <Phone className="w-4 h-4 text-blue-300" />
            <span className="text-sm">{personal.phone}</span>
          </div>
          <div className="flex items-center space-x-3 opacity-90">
            <Mail className="w-4 h-4 text-blue-300" />
            <span className="text-sm break-all">{personal.email}</span>
          </div>
          {personal.website && (
            <div className="flex items-center space-x-3 opacity-90">
              <Globe className="w-4 h-4 text-blue-300" />
              <span className="text-sm break-all">{personal.website}</span>
            </div>
          )}
          {personal.location && (
            <div className="flex items-center space-x-3 opacity-90">
              <MapPin className="w-4 h-4 text-blue-300" />
              <span className="text-sm">{personal.location}</span>
            </div>
          )}
        </div>

        {personal.address && (
          <div className="mt-8">
            <h2 className="text-lg font-bold border-b border-blue-700 pb-2 mb-3 tracking-widest text-blue-100">ADRESSE</h2>
            <p className="text-sm opacity-90 leading-relaxed">{personal.address}</p>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold border-b border-blue-700 pb-2 mb-4 tracking-widest text-blue-100">KOMPETENZEN</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-blue-800 text-white text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-8 md:w-2/3 flex-col bg-white">
        {personal.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-900 pb-2 mb-4 uppercase tracking-wider">Profil</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{personal.summary}</p>
          </div>
        )}

        {experience && experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-900 pb-2 mb-6 uppercase tracking-wider">Erfahrung</h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-blue-100">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-900"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800">{exp.title}</h3>
                    <span className="text-xs text-blue-600 font-medium whitespace-nowrap ml-2">
                      {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-500 mb-2">{exp.company}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-900 pb-2 mb-6 uppercase tracking-wider">Ausbildung</h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-blue-100">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-900"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-800">{edu.school}</h3>
                    <span className="text-xs text-blue-600 font-medium whitespace-nowrap ml-2">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{edu.degree}</span>
                    {edu.field && <span className="text-gray-500"> • {edu.field}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}