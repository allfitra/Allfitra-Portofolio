import React from 'react';
import { motion } from 'framer-motion';
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
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10 md:gap-24 min-h-[75vh] fade-in-up">

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

        {/* Profile Visual with Decorative Rings and Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex items-center justify-center mt-10 md:mt-0 flex-shrink-0"
        >
          <div className="relative w-[280px] h-[280px] md:w-[300px] md:h-[300px]">
            {/* Outer glow container */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--accent-purple)] to-[var(--accent-cyan)] opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-30"></div>

            {/* Decorative rings */}
            <div className="absolute inset-0 -m-6 md:-m-10">
              <div
                className="absolute inset-0 rounded-full border border-[var(--accent-cyan)] opacity-20 animate-spin-slow"
                style={{ animationDuration: '20s' }}
              />
              <div
                className="absolute inset-3 md:inset-5 rounded-full border border-[var(--accent-purple)] opacity-30 animate-spin-slow"
                style={{ animationDuration: '15s', animationDirection: 'reverse' }}
              />
              <div
                className="absolute inset-6 md:inset-10 rounded-full border border-[var(--accent-pink)] opacity-40"
              />
            </div>

            {/* Spinning gradient border around image */}
            <div className="absolute inset-0 z-10 rounded-full overflow-hidden p-1 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              <div
                className="absolute inset-[-50%] w-[200%] h-[200%] animate-spin-slow"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, var(--accent-purple) 25%, var(--accent-pink) 50%, var(--accent-cyan) 75%, transparent 100%)',
                  animationDuration: '6s'
                }}
              />
              {/* Inner background blocking the center */}
              <div className="absolute inset-1 rounded-full z-10" style={{ background: 'var(--bg-primary)' }}></div>
            </div>

            {/* Profile image */}
            <div className="relative z-20 w-full h-full rounded-full flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500 p-1">
              <img className="w-full h-full rounded-full object-cover scale-[1.3] md:scale-[1.4] translate-y-4 relative z-30" src={Photo} alt="Alfitra Fadjri" />
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-1 md:-top-4 md:-right-10 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border shadow-lg z-30"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--glass-border)' }}
            >
              <span className="text-xs md:text-sm font-mono font-bold" style={{ color: 'var(--accent-cyan)' }}>People Person 🤝</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border shadow-lg z-30"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--glass-border)' }}
            >
              <span className="text-xs md:text-sm font-mono font-bold" style={{ color: 'var(--accent-purple)' }}>Code & Coffee ☕</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -right-10 md:-right-32 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border shadow-lg z-30 transform -translate-y-1/2"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--glass-border)' }}
            >
              <span className="text-xs md:text-sm font-mono font-bold" style={{ color: 'var(--accent-pink)' }}>Always Learning ✨</span>
            </motion.div>
          </div>
        </motion.div>

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
    <div className="relative z-20 mb-10 md:mb-0">
      <GlassIcons items={items} />
    </div>
  );
}
