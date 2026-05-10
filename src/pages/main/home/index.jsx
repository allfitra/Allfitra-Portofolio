import React from 'react';
import { Photo } from '@/assets/images/ImagesHome';
import { MainLayout } from '@/components/Layouts';
import { GithubIcon, InstagramIcon, LinkedinIcon, MailsIcon, TwitterIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeData } from './data/database';
import DecryptedText from '@/utils/FramerMotion/decrypted-text';
import Magnet from '@/utils/FramerMotion/magnetic-item';
import GlassIcons from '@/utils/FramerMotion/glass-icon';

export const HomePage = () => {
  return (
    <MainLayout title="Home">
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10 md:gap-16 min-h-[75vh] fade-in-up">

        {/* Text Content */}
        <div className="flex flex-col gap-5 max-w-xl z-10 text-center md:text-left px-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-2">
              Hello, I'm
            </h1>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-gradient">
              {homeData.name}.
            </h1>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {homeData.title}
          </h2>

          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            <DecryptedText
              text={homeData.description}
              className="revealed"
              animateOn="view"
              characters="!@#$%^&*?"
              speed={60}
              maxIterations={10}
            />
          </p>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mt-2">
            <Magnet padding={30} disabled={false} magnetStrength={10}>
              <Link to="/contact" className="premium-btn">
                Contact Me
              </Link>
            </Magnet>
          </div>
          <SosmedIcon />
        </div>

        {/* Profile Visual — CSS animated spinning border, no GPU lag */}
        <div className="relative flex items-center justify-center w-[280px] h-[280px] md:w-[400px] md:h-[400px] flex-shrink-0 group">

          {/* Outer glow container */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--accent-purple)] to-[var(--accent-cyan)] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>

          {/* Spinning gradient border */}
          <div className="absolute inset-0 rounded-full overflow-hidden p-1 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <div
              className="absolute inset-[-50%] w-[200%] h-[200%] animate-spin-slow"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, var(--accent-purple) 25%, var(--accent-pink) 50%, var(--accent-cyan) 75%, transparent 100%)'
              }}
            />
            {/* Inner background blocking the center */}
            <div className="absolute inset-1 rounded-full z-10" style={{ background: 'var(--bg-primary)' }}></div>
          </div>

          {/* Profile image */}
          <div className="relative z-20 w-[92%] h-[92%] rounded-full overflow-hidden border-2 border-[var(--glass-border)] group-hover:scale-105 transition-transform duration-500">
            <img className="w-full h-full object-cover" src={Photo} alt="Alfitra Fadjri" />
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

function SosmedIcon() {
  const items = [
    {
      icon: <GithubIcon className="h-5 w-5" />,
      label: 'Github',
      color: '#ffffff5f',
      link: 'https://github.com/allfitra',
      customClass: 'h-11 w-11',
    },
    {
      icon: <LinkedinIcon className="h-5 w-5" />,
      label: 'LinkedIn',
      color: '#0e76a8',
      link: 'https://www.linkedin.com/in/alfitra-fadjri/',
      customClass: 'h-11 w-11',
    },
    {
      icon: <MailsIcon className="h-5 w-5" />,
      label: 'Email',
      color: '#ea4335',
      link: 'mailto:alfitrafadjri00@gmail.com',
      customClass: 'h-11 w-11',
    },
    // {
    //   icon: <TwitterIcon className="h-5 w-5" />,
    //   label: 'Twitter',
    //   color: '#00acee',
    //   link: 'https://twitter.com/Allfitra00',
    //   customClass: 'h-11 w-11',
    // },
    {
      icon: <InstagramIcon className="h-5 w-5" />,
      label: 'Instagram',
      color: '#e4405f',
      link: 'https://www.instagram.com/allfitra_',
      customClass: 'h-11 w-11',
    },
  ];
  return (
    <div className="relative z-20">
      <GlassIcons items={items} />
    </div>
  );
}
