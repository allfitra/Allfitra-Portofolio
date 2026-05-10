import { Head } from '@/components/Head';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { useTheme } from '@/utils/themeContext';

export const MainLayout = ({ title, children }) => {
  const { theme } = useTheme();

  const bgColor = theme === 'dark' ? 'var(--bg-primary)' : '#f0f0f5';
  const textColor = theme === 'dark' ? 'var(--text-primary)' : '#1a1a2e';

  return (
    <>
      <Head title={title} />

      <div
        className="relative min-h-screen w-full transition-colors duration-300"
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
      </div>
    </>
  );
};
