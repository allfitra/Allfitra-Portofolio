import React from 'react';
import { MainLayout } from '@/components/Layouts';
import { ProjectData } from './data/database';

export const ProjectPage = () => {
  return (
    <MainLayout title="Project">
      <div className="py-10 fade-in-up">
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-black mb-3">
            My <span className="text-gradient">Projects</span>.
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            A showcase of my recent work and open source contributions.
          </p>
        </div>

        {ProjectData.projects.map((data, index) => (
          <div key={index} className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                {data.category}
              </h2>
              <div
                className="flex-1 h-px"
                style={{ background: 'var(--glass-border)' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div className="card-panel hover-glow group flex flex-col h-full p-6">
      {/* Solid accent line at top */}
      <div
        className="w-12 h-1 mb-5 transition-transform duration-200 group-hover:scale-x-125 origin-left"
        style={{ background: 'var(--accent-primary)' }}
      />

      <h3
        className="text-2xl font-bold mb-3 leading-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {project.name}
      </h3>

      <p
        className="text-sm leading-relaxed mb-6 flex-grow"
        style={{ color: 'var(--text-secondary)' }}
      >
        {project.description}
      </p>

      <div
        className="flex justify-between items-center pt-5 mt-auto"
        style={{ borderTop: '1px solid var(--glass-border)' }}
      >
        {/* Tool icons */}
        <div className="flex flex-wrap gap-2">
          {project.tools && Object.values(project.tools).map((tool, i) => (
            <div
              key={i}
              title={tool.name}
              className="p-2 rounded transition-transform duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}
            >
              <img src={tool.logo} alt={tool.name} className="h-5 w-5 object-contain" />
            </div>
          ))}
        </div>

        {/* Action icons */}
        <div className="flex gap-2">
          {project.action?.map((action, i) => (
            <a
              key={i}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              title={action.label}
              className="p-2.5 rounded transition-colors duration-200 hover:bg-[var(--accent-primary)] hover:text-white"
              style={{
                background: 'var(--accent-subtle)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-border)',
              }}
            >
              <action.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

