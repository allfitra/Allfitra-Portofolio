import { Route, Routes, useLocation } from 'react-router-dom';

import { AnonymousPage } from '@/pages/main/anonymous-message';
import { ContactPage } from '@/pages/main/contact';
import { EducationPage } from '@/pages/main/education';
import { ExperiencePage } from '@/pages/main/experience';
import { MessagesListPage } from '@/pages/silent/messages-list';
import { NotFoundPage } from '@/pages/not-found';
import { ProjectPage } from '@/pages/main/project';
import { BlogPage } from '@/pages/second/blog';
import { HomePage } from '@/pages/main/home';
import { BasePage } from '@/pages/second/base';
import { SupportMe } from '@/pages/second/support-me';
import { useEffect } from 'react';
import { MyGalery } from '@/pages/second/galery';
import { Pitbooth } from '@/pages/second/pitbooth';
import { FinancialReport } from '@/pages/silent/financial-report';

export const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Main */}
        <Route path="/" element={<HomePage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Second */}
        <Route path="/world/home" element={<BasePage />} />
        {/* <Route path="/blog" element={<BlogPage />} /> */}
        <Route path="/world/pitbooth" element={<Pitbooth />} />
        <Route path="/world/galery" element={<MyGalery />} />
        <Route path="/world/support-me" element={<SupportMe />} />

        {/* Extra */}
        <Route path="/anonymous-message" element={<AnonymousPage />} />
        <Route path="/230701" element={<MessagesListPage />} />
        <Route path="/balanjo" element={<FinancialReport />} />

        {/* Not Found */}
        <Route path="/not-found" element={<NotFoundPage />} />
        {/* Catch-all route for 404 */}
        <Route path="/:any" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', // Menambahkan animasi smooth scroll
    });
  }, [location]);

  return null;
};
