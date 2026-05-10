import { MainLayout } from '@/components/Layouts';
import { InstagramIcon, LinkedinIcon, MailsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Magnet from '@/utils/FramerMotion/magnetic-item';
import GlassIcons from '@/utils/FramerMotion/glass-icon';
import StackImages from '@/utils/Animation/stack-images';
import { cvLink, stackImagesData } from './data/database';

export const ContactPage = () => {
  return (
    <MainLayout title="Contact">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-32 md:py-10 md:min-h-[75vh] fade-in-up">

        {/* Stacked Images Visual */}
        <div className="relative flex-shrink-0">
          <StackImages
            randomRotation={true}
            sensitivity={120}
            sendToBackOnClick={false}
            cardDimensions={{ width: 280, height: 400 }}
            cardsData={stackImagesData}
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center lg:items-start max-w-lg text-center lg:text-left gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black mb-3 tracking-tight">
              Let's <span className="text-gradient">Connect</span>.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Have a project in mind or want to chat? I'm always open to new conversations.
            </p>
          </div>

          <div
            className="w-full rounded-3xl p-6 flex flex-col gap-6"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--glass-border)',
            }}
          >
            <SosmedIcon />

            <div className="h-px w-full" style={{ background: 'var(--glass-border)' }} />

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
              <Magnet padding={30} disabled={false} magnetStrength={8}>
                <Link to={cvLink} target="_blank" className="premium-btn">
                  Download CV
                </Link>
              </Magnet>

              {/* <a
                href="mailto:alfitrafadjri00@gmail.com"
                className="px-6 py-3 rounded-full text-base font-semibold transition-colors duration-200 text-center"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                Send Email
              </a> */}
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

function SosmedIcon() {
  const items = [
    {
      icon: <LinkedinIcon className="h-5 w-5" />,
      label: 'LinkedIn',
      color: '#0e76a8',
      link: 'https://www.linkedin.com/in/alfitra-fadjri/',
      customClass: 'h-12 w-12',
    },
    {
      icon: <MailsIcon className="h-5 w-5" />,
      label: 'Email',
      color: '#ea4335',
      link: 'mailto:alfitrafadjri00@gmail.com',
      customClass: 'h-12 w-12',
    },
    {
      icon: <InstagramIcon className="h-5 w-5" />,
      label: 'Instagram',
      color: '#e4405f',
      link: 'https://www.instagram.com/allfitra_',
      customClass: 'h-12 w-12',
    },
  ];
  return (
    <div className="flex justify-center lg:justify-start">
      <GlassIcons items={items} className="gap-16" />
    </div>
  );
}
