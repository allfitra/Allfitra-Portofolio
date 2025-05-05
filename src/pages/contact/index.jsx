import { PhotoContact } from '@/assets/images/ImagesContact';
import { MainLayout } from '@/components/Layouts';
import { GithubIcon, InstagramIcon, LinkedinIcon, MailsIcon, TwitterIcon } from 'lucide-react';
import { Fade, Zoom } from 'react-awesome-reveal';
import { Link } from 'react-router-dom';
import Magnet from '@/utils/FramerMotion/magnetic-item';
import GlassIcons from '@/utils/FramerMotion/glass-icon';

export const ContactPage = () => {
  return (
    <MainLayout title="Contact">
      <div className="row my-[40px] -mt-0 flex flex-col justify-center md:mt-10 md:flex-row">
        <img className="max-h-[450px] rounded-xl" src={PhotoContact} alt="my Profile" />
        <div className="flex max-w-xl flex-col items-center gap-5 px-8 py-10 text-center md:gap-8">
          <Zoom>
            <h1 className="text-3xl font-bold md:text-5xl">Contact Me 📞.</h1>
          </Zoom>
          <p className="text-base font-bold md:text-xl">
            You can contact me at the contact listed below.
            <br />I will respond quickly to your message.
          </p>
          <SosmedIcon />
          <Magnet padding={150} disabled={false} magnetStrength={10}>
            <button className="flex items-start">
              <Link
                to="https://drive.google.com/file/d/1VZOmVHjTqlTTovaIMP8g4Ztg_tm81cxi/view?usp=sharing"
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
    },
    {
      icon: <MailsIcon className="h-7 w-7 xl:h-8 xl:w-8" />,
      label: 'Email',
      color: '#ea4335',
      link: 'mailto:alfitrafadjri00@gmail.com',
    },
    {
      icon: <InstagramIcon className="h-7 w-7 xl:h-8 xl:w-8" />,
      label: 'Instagram',
      color: '#e4405f',
      link: 'https://www.instagram.com/allfitra_',
    },
  ];
  return (
    <div style={{ position: 'relative' }}>
      <GlassIcons items={items} />
    </div>
  );
}
