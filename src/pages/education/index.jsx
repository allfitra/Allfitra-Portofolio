import { GraduationImg, UnjLogo } from '@/assets/images/ImagesEducation';
import { MainLayout } from '@/components/Layouts';

export const EducationPage = () => {
  return (
    <MainLayout title="Education">
      <div className="row mb-20 mt-2 flex justify-center">
        <img src={GraduationImg} alt="img-graduation" className="max-h-[400px]" />
        <div className="first-letter flex flex-col items-center gap-14 px-8 py-10 text-center">
          <div>
            <h1 className="text-5xl font-bold">Education.</h1>
            <hr className="mt-2" />
          </div>
          <div>
            <h2 className="mb-5 text-left text-3xl font-bold">Degrees Received</h2>
            <div className=" w-[700px] rounded-xl bg-[#ff2f6dcb] shadow-md shadow-[#ff2f6dcb]">
              <div className="flex px-6 py-4">
                <img src={UnjLogo} alt="logo-unj" className="mr-5 w-16" />
                <div className="flex w-full flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="text-start">
                      <h3 className="text-2xl font-bold">Jakarta State University</h3>
                      <h1 className="text-base font-semibold">
                        Bachelor in Computer Science (S.Kom)
                      </h1>
                    </div>
                    <h3 className="text-xl font-semibold">2020 - Present</h3>
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
