import { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';

import burgerButton from '@/assets/images/burger-button.png';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { themes } from '@/utils/theme';
import { useTheme } from '@/utils/themeContext';
import { logoName } from '@/assets/Content';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Navbar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(null);
  const [navigation, setNavigation] = useState([
    { name: 'Home', href: '/', current: location.pathname === '/' },
    {
      name: 'Education',
      href: '/education',
      current: location.pathname === '/education',
    },
    { name: 'Experience', href: '/experience', current: location.pathname === '/experience' },
    { name: 'Project', href: '/project', current: location.pathname === '/project' },
    { name: 'Contact', href: '/contact', current: location.pathname === '/contact' },
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
      {/* Web Navbar */}
      <nav
        className={`container fixed top-0 z-20 hidden max-w-none bg-[#1D1D1D] px-6 lg:block`}
        style={theme === 'dark' ? themes.dark : themes.light}
      >
        <div className="flex justify-center">
          <div className="relative flex h-20 w-full max-w-7xl items-center justify-between md:px-14">
            <Link to={'/'}>
              {/* <h1 className="font-heading text-3xl font-bold md:ml-10">*Allfitra</h1> */}
              <img
                className="ml-0 mt-4 h-[150px] w-[200px] xl:ml-7"
                src={logoName}
                alt="Allfitra Logos"
              />
            </Link>
            <div className="flex flex-shrink-0 items-center">
              <div className="flex gap-4 space-x-4">
                {navigation.map((item, i) => (
                  <div
                    key={item.name}
                    style={isHovered === i ? backgroundButton[i] : {}}
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
      <nav className="mt-50 fixed bottom-2 left-0 z-50 w-full bg-none px-3 lg:hidden">
        <div className="mb-[-20px] flex justify-center">
          <div>
            {theme === 'dark' ? (
              <button
                onClick={changeTheme}
                className="rounded-full p-3"
                style={{ backgroundColor: '#333' }}
              >
                <MoonIcon />
              </button>
            ) : (
              <button
                onClick={changeTheme}
                className="rounded-full p-3"
                style={{ backgroundColor: '#ccc' }}
              >
                <SunIcon color="black" />
              </button>
            )}
          </div>
        </div>
        <div
          className={`flex justify-center rounded-full border-t border-black dark:border-gray-200 ${
            theme === 'dark'
              ? 'bg-white bg-opacity-70 text-black'
              : 'bg-black bg-opacity-70 text-white'
          }`}
        >
          <div className="relative flex h-16 w-full max-w-7xl items-center justify-around">
            {navigation.map((item, i) => (
              <div
                key={item.name}
                style={isHovered === i ? backgroundButton[i] : {}}
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
                  style={item.current ? backgroundButton[i] : {}}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
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
