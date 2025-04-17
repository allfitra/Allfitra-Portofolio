import React from 'react';
import { Photo } from '@/assets/images/ImagesHome';
import { MainLayout } from '@/components/Layouts';
import { GithubIcon, InstagramIcon, LinkedinIcon, MailsIcon, TwitterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Fade, Zoom } from 'react-awesome-reveal';
import { homeData } from './data/database';
import DecryptedText from '@/utils/FramerMotion/decrypted-text';
import Orb from '@/utils/OrbAnimation/orb-animation';
import RotatingText from '@/utils/FramerMotion/rotating-text';

export const HomePage = () => {
  return (
    <MainLayout title="Home">
      <div className="row my-[80px] flex flex-col-reverse justify-center md:flex-row">
        <div className="flex max-w-xl flex-col gap-6 px-8">
          <h1 className="text-5xl font-bold">Hello 👋.</h1>
          <h1 className="text-xl font-bold">
            I'm
            <span className="text-[#E3405F]"> {homeData.name}, </span>
            as {homeData.title}.
          </h1>
          <p className="text-justify text-[16px] leading-7">
            <DecryptedText
              text={homeData.description}
              className="revealed"
              animateOn="view"
              characters="!@#$%^&*?"
              speed={100}
              maxIterations={15}
            />
          </p>
          <SosmedIcon />
          <button className="flex items-start">
            <Link
              to="/contact"
              className="rounded-md bg-[#FC1056] px-12 py-3 text-xl font-bold text-white duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-md hover:shadow-black"
            >
              Contact Me
            </Link>
          </button>
        </div>
        <Zoom>
          <div className="relative mt-[-50px] h-[400px] w-[400px]">
            <div className="absolute inset-0 ml-[25px] mt-[35px] h-[350px] w-[350px] object-cover">
              <img className="rounded-full" src={Photo} alt="my Profile" />
            </div>
            <div className="absolute inset-0 h-[100%] w-[100%] object-cover">
              <Orb hoverIntensity={0.3} rotateOnHover={true} hue={0} forceHoverState={false} />
            </div>
          </div>
        </Zoom>
      </div>
    </MainLayout>
  );
};

function SosmedIcon() {
  return (
    <div className="ml-5 flex flex-row-reverse sm:flex-col-reverse md:ml-0">
      <div className="flex flex-row items-end gap-3 text-sm text-white sm:ml-auto xl:gap-5">
        <Fade direction="left" delay={10}>
          <a href="https://github.com/allfitra" target="_blank" className="cursor-pointer">
            <div className="rounded-full bg-[#333] p-2 transition duration-200 hover:-translate-y-1.5 hover:translate-x-1 hover:shadow-md hover:shadow-[#222]">
              <GithubIcon className="h-7 w-7 xl:h-8 xl:w-8" />
            </div>
          </a>
          <a
            href="https://www.linkedin.com/in/alfitra-fadjri/"
            target="_blank"
            className="cursor-pointer"
          >
            <div className="rounded-full bg-[#0e76a8] p-2 transition duration-200 hover:-translate-y-1.5 hover:translate-x-1 hover:shadow-md hover:shadow-[#222]">
              <LinkedinIcon className="h-7 w-7 xl:h-8 xl:w-8" />
            </div>
          </a>
          <a href="mailto:alfitrafadjri00@gmail.com" target="_blank" className="cursor-pointer">
            <div className="rounded-full bg-[#ea4335] p-2 transition duration-200 hover:-translate-y-1.5 hover:translate-x-1 hover:shadow-md hover:shadow-[#222]">
              <MailsIcon className="h-7 w-7 xl:h-8 xl:w-8" />
            </div>
          </a>
          <a href="https://twitter.com/Allfitra00" target="_blank" className="cursor-pointer">
            <div className="rounded-full bg-[#00acee] p-2 transition duration-200 hover:-translate-y-1.5 hover:translate-x-1 hover:shadow-md hover:shadow-[#222]">
              <TwitterIcon className="h-7 w-7 xl:h-8 xl:w-8" />
            </div>
          </a>
          <a href="https://www.instagram.com/allfitra_" target="_blank" className="cursor-pointer">
            <div className="transform rounded-full bg-[#e4405f] p-2 transition duration-200 hover:-translate-y-1.5 hover:translate-x-1 hover:shadow-md hover:shadow-[#222]">
              <InstagramIcon className="h-7 w-7 xl:h-8 xl:w-8" />
            </div>
          </a>
        </Fade>
      </div>
    </div>
  );
}
