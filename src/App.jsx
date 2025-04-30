import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ImageUploadPage from './pages/ImageUploadPage';
import CodeEditorPage from './pages/CodeEditorPage';
import PdfViewerPage from './pages/PdfViewerPage';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="images" element={<ImageUploadPage />} />
          <Route path="editor" element={<CodeEditorPage />} />
          <Route path="pdf" element={<PdfViewerPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;