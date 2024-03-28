import React from 'react';
import { MainLayout } from '@/components/Layouts';
import { ProjectData } from './data/database';
import { Fade, Zoom } from 'react-awesome-reveal';
import { useTheme } from '@/utils/themeContext';

export const ProjectPage = () => {
  const { theme } = useTheme();
  return (
    <MainLayout title="Project">
      <div className="my-[20px] overflow-y-hidden">
        <Fade direction="down">
          <h1 className="text-center font-serif text-4xl font-bold">{ProjectData.title}</h1>
        </Fade>

        {ProjectData.projects.map((data, index) => (
          <div key={index}>
            <Zoom>
              <hr
                className="mb-4 mt-10"
                style={
                  theme === 'dark'
                    ? { borderColor: '#fff', borderWidth: '1.5px' }
                    : { borderColor: '#000', borderWidth: '1.5px' }
                }
              />
            </Zoom>
            <Fade direction="left">
              <h1 className="font-sans text-4xl font-bold">{data.category}</h1>
            </Fade>

            <div className=" mt-6 grid grid-cols-1 gap-4 font-sans md:grid-cols-2">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <Fade direction={project.id % 2 == 1 ? 'left' : 'right'}>
                    <div
                      className="flex min-h-[250px] flex-col gap-4 rounded-lg px-6 py-7 shadow-sm shadow-[#6d6e70]"
                      style={
                        theme === 'dark'
                          ? { backgroundColor: '#292A2D', color: '#fff' }
                          : { backgroundColor: '#e9e9e9', color: '#000' }
                      }
                    >
                      <h1 className="text-3xl font-bold">{project.name}</h1>
                      <p>{project.description}</p>
                      <div className="flex justify-between pr-8">
                        <div className="flex gap-3">
                          {project.tools &&
                            Object.values(project.tools).map((tool, i) => (
                              <div key={i}>
                                <img
                                  title={tool.name}
                                  src={tool.logo}
                                  alt={`Logo ` + tool.name}
                                  className="h-8 w-8 xl:h-11 xl:w-11"
                                />
                              </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                          {project.action?.map((action, actionIndex) => (
                            <a
                              key={actionIndex}
                              href={action.href}
                              target="_blank"
                              className="cursor-pointer"
                            >
                              <div
                                className="rounded-full p-2 transition duration-200 hover:-translate-y-1 hover:shadow-md hover:shadow-[#000]"
                                style={
                                  theme === 'dark'
                                    ? { backgroundColor: '#333', color: '#fff' }
                                    : { backgroundColor: '#bbb', color: '#000' }
                                }
                              >
                                <action.icon
                                  className="h-5 w-5 xl:h-6 xl:w-6"
                                  aria-label={action.label}
                                />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Fade>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};
