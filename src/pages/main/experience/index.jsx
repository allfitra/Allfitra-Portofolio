import React from 'react';
import { MainLayout } from '@/components/Layouts';
import { experiences } from './data/database';

export const ExperiencePage = () => {
  return (
    <MainLayout title="Experience">
      <div className="flex flex-col fade-in-up">

        {/* Header Section */}
        <div className="text-center mb-10 relative">
          <h1 className="text-5xl md:text-6xl font-black mb-1 relative z-10">
            Work <span className="text-gradient">Experience</span>.
          </h1>
          <p className="text-lg relative z-10" style={{ color: 'var(--text-secondary)' }}>
            What I have done so far in my professional journey.
          </p>
        </div>

        {/* Custom Timeline Container */}
        <div className="relative max-w-5xl mx-auto w-full px-4 sm:px-6">

          {/* Solid Vertical Line */}
          <div
            className="absolute left-[38px] md:left-1/2 top-0 bottom-0 w-[1px] transform md:-translate-x-1/2"
            style={{
              background: 'var(--glass-border)'
            }}
          ></div>

          {/* Experience Items */}
          <div className="space-y-16 md:space-y-24">
            {experiences.map((experience, index) => (
              <ExperienceCard key={index} experience={experience} index={index} />
            ))}
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

const ExperienceCard = ({ experience, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`relative flex flex-col md:flex-row items-start md:items-center justify-between group ${isEven ? 'md:flex-row-reverse' : ''}`}>

      {/* Icon Node */}
      <div
        className="absolute left-[38px] md:left-1/2 w-12 h-12 rounded-md border-2 border-[var(--glass-border)] transform -translate-x-1/2 z-10 flex items-center justify-center transition-colors duration-200 group-hover:border-[var(--accent-primary)]"
        style={{ background: 'var(--card-bg)' }}
      >
        <img
          src={experience.icon}
          alt={experience.company_name}
          className="w-7 h-7 object-contain rounded-sm"
        />
      </div>

      {/* Date floating label for Desktop */}
      <div className={`hidden md:block w-5/12 ${isEven ? 'text-right pr-56' : 'text-left pl-56'}`}>
        <span
          className="inline-block px-3.5 py-1.5 rounded text-sm font-semibold"
          style={{
            background: 'var(--card-bg)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--glass-border)',
          }}
        >
          {experience.date}
        </span>
      </div>

      {/* Content Card */}
      <div className="w-full md:w-5/12 pl-24 md:pl-0 relative z-20">
        <div className="card-panel hover-glow p-6 sm:p-8">

          {/* Mobile Date (Visible only on mobile) */}
          <span
            className="md:hidden inline-block px-3 py-1 mb-4 rounded text-xs font-semibold"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--glass-border)',
            }}
          >
            {experience.date}
          </span>

          <h3 className="text-2xl font-bold mb-1 leading-tight" style={{ color: 'var(--text-primary)' }}>
            {experience.title}
          </h3>

          <h4 className="text-base font-semibold mb-5 flex items-center flex-wrap gap-2" style={{ color: 'var(--accent-primary)' }}>
            {experience.company_name}
            {experience.type_job && (
              <>
                <span className="w-1 h-1 bg-[var(--text-tertiary)]"></span>
                <span style={{ color: 'var(--text-secondary)' }}>{experience.type_job}</span>
              </>
            )}
          </h4>

          <ul className="space-y-3">
            {experience.points.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <span className="mt-2 w-1.5 h-1.5 flex-shrink-0" style={{ background: 'var(--accent-primary)' }}></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {experience.website && (
            <div className="mt-6 flex justify-end">
              <a
                href={experience.website}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold px-4 py-2 rounded-md transition-colors duration-200 hover:bg-[var(--accent-primary)] hover:text-white"
                style={{
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--accent-border)',
                }}
              >
                Visit Website →
              </a>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
