import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';
import { motion } from 'framer-motion';
import { afLogo } from '@/assets/Content';

export const Navbar = () => {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Education', href: '/education' },
    { name: 'Experience', href: '/experience' },
    { name: 'Project', href: '/project' },
    { name: 'Contact', href: '/contact' },
  ];

  const { theme, changeTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <nav
        className="glass-pill flex items-center px-4 py-2 pointer-events-auto gap-4 md:gap-8 transition-all duration-300"
        style={{
          background: isScrolled
            ? (isDark ? '#17171d' : '#ffffff')
            : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'),
          borderColor: isScrolled
            ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)')
            : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
          boxShadow: isScrolled ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        <Link to="/" className="flex items-center justify-center pl-2 pr-4">
          <img className="h-8 w-auto md:h-10 transition-transform duration-300 hover:scale-110" src={afLogo} alt="Allfitra" />
        </Link>

        <div className="hidden md:flex items-center gap-2 relative">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            const activeColor = isDark ? 'white' : '#1a1a2e';
            const inactiveColor = 'var(--text-secondary)';
            return (
              <Link
                key={item.name}
                to={item.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ color: isActive || hoveredIndex === index ? activeColor : inactiveColor }}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-full"
                    style={{ background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }}
                    transition={{ type: "spring", bounce: 0.25, stiffness: 130, damping: 9, duration: 0.3 }}
                  />
                )}
                {hoveredIndex === index && !isActive && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 rounded-full"
                    style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                    transition={{ type: "spring", bounce: 0.25, stiffness: 130, damping: 9, duration: 0.3 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-center pl-2">
          <button
            onClick={changeTheme}
            className="p-2 rounded-full transition-all duration-300"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              color: isDark ? '#f0f0ff' : '#1a1a2e',
            }}
            aria-label="Toggle Theme"
          >
            {isDark ? <MoonIcon size={20} /> : <SunIcon size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav
        className="glass-pill fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden flex items-center px-2 py-2 pointer-events-auto gap-1 z-50"
        style={{
          background: isDark ? 'rgba(15,15,18,0.88)' : 'rgba(240,240,245,0.90)',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        }}
      >
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className="px-3 py-2 rounded-full text-xs font-medium transition-all duration-300"
              style={{
                background: isActive ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)') : 'transparent',
                color: isActive ? (isDark ? 'white' : '#1a1a2e') : 'var(--text-secondary)',
              }}
            >
              {item.name}
            </Link>
          );
        })}

        {/* <button
          onClick={changeTheme}
          className="ml-2 p-2 rounded-full transition-all duration-300"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            color: isDark ? '#f0f0ff' : '#1a1a2e',
          }}
          aria-label="Toggle Theme"
        >
          {isDark ? <MoonIcon size={16} /> : <SunIcon size={16} />}
        </button> */}
      </nav>
    </div>
  );
};
