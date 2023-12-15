import { Route, Routes } from 'react-router-dom';

import { HomePage } from '@/pages/home';
import { EducationPage } from '@/pages/education';
import { ExperiencePage } from '@/pages/experience';
import { ProjectPage } from '@/pages/project';
import { ContactPage } from '@/pages/contact';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/education" element={<EducationPage />} />
      <Route path="/experience" element={<ExperiencePage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
};
