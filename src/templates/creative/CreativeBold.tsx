import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Star } from 'lucide-react';

/**
 * Creative Bold Template
 * Asymmetric layout with gradients and card design
 * ✅ FIXED: Aligned with actual ResumeData schema
 */

export default function CreativeBold({ data }: { data: ResumeData }) {
  return (
    <div className="w-[794px] h-[1123px] bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl" />

      <div className="relative">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-6 shadow-xl">
          <h1 className="text-4xl font-bold mb-2">
            {data.personal.firstName} {data.personal.lastName}
          </h1>
          {data.personal.title && (
            <div className="text-lg text-purple-100 mb-3">{data.personal.title}</div>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            {data.personal.email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{data.personal.email}</span>
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
          </div>
        </div>

        {/* Summary Card */}
        {data.personal.summary && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
              Über mich
            </h2>
            <p className="text-gray-700 leading-relaxed">{data.personal.summary}</p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Experience & Education */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                  Erfahrung
                </h2>

                <div className="space-y-4">
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-purple-400 pl-4">
                      <div className="font-bold text-gray-900">{exp.title}</div>
                      <div className="text-sm font-medium text-purple-600">
                        {exp.company}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {exp.startDate} - {exp.endDate || 'Heute'}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-700">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                  Bildung
                </h2>

                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="font-bold text-gray-900">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                      </div>
                      <div className="text-sm text-purple-600">{edu.school}</div>
                      <div className="text-xs text-gray-500">
                        {edu.startDate} - {edu.endDate || 'Heute'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Skills & Languages */}
          <div className="space-y-6">
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl p-6 text-white shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2" fill="currentColor" />
                  Skills
                </h2>

                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                  Sprachen
                </h2>

                <div className="space-y-2">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{lang.language}</span>
                      <span className="text-xs text-gray-500">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
