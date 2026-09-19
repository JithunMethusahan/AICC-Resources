import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Resources from './pages/Resources';
import ResourceCategory from './pages/ResourceCategory';
import ResourceSyllabus from './pages/ResourceSyllabus';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/resources' || !pathname.startsWith('/resources/')) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/resources" replace />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/general/:categoryId" element={<ResourceCategory />} />
        <Route path="/resources/syllabus/:sectionId" element={<ResourceSyllabus />} />
        <Route path="/resources/syllabus/:sectionId/:subsectionId" element={<ResourceSyllabus />} />
        <Route path="*" element={<Navigate to="/resources" replace />} />
      </Routes>
    </HashRouter>
  );
}
