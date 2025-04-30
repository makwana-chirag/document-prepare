import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // State for uploaded images
  const [images, setImages] = useState([]);
  
  // State for selected image (for insertion into code)
  const [selectedImage, setSelectedImage] = useState(null);
  
  // State for code editor content
  const [codeContent, setCodeContent] = useState('// Write your code here\n\n');
  
  // State for PDF content
  const [pdfContent, setPdfContent] = useState(null);
  
  // State for theme (light/dark)
  const [theme, setTheme] = useState('light');

  // Load data from localStorage on initial load
  useEffect(() => {
    try {
      const savedImages = localStorage.getItem('docPrepImages');
      const savedCode = localStorage.getItem('docPrepCode');
      
      if (savedImages) {
        setImages(JSON.parse(savedImages));
      }
      
      if (savedCode) {
        setCodeContent(savedCode);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('docPrepImages', JSON.stringify(images));
    } catch (error) {
      console.error('Error saving images to localStorage:', error);
    }
  }, [images]);

  useEffect(() => {
    try {
      localStorage.setItem('docPrepCode', codeContent);
    } catch (error) {
      console.error('Error saving code to localStorage:', error);
    }
  }, [codeContent]);

  // Add new images
  const addImages = (newImages) => {
    const processedImages = newImages.map(image => ({
      id: uuidv4(),
      name: image.name,
      url: URL.createObjectURL(image),
      file: image,
      createdAt: new Date().toISOString()
    }));
    
    setImages(prevImages => [...prevImages, ...processedImages]);
  };

  // Delete an image
  const deleteImage = (id) => {
    setImages(prevImages => {
      const updatedImages = prevImages.filter(image => image.id !== id);
      
      // If the deleted image was selected, clear the selection
      if (selectedImage && selectedImage.id === id) {
        setSelectedImage(null);
      }
      
      return updatedImages;
    });
  };

  // Select an image for use in the code editor
  const selectImage = (id) => {
    const image = images.find(img => img.id === id);
    setSelectedImage(image);
  };

  // Insert selected image into code content
  const insertSelectedImage = () => {
    if (!selectedImage) return;
    
    const imageTag = `\n// Image: ${selectedImage.name}\n<img src="${selectedImage.url}" alt="${selectedImage.name}" />\n`;
    setCodeContent(prevContent => prevContent + imageTag);
  };

  // Compile code and images into PDF content
  const compileToPdf = () => {
    setPdfContent({
      code: codeContent,
      images: images.filter(img => codeContent.includes(img.url)),
      compiledAt: new Date().toISOString()
    });
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    images,
    selectedImage,
    codeContent,
    pdfContent,
    theme,
    addImages,
    deleteImage,
    selectImage,
    setCodeContent,
    insertSelectedImage,
    compileToPdf,
    toggleTheme
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};