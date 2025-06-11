import { MainLayout } from '@/components/Layouts';
import { Fade, Zoom } from 'react-awesome-reveal';
import { educations } from './data/database';
import { useTheme } from '@/utils/themeContext';
import { graduateAvatar } from '@/assets/Content';

export const EducationPage = () => {
  const { theme } = useTheme();
  return (
    <MainLayout title="Education">
      <div className="row mb-16 mt-5 flex flex-col justify-center md:flex-row">
        <div className="-mb-10 -mt-6 flex justify-center md:mb-0 md:mt-6">
          <img
            src={graduateAvatar}
            alt="img-graduation"
            className="max-h-52 md:max-h-[400px] md:w-full"
          />
        </div>
        <div className="first-letter flex flex-col items-center gap-14 px-8 text-center">
          <div>
            <Fade direction="down">
              <h1 className="text-5xl font-bold">Education.</h1>
            </Fade>
            <hr
              className="mt-2"
              style={
                theme === 'dark'
                  ? { borderColor: '#fff', borderWidth: '1.5px' }
                  : { borderColor: '#000', borderWidth: '1.5px' }
              }
            />
          </div>
          <div className="-mx-12 md:mx-0">
            <h2 className="mb-5 ml-3 text-left text-3xl font-bold md:-mt-5 md:ml-0">
              Degrees Received
            </h2>
            <Zoom>
              <div className="flex flex-col gap-8">
                {educations.map((education, index) => (
                  <EducationCard key={index} education={education} />
                ))}
              </div>
            </Zoom>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const EducationCard = ({ education }) => {
  const { theme } = useTheme();
  return (
    <div
      className=" max-w-[700px] rounded-xl bg-[#ff2f6dcb] shadow-md shadow-[#ff2f6dcb] hover:shadow-lg hover:shadow-[#ff2f6dcb]"
      style={{ color: theme === 'dark' ? '#fff' : '#000' }}
    >
      <div className="flex px-6 py-4">
        <img src={education.icon} alt="logo-unj" className="mr-5 h-10 w-10 md:h-20 md:w-20" />
        <div className="flex w-full flex-col gap-4">
          <div className="flex justify-between gap-1 md:gap-2">
            <div className="text-start">
              <h1 className="text-xs font-bold md:text-2xl">{education.school}</h1>
              <h2 className="text-xs font-semibold md:text-base">{education.degree}</h2>
              <h2 className="text-xs font-semibold md:text-base">GPA : {education.gpa}</h2>
            </div>
            <h3 className="text-xs font-semibold md:text-xl">{education.date}</h3>
          </div>
          <div className="-mt-2 flex flex-row">
            <div className="flex w-[150px] flex-col text-start text-xs font-semibold md:text-base">
              <h2>Thesis :</h2>
              {/* Icon untuk direct ke link skripsi*/}
            </div>
            <h2 className="text-justify text-xs font-semibold italic md:text-base">
              {education.thesis}
            </h2>
          </div>
        </div>
      </div>
      <div
        className="rounded-b-xl p-5 text-right "
        style={{ backgroundColor: theme === 'dark' ? '#000' : '#303030' }}
      >
        <button className="rounded-md bg-[#ff2f6dcb] px-10 py-3 opacity-90 hover:opacity-100">
          <a
            href="https://www.unj.ac.id/"
            target="_blank"
            rel="noreferrer"
            className="text-xl font-semibold"
          >
            Visit Website
          </a>
        </button>
      </div>
    </div>
  );
};

export const CertificateCard = () => {
  return <></>;
};
