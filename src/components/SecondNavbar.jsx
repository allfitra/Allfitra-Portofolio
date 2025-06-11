import { useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { themes } from '@/utils/theme';
import { useTheme } from '@/utils/themeContext';
import { logoName, homeIcon } from '@/assets/Content';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const SecondNavbar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(null);
  const [navigation, setNavigation] = useState([
    { name: 'Blog', href: '/blog', current: location.pathname === '/blog', icon: homeIcon },
  ]);

  const { pathname } = useLocation();
  const { theme, changeTheme } = useTheme();

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
              <img className="mt-4 h-[50px] w-[200px]" src={logoName} alt="Allfitra Logos" />
            </Link>
            <div className="-ml-4 flex flex-shrink-0 items-center">
              <div className="flex gap-4 space-x-4">
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
            <div>
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
      </nav>
      <div className="flex justify-center">
        <hr className="w-[85%]" />
      </div>
    </>
  );
};
