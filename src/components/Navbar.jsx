import { useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { themes } from '@/utils/theme';
import { useTheme } from '@/utils/themeContext';
import {
  sendMessageIconLight,
  sendMessageIconDark,
  logoName,
  homeIcon,
  educationIcon,
  experienceIcon,
  projectIcon,
  contactIcon,
  afLogo,
} from '@/assets/Content';
import { catKnitting, waitingAvatar } from '@/assets/Other';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Navbar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(null);
  const [navigation, setNavigation] = useState([
    { name: 'Home', href: '/', current: location.pathname === '/', icon: homeIcon },
    {
      name: 'Education',
      href: '/education',
      current: location.pathname === '/education',
      icon: educationIcon,
    },
    {
      name: 'Experience',
      href: '/experience',
      current: location.pathname === '/experience',
      icon: experienceIcon,
    },
    {
      name: 'Project',
      href: '/project',
      current: location.pathname === '/project',
      icon: projectIcon,
    },
    {
      name: 'Contact',
      href: '/contact',
      current: location.pathname === '/contact',
      icon: contactIcon,
    },
    // {
    //   name: 'Message',
    //   href: '/anonymous-message',
    //   current: location.pathname === '/anonymous-message',
    //   icon: contactIcon,
    // },
  ]);

  const { pathname } = useLocation();
  const { theme, changeTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(1, 0);
  }, [pathname]);

  useEffect(() => {
    const updatedNavigation = navigation.map((item) => ({
      ...item,
      current: location.pathname === item.href,
    }));
    setNavigation(updatedNavigation);
  }, [location]);

  return (
    <>
      {location.pathname !== '/anonymous-message' && <SendAnonymousMessage />}

      {/* Web Navbar */}
      <nav
        className={`duration-600 container fixed top-0 z-20 hidden h-[100px] max-w-none bg-[#1D1D1D] px-6 pt-7 transition lg:block`}
        style={theme === 'dark' ? themes.dark : themes.light}
      >
        <div className="flex justify-center">
          <div className="relative flex h-20 w-full max-w-7xl items-center justify-between px-14">
            <div className="flex items-center gap-10">
              <Link to={'/'}>
                {/* <h1 className="font-heading text-3xl font-bold md:ml-10">*Allfitra</h1> */}
                <img className="ml-16 h-[60px]" src={afLogo} alt="Allfitra Logos" />
              </Link>
              <div className="mt-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text p-2 text-xl font-semibold italic text-transparent drop-shadow-lg">
                <Link to={'/base'}>Another World</Link>
              </div>
            </div>
            <div className="mt-2 flex flex-shrink-0 items-center">
              <div className="flex gap-4 space-x-4">
                {location.pathname !== '/anonymous-message' &&
                  navigation.map((item, i) => (
                    <div
                      key={item.name}
                      style={isHovered === i || item.current ? backgroundButton[i] : {}}
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
                {theme === 'dark' ? (
                  <button
                    onClick={changeTheme}
                    className="rounded-full p-1.5 pr-12 transition duration-300"
                    style={{ backgroundColor: '#333' }}
                  >
                    <MoonIcon />
                  </button>
                ) : (
                  <button
                    onClick={changeTheme}
                    className="translate-x-5 rounded-full p-1.5 pl-12 transition duration-300"
                    style={{ backgroundColor: '#ccc' }}
                  >
                    <SunIcon color="black" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <Link to={'/base'} className="lg:hidden">
        <div className="-mt-5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text p-2 px-10 text-xl font-semibold italic text-transparent drop-shadow-lg">
          <h1>Another World</h1>
        </div>
      </Link>

      <nav className="mt-50 duration-600 fixed bottom-2 left-0 z-50 w-full bg-none px-3 transition lg:hidden">
        <div className="mb-[-15px] flex justify-center">
          <div>
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
        </div>
        <div
          className={`flex justify-center rounded-full border-t border-black pt-2 dark:border-gray-200 ${
            theme === 'dark'
              ? 'bg-white bg-opacity-70 text-black'
              : 'bg-black bg-opacity-70 text-white'
          }`}
        >
          <div className="relative flex h-16 w-full items-center justify-around">
            {location.pathname !== '/anonymous-message' ? (
              navigation.map((item, i) => (
                <div
                  key={item.name}
                  className="rounded-full p-1 transition duration-300 ease-in-out"
                  onMouseEnter={() => setIsHovered(i)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current && 'font-bold',
                      'rounded-full px-2 py-2 font-heading text-base'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    <div
                      className={`rounded-xl p-1 ${
                        theme === 'dark' ? 'bg-black bg-opacity-50' : 'bg-white bg-opacity-50'
                      }`}
                      style={item.current ? backgroundButton[i] : {}}
                    >
                      <img src={item.icon} alt="Icon" width="35" height="35" />
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <>
                {/* <Link to={'/'}> */}
                <img className="h-[50px]" src={afLogo} alt="Allfitra Logos" />
                {/* </Link> */}

                <div className="absolute -bottom-[2px] left-1">
                  <img className="w-[120px]" src={catKnitting} alt="Meoww" />
                </div>
                <div className="absolute -right-7 bottom-0">
                  <img className="w-[150px]" src={waitingAvatar} alt="Help me!!" />
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

const SendAnonymousMessage = () => {
  const { theme } = useTheme();
  return (
    <div className="fixed bottom-4 right-6 z-50 mb-[80px] cursor-pointer lg:mb-0">
      <Link to={'/anonymous-message'}>
        <img
          className="animate-flip w-[65px] md:w-[90px]"
          src={theme === 'dark' ? sendMessageIconDark : sendMessageIconLight}
          alt="Send Message"
        />
      </Link>
    </div>
  );
};

const backgroundButton = [
  {
    boxShadow: '0 2px 10px #2ab0ee',
    backgroundColor: '#2ab0ee',
  },
  {
    boxShadow: '0 2px 10px #eb6559',
    backgroundColor: '#eb6559',
  },
  {
    boxShadow: '0 2px 10px #f7b908',
    backgroundColor: '#f7b908',
  },
  {
    boxShadow: '0 2px 10px #e44160',
    backgroundColor: '#e44160',
  },
  {
    boxShadow: '0 1px 10px #47a148',
    backgroundColor: '#47a148',
  },
];
