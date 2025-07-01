import React from 'react';

export const Footer = () => {
  return (
    <>
      <footer className="hidden lg:block">
        <div className="flex h-full w-full items-end justify-center pb-6 pt-3 font-mono">
          <h1 className="flex text-base font-semibold md:text-lg">
            &copy;{new Date().getFullYear()} | @allfitra_
          </h1>
        </div>
      </footer>
    </>
  );
};
