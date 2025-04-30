import React, { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiTrash2, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ImageUploadPage = () => {
  const { images, addImages, deleteImage, selectImage, selectedImage, theme } = useAppContext();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      addImages(acceptedFiles);
    }
  }, [addImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Upload</h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Upload images to use in your documents. Select an image to insert it into your code.
        </p>
      </div>
      
      <div className="mb-8">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? theme === 'dark' ? 'border-primary-400 bg-gray-800' : 'border-primary-500 bg-primary-50' 
              : theme === 'dark' ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="mx-auto mb-4 text-4xl text-gray-400" />
          <p className="mb-2 font-medium">
            {isDragActive ? 'Drop the files here...' : 'Drag & drop images here, or click to select files'}
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Supports: JPG, PNG, GIF, SVG, WebP
          </p>
        </div>
      </div>

      {images.length > 0 ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Images ({images.length})</h2>
            {selectedImage && (
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Selected: {selectedImage.name}
                </span>
                <Link 
                  to="/editor" 
                  className="btn btn-primary text-sm py-1"
                >
                  Use in Editor
                </Link>
              </div>
            )}
          </div>

          <motion.div 
            className="image-gallery"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {images.map((image) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                className={`image-item aspect-square group ${
                  selectedImage && selectedImage.id === image.id ? 'selected' : ''
                }`}
                onClick={() => selectImage(image.id)}
              >
                <div className="relative h-full">
                  <img 
                    src={image.url} 
                    alt={image.name} 
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md ${
                    theme === 'dark' ? 'bg-black/50' : 'bg-white/50'
                  }`}>
                    {selectedImage && selectedImage.id === image.id ? (
                      <div className="bg-success-500 text-white p-2 rounded-full">
                        <FiCheck size={20} />
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(image.id);
                        }}
                        className="bg-error-500 text-white p-2 rounded-full hover:bg-error-600 transition-colors"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm truncate">{image.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
          <p className="text-xl">No images uploaded yet.</p>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Upload some images to get started.
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Link to="/editor" className="btn btn-primary">
          Go to Code Editor
        </Link>
      </div>
    </div>
  );
};

export default ImageUploadPage;