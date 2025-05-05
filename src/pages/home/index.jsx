import React from 'react';
import { Photo } from '@/assets/images/ImagesHome';
import { MainLayout } from '@/components/Layouts';
import { GithubIcon, InstagramIcon, LinkedinIcon, MailsIcon, TwitterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Zoom } from 'react-awesome-reveal';
import { homeData } from './data/database';
import DecryptedText from '@/utils/FramerMotion/decrypted-text';
import Orb from '@/utils/OrbAnimation/orb-animation';
import Magnet from '@/utils/FramerMotion/magnetic-item';
import GlassIcons from '@/utils/FramerMotion/glass-icon';

export const HomePage = () => {
  return (
    <MainLayout title="Home">
      <div className="row my-[50px] flex flex-col-reverse justify-center md:flex-row">
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
          <Magnet padding={150} disabled={false} magnetStrength={10}>
            <div className="flex justify-center md:justify-start">
              <button className="mb-6 md:mt-4">
                <Link
                  to="/contact"
                  className="rounded-md bg-[#FC1056] px-12 py-3 text-xl font-bold text-white hover:shadow-md hover:shadow-black"
                >
                  Contact Me
                </Link>
              </button>
            </div>
          </Magnet>
        </div>
        <Zoom>
          <div className="relative ml-[-20px] mt-[-50px] h-[400px] w-[400px] md:ml-0">
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
  const items = [
    {
      icon: <GithubIcon className="h-7 w-7 xl:h-8 xl:w-8" />,
      label: 'Github',
      color: '#333',
      link: 'https://github.com/allfitra',
      customClass: 'h-[3em] w-[3em]',
    },
    {
      icon: <LinkedinIcon className="h-7 w-7 xl:h-8 xl:w-8" />,
      label: 'LinkedIn',
      color: '#0e76a8',
      link: 'https://www.linkedin.com/in/alfitra-fadjri/',
      customClass: 'h-[3em] w-[3em]',
    },
    {
      icon: <MailsIcon className="h-7 w-7 xl:h-8 xl:w-8" />,
      label: 'Email',
      color: '#ea4335',
      link: 'mailto:alfitrafadjri00@gmail.com',
      customClass: 'h-[3em] w-[3em]',
    },
    {
      icon: <TwitterIcon className="h-7 w-7 xl:h-8 xl:w-8" />,
      label: 'Twitter',
      color: '#00acee',
      link: 'https://twitter.com/Allfitra00',
      customClass: 'h-[3em] w-[3em]',
    },
    {
      icon: <InstagramIcon className="h-7 w-7 xl:h-8 xl:w-8" />,
      label: 'Instagram',
      color: '#e4405f',
      link: 'https://www.instagram.com/allfitra_',
      customClass: 'h-[3em] w-[3em]',
    },
  ];
  return (
    <div style={{ position: 'relative' }} className="flex justify-center md:justify-end">
      <GlassIcons
        items={items}
        className="max-w-[370px] grid-cols-5 gap-[15px] md:grid-cols-5 md:gap-[30px]"
      />
    </div>
  );
}
