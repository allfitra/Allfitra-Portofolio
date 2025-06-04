import { Route, Routes } from 'react-router-dom';

import { AnonymousPage } from '@/pages/main/anonymous-message';
import { ContactPage } from '@/pages/main/contact';
import { EducationPage } from '@/pages/main/education';
import { ExperiencePage } from '@/pages/main/experience';
import { MessagesListPage } from '@/pages/main/messages-list';
import { NotFoundPage } from '@/pages/not-found';
import { ProjectPage } from '@/pages/main/project';
import { BlogPage } from '@/pages/second/blog';
import { HomePage } from '@/pages/main/home';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/education" element={<EducationPage />} />
      <Route path="/experience" element={<ExperiencePage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route path="/blog" element={<BlogPage />} />
      <Route path="/anonymous-message" element={<AnonymousPage />} />
      <Route path="/230701" element={<MessagesListPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
