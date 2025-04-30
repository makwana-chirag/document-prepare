import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiCode, FiFileText } from 'react-icons/fi';
import { useAppContext } from '../context/AppContext';

const HomePage = () => {
  const { theme } = useAppContext();
  
  const features = [
    {
      icon: <FiUpload size={32} />,
      title: 'Upload Images',
      description: 'Upload and manage images to use in your documents.',
      link: '/images',
      color: 'bg-primary-500',
    },
    {
      icon: <FiCode size={32} />,
      title: 'Code Editor',
      description: 'Write and format code with our powerful editor.',
      link: '/editor',
      color: 'bg-secondary-500',
    },
    {
      icon: <FiFileText size={32} />,
      title: 'PDF Preview',
      description: 'Preview and download your compiled documents as PDFs.',
      link: '/pdf',
      color: 'bg-accent-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <section className="text-center mb-16">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Document Preparation Tool
        </motion.h1>
        <motion.p 
          className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A powerful tool for creating professional documents with code and images.
        </motion.p>
      </section>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Link 
              to={feature.link}
              className={`card h-full flex flex-col items-center text-center p-8 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className={`${feature.color} text-white p-4 rounded-full mb-6`}>
                {feature.icon}
              </div>
              <h2 className="text-2xl font-semibold mb-4">{feature.title}</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                {feature.description}
              </p>
              <div className={`mt-auto inline-block px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} hover:opacity-90 transition-opacity`}>
                Get Started
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.section 
        className={`rounded-xl p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md text-center`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-4">Ready to create amazing documents?</h2>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
          Start by uploading images or jumping straight into the code editor.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/images" 
            className="btn btn-primary"
          >
            Upload Images
          </Link>
          <Link 
            to="/editor" 
            className="btn btn-secondary"
          >
            Open Editor
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;