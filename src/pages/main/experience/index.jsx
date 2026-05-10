import React from 'react';
import { MainLayout } from '@/components/Layouts';
import { experiences } from './data/database';

export const ExperiencePage = () => {
  return (
    <MainLayout title="Experience">
      <div className="flex flex-col py-5 fade-in-up">

        {/* Header Section */}
        <div className="text-center mb-10 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[var(--accent-purple)] opacity-10 blur-[80px] rounded-full pointer-events-none"></div>
          <h1 className="text-5xl md:text-6xl font-black mb-3 relative z-10">
            Work <span className="text-gradient">Experience</span>.
          </h1>
          <p className="text-lg relative z-10" style={{ color: 'var(--text-secondary)' }}>
            What I have done so far in my professional journey.
          </p>
        </div>

        {/* Custom Timeline Container */}
        <div className="relative max-w-5xl mx-auto w-full px-4 sm:px-6">

          {/* Glowing Vertical Line */}
          <div
            className="absolute left-[38px] md:left-1/2 top-0 bottom-0 w-[2px] transform md:-translate-x-1/2"
            style={{
              background: 'linear-gradient(to bottom, transparent, var(--accent-purple), var(--accent-pink), transparent)'
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
      <div className="absolute left-[38px] md:left-1/2 w-14 h-14 rounded-full border-[3px] border-[var(--glass-border)] transform -translate-x-1/2 z-10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:border-[var(--accent-purple)] group-hover:shadow-[0_0_20px_rgba(157,78,221,0.5)]"
        style={{ background: 'var(--card-bg)' }}>
        <img
          src={experience.icon}
          alt={experience.company_name}
          className="w-8 h-8 object-contain rounded-full"
        />
      </div>

      {/* Date floating label for Desktop */}
      <div className={`hidden md:block w-5/12 ${isEven ? 'text-right pr-56' : 'text-left pl-56'}`}>
        <span className="inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-[var(--glass-shadow)]"
          style={{ background: 'var(--pill-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
          {experience.date}
        </span>
      </div>

      {/* Content Card */}
      <div className="w-full md:w-5/12 pl-24 md:pl-0 relative z-20">
        <div className="card-panel hover-glow p-6 sm:p-8 transition-transform duration-300 hover:-translate-y-2">

          {/* Mobile Date (Visible only on mobile) */}
          <span className="md:hidden inline-block px-3 py-1 mb-4 rounded-full text-xs font-bold"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}>
            {experience.date}
          </span>

          <h3 className="text-2xl font-bold mb-1 leading-tight" style={{ color: 'var(--text-primary)' }}>
            {experience.title}
          </h3>

          <h4 className="text-base font-semibold mb-5 flex items-center flex-wrap gap-2" style={{ color: 'var(--accent-cyan)' }}>
            {experience.company_name}
            {experience.type_job && (
              <>
                <span className="w-1 h-1 rounded-full bg-[var(--text-tertiary)]"></span>
                <span style={{ color: 'var(--text-secondary)' }}>{experience.type_job}</span>
              </>
            )}
          </h4>

          <ul className="space-y-3">
            {experience.points.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent-purple)' }}></span>
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
                className="text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(157,78,221,0.3)]"
                style={{
                  background: 'rgba(157,78,221,0.1)',
                  color: 'var(--accent-purple)',
                  border: '1px solid rgba(157,78,221,0.25)',
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
