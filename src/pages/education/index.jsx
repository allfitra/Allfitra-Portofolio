import { GraduationImg, UnjLogo } from '@/assets/images/ImagesEducation';
import { MainLayout } from '@/components/Layouts';
import { Fade, Zoom } from 'react-awesome-reveal';

export const EducationPage = () => {
  return (
    <MainLayout title="Education">
      <div className="row mb-20 mt-2 flex flex-col justify-center md:flex-row">
        <div className="-mb-10 -mt-6 flex justify-center md:mb-0 md:mt-0">
          <img
            src={GraduationImg}
            alt="img-graduation"
            className="max-h-52 w-52 md:max-h-[400px] md:w-full"
          />
        </div>
        <div className="first-letter flex flex-col items-center gap-14 px-8 py-10 text-center">
          <div>
            <Fade direction="down">
              <h1 className="text-5xl font-bold">Education.</h1>
            </Fade>
            <hr className="mt-2" />
          </div>
          <div className="-mx-12 md:mx-0">
            <h2 className="mb-5 ml-3 text-left text-3xl font-bold md:ml-0">Degrees Received</h2>
            <Zoom>
              <div className=" max-w-[700px] rounded-xl bg-[#ff2f6dcb] shadow-md shadow-[#ff2f6dcb]">
                <div className="flex px-6 py-4">
                  <img src={UnjLogo} alt="logo-unj" className="mr-5 h-10 w-10 md:h-16 md:w-16" />
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex justify-between">
                      <div className="text-start">
                        <h3 className="text-lg font-bold md:text-2xl">Jakarta State University</h3>
                        <h1 className="text-sm font-semibold md:text-base">
                          Bachelor in Computer Science (S.Kom)
                        </h1>
                      </div>
                      <h3 className="text-base font-semibold md:text-xl">2020 - Present</h3>
                    </div>
                  </div>
                </div>
                <div className="rounded-b-xl bg-black p-5 text-right">
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
            </Zoom>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
