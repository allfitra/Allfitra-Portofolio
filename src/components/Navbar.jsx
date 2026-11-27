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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
        className="glass-pill flex items-center px-4 py-2 pointer-events-auto gap-4 md:gap-8 transition-all duration-200"
        style={{
          background: 'var(--card-bg)',
          borderColor: isScrolled ? 'var(--accent-border)' : 'var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        <Link to="/" className="flex items-center justify-center pl-2 pr-4">
          <img className="h-8 w-auto md:h-9 transition-transform duration-200 hover:scale-105" src={afLogo} alt="Allfitra" />
        </Link>

        <div className="hidden md:flex items-center gap-1 relative">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="relative px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  color: isActive
                    ? 'var(--accent-primary)'
                    : hoveredIndex === index
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'var(--accent-subtle)',
                      border: '1px solid var(--accent-border)',
                    }}
                    transition={{ type: "spring", bounce: 0.15, stiffness: 160, damping: 16 }}
                  />
                )}
                {hoveredIndex === index && !isActive && (
                  <motion.div
                    layoutId="navbar-hover"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--bg-tertiary)' }}
                    transition={{ type: "spring", bounce: 0.15, stiffness: 160, damping: 16 }}
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
            className="p-2 rounded-full border transition-colors duration-200"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--glass-border)',
              color: 'var(--text-primary)',
            }}
            aria-label="Toggle Theme"
          >
            {isDark ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav
        className="glass-pill fixed bottom-5 left-1/2 -translate-x-1/2 md:hidden flex items-center px-2 py-1.5 pointer-events-auto gap-1 z-50"
        style={{
          background: 'var(--card-bg)',
          borderColor: 'var(--glass-border)',
        }}
      >
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className="px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
              style={{
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
