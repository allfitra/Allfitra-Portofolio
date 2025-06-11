import { Head } from '@/components/Head';
import { SecondNavbar } from '../SecondNavbar';
import { Footer } from '../Footer';
import { themes } from '@/utils/theme';
import { useTheme } from '@/utils/themeContext';

export const SecondLayout = ({ title, children }) => {
  const { theme } = useTheme();
  return (
    <>
      <Head title={title} />

      <div className="pt-10 md:pt-28" style={theme === 'dark' ? themes.dark : themes.light}>
        <SecondNavbar />
        <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col overflow-hidden xl:overflow-visible">
          <div className=" px-5 lg:px-8">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  );
};
