import { PhotoContact } from '@/assets/images/ImagesContact';
import { MainLayout } from '@/components/Layouts';

export const EducationPage = () => {
  return (
    <MainLayout title="Education">
      <div className="row my-[40px] flex justify-center">
        <img className="h-[450px] rounded-xl" src={PhotoContact} alt="my Profile" />
        <div className="flex max-w-xl flex-col items-center gap-8 px-8 py-10 text-center">
          <h1 className="text-5xl font-bold">Contact Me 📞.</h1>
          <p className="text-xl font-bold">
            You can contact me at the contact listed below.
            <br />I will respond quickly to your message.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};
