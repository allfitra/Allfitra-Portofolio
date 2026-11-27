import { MainLayout } from '@/components/Layouts';
import { educations } from './data/database';
import { graduateAvatar } from '@/assets/Content';

export const EducationPage = () => {
  return (
    <MainLayout title="Education">
      <div className="flex flex-col lg:flex-row items-start justify-center gap-5 fade-in-up">

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
        <div className="flex flex-col w-full max-w-2xl mb-10 md:mb-0">
          <div className="mb-5">
            <h1 className="text-5xl md:text-6xl font-black mb-1">
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
          className="p-3 rounded-md flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}
        >
          <img src={education.icon} alt="school-logo" className="h-14 w-14 object-contain" />
        </div>

        {/* Info */}
        <div className="flex flex-col w-full gap-2">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <h2 className="text-xl font-bold transition-colors duration-200 group-hover:text-[var(--accent-primary)]" style={{ color: 'var(--text-primary)' }}>
              {education.school}
            </h2>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded"
              style={{
                background: 'var(--accent-subtle)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-border)',
              }}
            >
              {education.date}
            </span>
          </div>

          <p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>
            {education.degree}
          </p>
          <p className="text-sm font-bold" style={{ color: 'var(--accent-primary)' }}>
            GPA: {education.gpa}
          </p>

          {education.thesis && (
            <div
              className="mt-3 p-4 rounded-md"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderLeft: '3px solid var(--accent-primary)',
              }}
            >
              <span
                className="text-xs uppercase tracking-widest font-bold block mb-1.5"
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
        </div>

      </div>
    </div>
  );
};


export const CertificateCard = () => null;
