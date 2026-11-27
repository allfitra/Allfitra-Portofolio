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

  const bgColor = 'var(--bg-primary)';
  const textColor = 'var(--text-primary)';

  return (
    <>
      <Head title={title} />

      <div
        className="relative min-h-screen w-full transition-colors duration-300 overflow-hidden"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
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
