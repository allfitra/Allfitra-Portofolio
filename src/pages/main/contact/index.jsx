import { MainLayout } from '@/components/Layouts';
import { InstagramIcon, LinkedinIcon, MailsIcon } from 'lucide-react';
import { Zoom } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';
import Magnet from '@/utils/FramerMotion/magnetic-item';
import GlassIcons from '@/utils/FramerMotion/glass-icon';
import StackImages from '@/utils/Animation/stack-images';
import { cvLink, stackImagesData } from './data/database';

export const ContactPage = () => {
  return (
    <MainLayout title="Contact">
      <div className="row my-[40px] -mt-0 flex flex-col justify-center md:flex-row">
        <div className="mx-10">
          {/* <img className="max-h-[450px] rounded-xl" src={PhotoContact} alt="my Profile" /> */}
          <StackImages
            randomRotation={true}
            sensitivity={120}
            sendToBackOnClick={false}
            cardDimensions={{ width: 300, height: 400 }}
            cardsData={stackImagesData}
            // animationConfig={{ stiffness: 200, damping: 10 }}
          />
        </div>
        <div className="flex max-w-xl flex-col items-center gap-5 px-8 py-10 text-center md:gap-8">
          <Zoom>
            <h1 className="text-3xl font-bold md:text-5xl">Contact Me 📩.</h1>
          </Zoom>
          <p className="text-base font-bold md:text-xl">
            You can contact me at the contact listed below.
            <br />I will respond quickly to your message.
          </p>
          <SosmedIcon />
          <Magnet padding={150} disabled={false} magnetStrength={10}>
            <button className="flex items-start">
              <Link
                to={cvLink}
                target="_blank"
                className="rounded-md bg-[#FC1056] px-12 py-3 text-xl font-bold text-white hover:shadow-md hover:shadow-[#ccc]"
              >
                Get my CV
              </Link>
            </button>
          </Magnet>
        </div>
      </div>
    </MainLayout>
  );
};

function SosmedIcon() {
  const items = [
    {
      icon: <LinkedinIcon className="h-7 w-7 xl:h-8 xl:w-8" />,
      label: 'LinkedIn',
      color: '#0e76a8',
      link: 'https://www.linkedin.com/in/alfitra-fadjri/',
      customClass: 'h-[4em] w-[4em]',
    },
    {
      icon: <MailsIcon className="h-7 w-7 xl:h-8 xl:w-8" />,
      label: 'Email',
      color: '#ea4335',
      link: 'mailto:alfitrafadjri00@gmail.com',
      customClass: 'h-[4em] w-[4em]',
    },
    {
      icon: <InstagramIcon className="h-7 w-7 xl:h-8 xl:w-8" />,
      label: 'Instagram',
      color: '#e4405f',
      link: 'https://www.instagram.com/allfitra_',
      customClass: 'h-[4em] w-[4em]',
    },
  ];
  return (
    <div style={{ position: 'relative' }}>
      <GlassIcons items={items} />
    </div>
  );
}
