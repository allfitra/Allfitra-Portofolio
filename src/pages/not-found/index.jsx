import React from 'react';
import { MainLayout } from '@/components/Layouts';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <MainLayout title="404 Not Found">
      <div className="flex flex-col items-center justify-center min-h-[75vh] text-center fade-in-up px-4">
        <div className="relative mb-4">
          <h1 className="text-8xl md:text-[140px] font-black leading-none relative z-10 text-gradient">
            404
          </h1>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Page Not Found
        </h2>

        <p className="text-base md:text-lg mb-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
          Oops! The page you're looking for seems to have vanished into the void. Let's get you back home.
        </p>

        <Link
          to="/"
          className="premium-btn"
        >
          Return to Homepage
        </Link>
      </div>
    </MainLayout>
  );
};
