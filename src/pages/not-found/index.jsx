import React from 'react';

export const NotFoundPage = () => {
  return (
    <section className="flex h-screen w-full items-center justify-center">
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-white lg:text-9xl">404</h1>
        <p className="mb-4 text-3xl font-bold tracking-tight text-red-500 dark:text-white md:text-4xl">
          Something's missing.
        </p>
        <p className="mb-4 text-lg font-light text-blue-500 dark:text-gray-400">
          Sorry, we can't find that page. You'll find lots to explore on the home page.
        </p>
        <a
          href="/"
          className="hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
        >
          Back to Homepage
        </a>
      </div>
    </section>
  );
};
