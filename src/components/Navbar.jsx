import { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';

import burgerButton from '@/assets/images/burger-button.png';
import { MoonIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const Navbar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(null);
  const [navigation, setNavigation] = useState([
    { name: 'Home', href: '/', current: location.pathname === '/' },
    {
      name: 'Education and Certificate',
      href: '/education',
      current: location.pathname === '/education',
    },
    { name: 'Experience', href: '/experience', current: location.pathname === '/experience' },
    { name: 'Project', href: '/project', current: location.pathname === '/project' },
    { name: 'Contact', href: '/contact', current: location.pathname === '/contact' },
  ]);

  const { pathname } = useLocation();

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
    <nav className={`container fixed top-0 z-20 max-w-none bg-[#1D1D1D] px-6 shadow-md`}>
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="flex justify-center">
              <div className="relative flex h-20 w-full max-w-7xl items-center justify-between px-14">
                <div className="absolute inset-y-0 right-0 flex items-center lg:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="hover: relative inline-flex items-center justify-center rounded-md p-2 hover:text-primary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>

                    <div className="mr-6 rounded-full bg-[#333] p-1">
                      <MoonIcon />
                    </div>

                    {open ? (
                      <p className="block h-6 w-6 bg-white" aria-hidden="true">
                        X
                      </p>
                    ) : (
                      <img
                        src={burgerButton}
                        className="block h-6 w-6 bg-white"
                        aria-hidden="true"
                      ></img>
                    )}
                  </Disclosure.Button>
                </div>
                <h1 className="font-heading text-2xl font-bold">Allfitra {'{}'}</h1>
                <div className="flex flex-shrink-0 items-center">
                  <div className="hidden sm:ml-6 lg:block ">
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
                      <button className="mt-1 rounded-full bg-[#333] p-1">
                        <MoonIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    onClick={() => handleItemClick(item)}
                    className={classNames(
                      item.current ? 'text-lg font-bold' : 'hover:font-bold',
                      'block rounded-md px-3 py-2 font-heading text-base '
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </nav>
  );
};

const backgroundButton = [
  {
    boxShadow: '0 2px 10px #2ab0ee',
    backgroundColor: '#2ab0ee',
    color: '#ffffff',
  },
  {
    boxShadow: '0 2px 10px #eb6559',
    backgroundColor: '#eb6559',
    color: '#ffffff',
  },
  {
    boxShadow: '0 2px 10px #f7b908',
    backgroundColor: '#f7b908',
    color: '#ffffff',
  },
  {
    boxShadow: '0 2px 10px #e44160',
    backgroundColor: '#e44160',
    color: '#ffffff',
  },
  {
    boxShadow: '0 1px 10px #47a148',
    backgroundColor: '#47a148',
    color: '#ffffff',
  },
];
