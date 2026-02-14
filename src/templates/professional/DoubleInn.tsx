import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export default function DoubleInn({ data }: TemplateProps) {
  const { personal, experience, education, skills, design } = data;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Heute';
    return new Date(dateString).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-gray-100 p-8 min-h-[297mm]" style={{ fontFamily: design?.typography?.fontFamily?.body || 'sans-serif' }}>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 break-words">{personal.firstName}<br />{personal.lastName}</h1>
            <p className="text-lg text-blue-600 font-medium mt-2">{personal.title}</p>

            <div className="mt-6 space-y-3">
              {personal.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3 shrink-0" />
                  <span className="text-sm">{personal.phone}</span>
                </div>
              )}
              {personal.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3 shrink-0" />
                  <span className="text-sm break-all">{personal.email}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-3 shrink-0" />
                  <span className="text-sm break-all">{personal.website}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-3 shrink-0" />
                  <span className="text-sm">{personal.location}</span>
                </div>
              )}
            </div>
          </div>

          {skills && skills.length > 0 && (
            <div className="bg-white p-6 shadow-sm rounded-lg">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Kompetenzen</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 space-y-8">
          {personal.summary && (
            <div className="bg-white p-6 shadow-sm rounded-lg">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Profil</h2>
              <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
            </div>
          )}

          {experience && experience.length > 0 && (
            <div className="bg-white p-6 shadow-sm rounded-lg">
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Berufserfahrung</h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-blue-500"></div>
                    <h3 className="text-xl font-bold text-gray-800">{exp.title}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                      <span className="font-semibold">{exp.company}</span>
                      <span>{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div className="bg-white p-6 shadow-sm rounded-lg">
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Ausbildung</h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-blue-500"></div>
                    <h3 className="text-lg font-bold text-gray-800">{edu.school}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
                      <span>{edu.degree} {edu.field ? `• ${edu.field}` : ''}</span>
                      <span>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}