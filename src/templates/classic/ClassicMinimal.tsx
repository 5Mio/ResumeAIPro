import React from 'react';
import { ResumeData } from '@/types/resume';

/**
 * Classic Minimal Template
 * Conservative single-column layout
 * ✅ FIXED: Aligned with actual ResumeData schema
 */

export default function ClassicMinimal({ data }: { data: ResumeData }) {
  return (
    <div className="w-[794px] h-[1123px] bg-white p-12 print:p-8">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data.personal.firstName} {data.personal.lastName}
        </h1>
        {data.personal.title && (
          <div className="text-lg text-gray-700 mb-3">{data.personal.title}</div>
        )}

        <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {data.personal.email && <span>{data.personal.email}</span>}
          {data.personal.phone && (
            <>
              <span>•</span>
              <span>{data.personal.phone}</span>
            </>
          )}
          {data.personal.location && (
            <>
              <span>•</span>
              <span>{data.personal.location}</span>
            </>
          )}
        </div>

        {data.personal.website && (
          <div className="text-sm text-gray-600 mt-2">{data.personal.website}</div>
        )}
      </div>

      {/* Summary */}
      {data.personal.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Profil
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{data.personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Berufserfahrung
          </h2>

          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-semibold text-gray-900">{exp.title}</div>
                  <div className="text-xs text-gray-500">
                    {exp.startDate} - {exp.endDate || 'Heute'}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {exp.company}
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
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
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Ausbildung
          </h2>

          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <div className="font-semibold text-gray-900">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate || 'Heute'}
                  </div>
                </div>
                <div className="text-sm text-gray-700">{edu.school}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Languages Grid */}
      {((data.skills && data.skills.length > 0) || (data.languages && data.languages.length > 0)) && (
        <div className="grid grid-cols-2 gap-6">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
                Fähigkeiten
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm text-gray-700 px-2 py-1 bg-gray-100 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
                Sprachen
              </h2>
              <div className="space-y-1 text-sm text-gray-700">
                {data.languages.map((lang, index) => (
                  <div key={index}>
                    {lang.language} • {lang.level}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
