import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap } from 'lucide-react';

/**
 * Modern Professional Template
 * Two-column layout with colored sidebar
 * ✅ FIXED: Aligned with actual ResumeData schema
 */

export default function ModernProfessional({ data }: { data: ResumeData }) {
  return (
    <div className="w-[794px] h-[1123px] bg-white flex print:shadow-none">
      {/* Left Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 p-6 text-white flex flex-col">
        {/* Contact Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">{data.personal.firstName}</h1>
          <h1 className="text-2xl font-bold mb-4">{data.personal.lastName}</h1>
          {data.personal.title && (
            <p className="text-sm text-blue-100 mb-3">{data.personal.title}</p>
          )}

          <div className="space-y-2 text-sm">
            {data.personal.email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="truncate">{data.personal.email}</span>
              </div>
            )}
            {data.personal.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{data.personal.phone}</span>
              </div>
            )}
            {data.personal.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{data.personal.location}</span>
              </div>
            )}
            {data.personal.website && (
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span className="truncate">{data.personal.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 pb-2 border-b border-blue-400">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-blue-500 rounded-full text-xs font-medium"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3 pb-2 border-b border-blue-400">
              Sprachen
            </h2>
            <div className="space-y-2 text-sm">
              {data.languages.map((lang, index) => (
                <div key={index}>
                  <span className="font-medium">{lang.language}</span>
                  <div className="text-xs text-blue-200">{lang.level}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8">
        {/* Summary */}
        {data.personal.summary && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">{data.personal.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4 text-blue-700">
              <Briefcase className="w-5 h-5" />
              <h2 className="text-xl font-bold">Berufserfahrung</h2>
            </div>

            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-blue-200">
                  <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-1" />

                  <div className="font-semibold text-gray-900">{exp.title}</div>
                  <div className="text-sm font-medium text-blue-600">{exp.company}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {exp.startDate} - {exp.endDate || 'Heute'}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-4 text-blue-700">
              <GraduationCap className="w-5 h-5" />
              <h2 className="text-xl font-bold">Ausbildung</h2>
            </div>

            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-semibold text-gray-900">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </div>
                  <div className="text-sm font-medium text-blue-600">{edu.school}</div>
                  <div className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate || 'Heute'}
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
