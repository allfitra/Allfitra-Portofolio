import { Head } from '@/components/Head';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

export const MainLayout = ({ title, children }) => {
  return (
    <>
      <Head title={title} />

      <div className="mt-28 bg-[#1D1D1D] text-white">
        <Navbar />
        <div className="mx-auto flex max-w-7xl flex-col overflow-hidden xl:overflow-visible">
          <div className=" px-5 lg:px-8">{children}</div>
        </div>
        <Footer />
      </div>
    </>
  );
};
