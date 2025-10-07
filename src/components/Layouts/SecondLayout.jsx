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
  return (
    <>
      <Head title={title} />

      <div
        className="duration-600 pt-32 transition md:pt-32"
        style={theme === 'dark' ? themes.dark : themes.light}
      >
        <SecondNavbar />
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col overflow-hidden px-[1rem] md:p-0 xl:overflow-visible">
          <div className="px-5 lg:px-8">{children}</div>
        </div>
        {!hideFooter && <Footer />}
      </div>
    </>
  );
};
