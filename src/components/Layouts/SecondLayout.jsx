import { Head } from '@/components/Head';
import { SecondNavbar } from '../SecondNavbar';
import { Footer } from '../Footer';
import { themes } from '@/utils/theme';
import { useTheme } from '@/utils/themeContext';
import { useLocation } from 'react-router-dom';

export const SecondLayout = ({ title, children }) => {
  const { theme } = useTheme();
  const location = useLocation();

  const isSilentPage = ["/balanjo"];
  const hideFooter = isSilentPage.includes(location.pathname);

  const bgColor = theme === 'dark' ? 'var(--bg-primary)' : '#f0f0f5';
  const textColor = theme === 'dark' ? 'var(--text-primary)' : '#1a1a2e';

  return (
    <>
      <Head title={title} />

      <div
        className="relative min-h-screen w-full transition-colors duration-300 overflow-hidden"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {/* Dot Pattern Overlay */}
        <div 
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.15]"
          style={{
            backgroundImage: theme === 'dark' 
              ? 'radial-gradient(#ffffff 1px, transparent 1px)' 
              : 'radial-gradient(#000000 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Cyan / Teal Radial Gradients for NEW world */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background: theme === 'dark'
              ? `radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0,240,255,0.12) 0%, transparent 60%),
                 radial-gradient(ellipse 60% 50% at 100% 100%, rgba(57,175,175,0.08) 0%, transparent 60%)`
              : `radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0,240,255,0.06) 0%, transparent 60%),
                 radial-gradient(ellipse 60% 50% at 100% 100%, rgba(57,175,175,0.04) 0%, transparent 60%)`,
          }}
        />

        <SecondNavbar />
        
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col overflow-hidden px-[1rem] pt-32 pb-10 md:p-0 md:pt-32 xl:overflow-visible">
          <div className="px-5 lg:px-8 fade-in-up">{children}</div>
        </div>
        
        <div className="relative z-10">
          {!hideFooter && <Footer />}
        </div>
      </div>
    </>
  );
};
