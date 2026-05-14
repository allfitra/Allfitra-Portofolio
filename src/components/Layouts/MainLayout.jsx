import { Head } from '@/components/Head';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { useTheme } from '@/utils/themeContext';
import { Link, useLocation } from 'react-router-dom';

export const MainLayout = ({ title, children }) => {
  const { theme } = useTheme();
  const location = useLocation();

  const bgColor = theme === 'dark' ? 'var(--bg-primary)' : '#f0f0f5';
  const textColor = theme === 'dark' ? 'var(--text-primary)' : '#1a1a2e';

  const showFloatingButton = location.pathname !== '/anonymous-message' && location.pathname !== '/not-found';

  return (
    <>
      <Head title={title} />

      <div
        className="relative min-h-screen w-full transition-colors duration-300 overflow-hidden"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {/* Dot Pattern Overlay */}
        {/* <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.15]"
          style={{
            backgroundImage: theme === 'dark'
              ? 'radial-gradient(#ffffff 1px, transparent 1px)'
              : 'radial-gradient(#000000 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        /> */}

        {/* Static, lightweight radial background — no blur, no repaint */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background: theme === 'dark'
              ? `radial-gradient(ellipse 80% 60% at 0% 0%, rgba(157,78,221,0.12) 0%, transparent 60%),
                 radial-gradient(ellipse 60% 50% at 100% 100%, rgba(255,16,83,0.08) 0%, transparent 60%)`
              : `radial-gradient(ellipse 80% 60% at 0% 0%, rgba(157,78,221,0.06) 0%, transparent 60%),
                 radial-gradient(ellipse 60% 50% at 100% 100%, rgba(255,16,83,0.04) 0%, transparent 60%)`,
          }}
        />

        <Navbar />

        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col pb-10 pt-28 px-5 lg:px-8">
          {children}
        </div>

        <div className="relative z-10">
          <Footer />
        </div>

        {/* Floating Anonymous Message Button */}
        {showFloatingButton && (
          <Link
            to="/anonymous-message"
            className="fixed bottom-24 right-4 md:bottom-10 md:right-10 z-[100] p-3 md:p-4 rounded-full shadow-[0_4px_20px_rgba(157,78,221,0.5)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 group flex items-center justify-center cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              color: '#fff',
            }}
            aria-label="Send Anonymous Message"
          >
            {/* Tooltip (Desktop Only) */}
            <span
              className="absolute right-full mr-4 hidden md:block px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
              style={{
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              Send me a secret message! 🤫
            </span>

            {/* Chat Icon */}
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </Link>
        )}
      </div>
    </>
  );
};
