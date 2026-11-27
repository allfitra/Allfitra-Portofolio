import { Head } from '@/components/Head';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { useTheme } from '@/utils/themeContext';
import { Link, useLocation } from 'react-router-dom';

export const MainLayout = ({ title, children }) => {
  const { theme } = useTheme();
  const location = useLocation();

  const bgColor = 'var(--bg-primary)';
  const textColor = 'var(--text-primary)';

  const showFloatingButton = location.pathname !== '/send-message' && location.pathname !== '/not-found';

  return (
    <>
      <Head title={title} />

      <div
        className="relative min-h-screen w-full transition-colors duration-300 overflow-hidden"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
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
            to="/send-message"
            className="fixed bottom-24 right-4 md:bottom-10 md:right-10 z-[100] p-3 md:p-4 rounded-full shadow-md transition-all duration-200 hover:-translate-y-0.5 group flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
            }}
            aria-label="Send Anonymous Message"
          >
            {/* Tooltip (Desktop Only) */}
            <span
              className="absolute right-full mr-3 hidden md:block px-3.5 py-2 rounded-xl text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
              style={{
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
              }}
            >
              Send me a secret message
            </span>

            {/* Chat Icon */}
            <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </Link>
        )}
      </div>
    </>
  );
};
