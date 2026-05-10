import React from 'react';

export const Footer = () => {
  return (
    <>
      <footer className="hidden lg:block">
        <div className="flex h-full w-full items-end justify-center font-mono">
          <h1 className="flex text-base font-semibold md:text-lg" style={{ color: 'var(--text-tertiary)' }}>
            &copy; {new Date().getFullYear()} | @allfitra_
          </h1>
        </div>
      </footer>
    </>
  );
};
