import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const Layout = () => {
  const { theme } = useAppContext();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <footer className={`py-6 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>© 2025 Document Preparation Tool</p>
      </footer>
    </div>
  );
};

export default Layout;