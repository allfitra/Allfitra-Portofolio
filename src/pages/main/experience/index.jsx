import React from 'react';
import { MainLayout } from '@/components/Layouts';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import SpotlightCard from '@/utils/Animation/spotlight-card';

import { experiences } from './data/database';
import { Fade } from 'react-awesome-reveal';
import { useTheme } from '@/utils/themeContext';
import { themes } from '@/utils/theme';

export const ExperiencePage = () => {
  const { theme } = useTheme();
  return (
    <MainLayout title="Experience">
      <Fade direction="down">
        <div
          className="mt-3 text-center font-serif"
          style={theme === 'dark' ? themes.dark : themes.light}
        >
          <h2 className="xs:text-[50px] text-[40px] font-black sm:text-[60px] lg:text-[50px] lg:leading-[60px]">
            Work Experience.
          </h2>
          <p
            className="xs:text-[20px] text-[16px] font-medium sm:text-[26px] lg:text-[25px] lg:leading-[40px]"
            style={{ color: theme === 'dark' ? '#dfd9ff' : '#383450' }}
          >
            What I have done so far
          </p>
        </div>
      </Fade>

      <div className="mb-10 mt-10 flex flex-col">
        <VerticalTimeline lineColor={theme === 'dark' ? '#fff' : '#000'}>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} theme={theme} />
          ))}
        </VerticalTimeline>
      </div>
    </MainLayout>
  );
};

const ExperienceCard = ({ experience, theme }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{ background: '#2A3A5B', color: '#fff' }}
      contentArrowStyle={{ borderRight: '7px solid  #232631' }}
      dateClassName={theme === 'dark' ? 'text-white' : 'lg:text-black'}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex h-full w-full items-center justify-center">
          <img
            src={experience.icon}
            alt={experience.company_name}
            className="h-[80%] w-[80%] rounded-full object-contain"
          />
        </div>
      }
    >
      <SpotlightCard
        className="m-[-15px] cursor-crosshair md:m-[-22px]"
        spotlightColor="rgba(0, 229, 255, 0.2)"
      >
        <div>
          <h3 className="text-[24px] font-bold text-white">{experience.title}</h3>
          <p className="text-secondary text-[16px] font-semibold" style={{ margin: 0 }}>
            {experience.company_name} {experience.type_job && ` · ${experience.type_job}`}
          </p>
        </div>

        <ul className="ml-5 mt-5 list-disc space-y-2">
          {experience.points.map((point, index) => (
            <li
              key={`experience-point-${index}`}
              className="text-white-100 pl-1 text-justify text-[14px] tracking-wider"
            >
              {point}
            </li>
          ))}
        </ul>
      </SpotlightCard>
    </VerticalTimelineElement>
  );
};
