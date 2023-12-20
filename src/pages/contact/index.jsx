import { PhotoContact } from '@/assets/images/ImagesContact';
import { MainLayout } from '@/components/Layouts';
import { GithubIcon, InstagramIcon, LinkedinIcon, MailsIcon, TwitterIcon } from 'lucide-react';
import { Fade } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';

export const ContactPage = () => {
  return (
    <MainLayout title="Contact">
      <div className="row my-[40px] flex justify-center">
        <img className="max-h-[450px] rounded-xl" src={PhotoContact} alt="my Profile" />
        <div className="flex max-w-xl flex-col items-center gap-8 px-8 py-10 text-center">
          <h1 className="text-5xl font-bold">Contact Me 📞.</h1>
          <p className="text-xl font-bold">
            You can contact me at the contact listed below.
            <br />I will respond quickly to your message.
          </p>
          <SosmedIcon />
          <button className="flex items-start">
            <Link
              to="https://drive.google.com/file/d/1D9Akj6m5_zLwzpEz5klb1ZaN3VPBjgh0/view?usp=sharing"
              target="_blank"
              className="rounded-md bg-[#FC1056] px-12 py-3 text-xl font-bold duration-200 hover:-translate-x-1 hover:-translate-y-1.5 hover:shadow-md hover:shadow-white"
            >
              Get my CV
            </Link>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

function SosmedIcon() {
  return (
    <div className="">
      <div className="flex flex-row items-center gap-3 text-sm text-white sm:ml-auto xl:gap-5">
        <Fade direction="left">
          <a href="https://github.com/allfitra" target="_blank" className="cursor-pointer">
            <div className="rounded-full bg-[#333] p-2 transition duration-200 hover:-translate-y-1.5 hover:translate-x-1 hover:shadow-md hover:shadow-[#fff]">
              <GithubIcon className="h-7 w-7 xl:h-8 xl:w-8" />
            </div>
          </a>
          <a
            href="https://www.linkedin.com/in/alfitra-fadjri/"
            target="_blank"
            className="cursor-pointer"
          >
            <div className="rounded-full bg-[#0e76a8] p-2 transition duration-200 hover:-translate-y-1.5 hover:translate-x-1 hover:shadow-md hover:shadow-[#fff]">
              <LinkedinIcon className="h-7 w-7 xl:h-8 xl:w-8" />
            </div>
          </a>
        </Fade>
        <Fade direction="bottom">
          <a href="mailto:alfitrafadjri00@gmail.com" target="_blank" className="cursor-pointer">
            <div className="rounded-full bg-[#ea4335] p-2 transition duration-200 hover:-translate-y-1.5 hover:shadow-md hover:shadow-[#fff]">
              <MailsIcon className="h-7 w-7 xl:h-8 xl:w-8" />
            </div>
          </a>
        </Fade>
        <Fade direction="right">
          <a href="https://twitter.com/Allfitra00" target="_blank" className="cursor-pointer">
            <div className="rounded-full bg-[#00acee] p-2 transition duration-200 hover:-translate-x-1 hover:-translate-y-1.5 hover:shadow-md hover:shadow-[#fff]">
              <TwitterIcon className="h-7 w-7 xl:h-8 xl:w-8" />
            </div>
          </a>
          <a href="https://www.instagram.com/allfitra_" target="_blank" className="cursor-pointer">
            <div className="transform rounded-full bg-[#e4405f] p-2 transition duration-200 hover:-translate-x-1 hover:-translate-y-1.5 hover:shadow-md hover:shadow-[#fff]">
              <InstagramIcon className="h-7 w-7 xl:h-8 xl:w-8" />
            </div>
          </a>
        </Fade>
      </div>
    </div>
  );
}
