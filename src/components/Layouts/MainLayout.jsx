import { Head } from '@/components/Head';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { themes } from '@/utils/theme';
import { useTheme } from '@/utils/themeContext';

export const MainLayout = ({ title, children }) => {
  const { theme } = useTheme();
  return (
    <>
      <Head title={title} />

      <div
        className="duration-600 pb-10 pt-10 transition md:pb-0 md:pt-28"
        style={theme === 'dark' ? themes.dark : themes.light}
      >
        <Navbar />
        <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col overflow-hidden xl:overflow-visible">
          <div className=" px-5 lg:px-8">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  );
};
