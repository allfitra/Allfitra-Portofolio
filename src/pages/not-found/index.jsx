import React from 'react';
import { MainLayout } from '@/components/Layouts';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <MainLayout title="404 Not Found">
      <div className="flex flex-col items-center justify-center min-h-[75vh] text-center fade-in-up px-4">
        <div className="relative mb-6">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[var(--accent-pink)] opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

          <h1 className="text-8xl md:text-[150px] font-black leading-none relative z-10 text-gradient">
            404
          </h1>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Page Not Found
        </h2>

        <p className="text-base md:text-lg mb-10 max-w-md" style={{ color: 'var(--text-secondary)' }}>
          Oops! The page you're looking for seems to have vanished into the void. Let's get you back home.
        </p>

        <Link
          to="/"
          className="text-sm md:text-base font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(157,78,221,0.4)]"
          style={{
            background: 'rgba(157,78,221,0.15)',
            color: 'var(--accent-purple)',
            border: '1px solid rgba(157,78,221,0.3)',
          }}
        >
          Return to Homepage
        </Link>
      </div>
    </MainLayout>
  );
};
