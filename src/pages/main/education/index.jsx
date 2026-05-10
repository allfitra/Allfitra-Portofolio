import { MainLayout } from '@/components/Layouts';
import { educations } from './data/database';
import { graduateAvatar } from '@/assets/Content';

export const EducationPage = () => {
  return (
    <MainLayout title="Education">
      <div className="flex flex-col lg:flex-row items-start justify-center gap-5 md:pt-10 fade-in-up">

        {/* Sticky Visual */}
        <div className="relative hidden md:block lg:sticky lg:top-40 flex-shrink-0 flex justify-center">
          {/* <div
            className="rounded-3xl p-5"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }}
          > */}
          <img
            src={graduateAvatar}
            alt="Graduate"
            className="w-56 md:w-72"
          />
          {/* </div> */}
        </div>

        {/* Content */}
        <div className="flex flex-col w-full max-w-2xl mb-10 md:mb-5">
          <div className="mb-10">
            <h1 className="text-5xl md:text-6xl font-black mb-3">
              My <span className="text-gradient-cyan">Education</span>.
            </h1>
            <p className="text-lg text-center md:text-start" style={{ color: 'var(--text-secondary)' }}>
              Academic background and degrees achieved.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {educations.map((education, index) => (
              <EducationCard key={index} education={education} />
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

const EducationCard = ({ education }) => {
  return (
    <div className="card-panel hover-glow p-6 md:p-8 group">
      <div className="flex flex-col md:flex-row gap-5 items-start relative z-10">

        {/* Logo */}
        <div
          className="p-3 rounded-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
          style={{ background: 'rgba(157,78,221,0.1)', border: '1px solid rgba(157,78,221,0.2)' }}
        >
          <img src={education.icon} alt="school-logo" className="h-14 w-14 object-contain" />
        </div>

        {/* Info */}
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <h2 className="text-xl font-bold transition-colors duration-300 group-hover:text-[var(--accent-cyan)]" style={{ color: 'var(--text-primary)' }}>
              {education.school}
            </h2>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.15)]"
              style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,240,255,0.2)' }}
            >
              {education.date}
            </span>
          </div>

          <p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
            {education.degree}
          </p>
          <p className="text-sm font-bold" style={{ color: 'var(--accent-purple)' }}>
            GPA: {education.gpa}
          </p>

          {education.thesis && (
            <div
              className="mt-3 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}
            >
              <span
                className="text-xs uppercase tracking-widest font-bold block mb-2"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Thesis
              </span>
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                "{education.thesis}"
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <a
              href="https://unj.ac.id/"
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
        </div>

      </div>
    </div>
  );
};


export const CertificateCard = () => null;
