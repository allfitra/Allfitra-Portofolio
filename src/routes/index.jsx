import { Route, Routes } from 'react-router-dom';

import { AnonymousPage } from '@/pages/anonymous-message';
import { ContactPage } from '@/pages/contact';
import { EducationPage } from '@/pages/education';
import { ExperiencePage } from '@/pages/experience';
import { HomePage } from '@/pages/home';
import { MessagesListPage } from '@/pages/messages-list';
import { NotFoundPage } from '@/pages/not-found';
import { ProjectPage } from '@/pages/project';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/education" element={<EducationPage />} />
      <Route path="/experience" element={<ExperiencePage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/anonymous-message" element={<AnonymousPage />} />
      <Route path="/230701" element={<MessagesListPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
