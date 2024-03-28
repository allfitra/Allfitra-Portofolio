import React from 'react';

export const Footer = () => {
  return (
    <footer>
      <div className="flex h-full w-full items-end justify-center pb-6 pt-3 font-mono ">
        <h1 className="flex text-base font-semibold md:text-xl">
          &copy; {new Date().getFullYear()} || Created & Developed by : allfitra
        </h1>
      </div>
    </footer>
  );
};
