import { useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { themes } from '@/utils/theme';
import { useTheme } from '@/utils/themeContext';
import { afLogo } from '@/assets/Content';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const SecondNavbar = () => {
  const [navigation, setNavigation] = useState([
    { name: 'Base', href: '/base', current: location.pathname === '/base' },
    // { name: 'Blog', href: '/blog', current: location.pathname === '/blog' },
    { name: 'PitBooth', href: '/pitbooth', current: location.pathname === '/pitbooth' },
    { name: 'Galery', href: '/galery', current: location.pathname === '/galery' },
    { name: 'Support Me', href: '/support-me', current: location.pathname === '/support-me' },
  ]);

  useEffect(() => {
    const updatedNavigation = navigation.map((item) => ({
      ...item,
      current: location.pathname === item.href,
    }));
    setNavigation(updatedNavigation);
  }, [location]);

  return (
    <>
      <WebNavbar navigation={navigation} />
      <MobileNavbar navigation={navigation} />
    </>
  );
};

const WebNavbar = ({ navigation }) => {
  const { theme, changeTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(null);

  return (
    <nav
      className={`duration-600 container fixed top-0 z-10 hidden max-w-none bg-[#1D1D1D] px-6 pt-3 transition-all ease-in-out md:block`}
      style={theme === 'dark' ? themes.dark : themes.light}
    >
      <div className="flex justify-center">
        <div className="relative flex h-20 w-full max-w-6xl items-center justify-between md:px-10">
          <div className="mt-4 flex gap-2">
            <Link to={'/'}>
              <img className="h-[60px] " src={afLogo} alt="Allfitra Logos" />
            </Link>
            <div
              className={`mx-auto h-[60px] w-[2px] ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
            />
            <Link to={'/base'} className="flex flex-col justify-center font-mono leading-none">
              <h2 className="text-[35px] tracking-widest">NEW</h2>
              <h3 className="text-[24px]">world</h3>
            </Link>
          </div>

          <div className="-ml-4 mt-8 flex flex-shrink-0 items-center">
            <div className="flex gap-2">
              {navigation.map((item, i) => (
                <div
                  key={item.name}
                  // style={isHovered === i || item.current ? backgroundButton[i] : {}}
                  className="rounded p-1.5 transition duration-300 ease-in-out"
                  onMouseEnter={() => setIsHovered(i)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current && 'font-bold',
                      'rounded-md px-2 py-2 font-heading text-base '
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={changeTheme}
              className={classNames(
                'duration-900 rounded-full p-1.5 transition-transform',
                theme === 'dark' ? 'translate-x-0 bg-[#333] pr-12' : 'translate-x-5 bg-[#ccc] pl-12'
              )}
            >
              {theme === 'dark' ? <MoonIcon /> : <SunIcon color="black" />}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <hr
          className={`w-[75%] border-[1px] ${theme === 'dark' ? 'border-white' : 'border-black'}`}
        />
      </div>
    </nav>
  );
};

const MobileNavbar = ({ navigation }) => {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={
        'container fixed top-0 z-50 block h-[95px] w-full max-w-none px-8 pb-6 text-white transition duration-200 md:hidden'
      }
      style={theme === 'dark' ? themes.dark : themes.light}
    >
      <div className="flex justify-center">
        <div className="relative flex h-20 w-full max-w-7xl items-center justify-between">
          <div className="mt-5">
            <button
              onClick={changeTheme}
              className={classNames(
                'rounded-full p-3 transition-transform duration-500',
                theme === 'dark' ? 'rotate-0 bg-[#333]' : 'rotate-180 bg-[#ccc]'
              )}
            >
              {theme === 'dark' ? <MoonIcon /> : <SunIcon color="black" />}
            </button>
          </div>

          {/* Logo */}
          <div className="mt-4 flex gap-1">
            <Link to="/">
              <img className="ml-0 mt-1.5 h-[50px] w-[50px] xl:ml-2" src={afLogo} alt="KMM Logos" />
            </Link>
            <div className="mx-auto mt-1.5 h-[50px] w-[2px] bg-gray-300" />
            <Link to={'/base'} className="flex flex-col justify-center font-mono leading-none">
              <h2 className="text-[35px] tracking-widest">NEW</h2>
              <h3 className="text-[24px]">world</h3>
            </Link>
          </div>

          {/* Burger Button */}
          <div className="mt-5 flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 flex-col items-center justify-center rounded focus:outline-none"
              aria-label="Open menu"
            >
              <span
                className={classNames(
                  'mb-2 block h-0.5 w-8 transition-transform duration-300',
                  theme === 'dark' ? 'bg-white' : 'bg-black',
                  isOpen && 'translate-y-2 rotate-45'
                )}
              ></span>
              <span
                className={classNames(
                  'mb-2 block h-0.5 w-8 transition-opacity duration-300',
                  theme === 'dark' ? 'bg-white' : 'bg-black',
                  isOpen && 'opacity-0'
                )}
              ></span>
              <span
                className={classNames(
                  'block h-0.5 w-8 transition-transform duration-300',
                  theme === 'dark' ? 'bg-white' : 'bg-black',
                  isOpen && '-translate-y-3 -rotate-45'
                )}
              ></span>
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex justify-center">
        <hr
          className={`mt-[13px] w-[100%] border-t-2 border-[#39afaf]`}
          // className={`mt-[13px] w-[100%] border-t-2 ${theme === 'dark' ? 'border-white' : 'border-black'}`}
        />
      </div>

      {/* Dropdown menu */}
      <div
        className={classNames(
          'ease-in-ou duration-900 w-full overflow-hidden rounded-b-2xl bg-[#39afaf] text-center shadow-md transition-all',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {navigation.map((item) => (
          <div key={item.name} className="px-2 py-1.5">
            <Link
              to={item.href}
              className={classNames(
                item.current && 'bg-[#2e7b7b] font-bold',
                'block rounded-md px-4 py-2 font-heading text-base transition'
              )}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
};
