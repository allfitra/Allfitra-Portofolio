import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/utils/themeContext';
import { afLogo } from '@/assets/Content';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const SecondNavbar = () => {
  const location = useLocation();
  const [navigation, setNavigation] = useState([
    { name: 'Base', href: '/world/home', current: location.pathname === '/world/home' },
    { name: 'World Cup', href: '/world/cup', current: location.pathname === '/world/cup' },
    // { name: 'PitBooth', href: '/world/pitbooth', current: location.pathname === '/world/pitbooth' },
    // { name: 'Galery', href: '/world/galery', current: location.pathname === '/world/galery' },
    // { name: 'Support Me', href: '/world/support-me', current: location.pathname === '/world/support-me' },
  ]);

  useEffect(() => {
    const updatedNavigation = navigation.map((item) => ({
      ...item,
      current: location.pathname === item.href,
    }));
    setNavigation(updatedNavigation);
  }, [location.pathname]);

  return (
    <>
      <WebNavbar navigation={navigation} />
      <MobileNavbar navigation={navigation} />
    </>
  );
};

const WebNavbar = ({ navigation }) => {
  const { theme, changeTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-200 hidden md:block ${isScrolled
          ? 'bg-[var(--bg-primary)] shadow-sm py-2 border-b border-[var(--glass-border)]'
          : 'bg-transparent py-4'
        }`}
    >
      <div className="flex justify-center">
        <div className="relative flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-10">

          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link to={'/'} className="transition-transform duration-200 hover:scale-105">
              <img className="h-[45px] object-contain" src={afLogo} alt="Allfitra Logos" />
            </Link>
            <div className="h-[40px] w-[1px] bg-[var(--glass-border)]" />
            <Link to={'/world/home'} className="flex flex-col justify-center font-mono leading-none transition-transform duration-200 hover:scale-105 group">
              <h2 className="text-[28px] tracking-widest font-bold group-hover:text-[var(--accent-primary)] transition-colors" style={{ color: 'var(--text-primary)' }}>NEW</h2>
              <h3 className="text-[18px]" style={{ color: 'var(--text-secondary)' }}>world</h3>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  item.current
                    ? 'text-[var(--accent-primary)] font-bold bg-[var(--accent-subtle)] border border-[var(--accent-border)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-transparent',
                  'rounded px-4 py-1.5 font-heading text-sm transition-all duration-200'
                )}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <button
              onClick={changeTheme}
              className="p-2 rounded border border-[var(--glass-border)] transition-colors duration-200"
              style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Decorative Divider */}
      <div className={`flex justify-center transition-opacity duration-200 ${isScrolled ? 'opacity-0' : 'opacity-100'} mt-2`}>
        <hr className="w-[75%] border-t border-[var(--glass-border)]" />
      </div>
    </nav>
  );
};

const MobileNavbar = ({ navigation }) => {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-200 md:hidden ${isScrolled || isOpen
          ? 'bg-[var(--bg-primary)] shadow-sm border-b border-[var(--glass-border)]'
          : 'bg-transparent'
        }`}
    >
      <div className="flex justify-center px-4 py-3">
        <div className="relative flex w-full items-center justify-between">

          {/* Theme Toggle */}
          <div className="flex items-center">
            <button
              onClick={changeTheme}
              className="p-2 rounded border border-[var(--glass-border)] transition-transform duration-200 active:scale-95"
              style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>

          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <img className="h-[35px] w-[35px] object-contain" src={afLogo} alt="Logo" />
            </Link>
            <div className="h-[30px] w-[1px] bg-[var(--glass-border)]" />
            <Link to={'/world/home'} className="flex flex-col justify-center font-mono leading-none">
              <h2 className="text-[20px] tracking-widest font-bold" style={{ color: 'var(--text-primary)' }}>NEW</h2>
              <h3 className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>world</h3>
            </Link>
          </div>

          {/* Burger Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 flex-col items-center justify-center rounded border border-[var(--glass-border)] focus:outline-none transition-colors"
              style={{ background: 'var(--card-bg)' }}
              aria-label="Open menu"
            >
              <span
                className={classNames(
                  'block h-[2px] w-5 transition-transform duration-200 mb-1.5',
                  isOpen ? 'translate-y-[8px] rotate-45' : '',
                )}
                style={{ background: 'var(--text-primary)' }}
              ></span>
              <span
                className={classNames(
                  'block h-[2px] w-5 transition-opacity duration-200 mb-1.5',
                  isOpen ? 'opacity-0' : 'opacity-100'
                )}
                style={{ background: 'var(--text-primary)' }}
              ></span>
              <span
                className={classNames(
                  'block h-[2px] w-5 transition-transform duration-200',
                  isOpen ? '-translate-y-[8px] -rotate-45' : ''
                )}
                style={{ background: 'var(--text-primary)' }}
              ></span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Divider (visible only when not scrolled and not open) */}
      {!isScrolled && !isOpen && (
        <div className="flex justify-center px-4">
          <hr className="w-full border-t border-[var(--glass-border)]" />
        </div>
      )}

      {/* Dropdown menu */}
      <div
        className={classNames(
          'w-full overflow-hidden transition-all duration-200 ease-in-out border-b border-[var(--glass-border)] shadow-lg',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="px-4 py-3 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                item.current
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold border border-[var(--accent-border)]'
                  : 'text-[var(--text-primary)] border border-transparent',
                'block rounded px-4 py-2.5 text-center text-sm transition-colors'
              )}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
