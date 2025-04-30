import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { FiImage, FiSave, FiPlay, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const CodeEditorPage = () => {
  const {
    codeContent,
    setCodeContent,
    selectedImage,
    insertSelectedImage,
    compileToPdf,
    theme,
    images,
  } = useAppContext();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  const handleCompile = () => {
    if (!codeContent.trim()) {
      showCustomNotification(
        "Please add some content before compiling",
        "error"
      );
      return;
    }

    compileToPdf();
    showCustomNotification(
      "Successfully compiled! View in PDF Preview",
      "success"
    );
  };

  const handleInsertImage = () => {
    if (!selectedImage) {
      showCustomNotification("Please select an image first", "error");
      return;
    }

    insertSelectedImage();
    showCustomNotification(`Image "${selectedImage.name}" inserted`, "success");
  };

  const showCustomNotification = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  useEffect(() => {
    // Check if there are any images
    if (images.length === 0) {
      showCustomNotification(
        "You have no images uploaded. Consider uploading some to enhance your document.",
        "info"
      );
    }
  }, [images]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Code Editor</h1>
        <p
          className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
        >
          Write your code here and insert images. Compile to generate a PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div
            className={`rounded-lg overflow-hidden border ${
              theme === "dark" ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <CodeMirror
              value={codeContent}
              height="600px"
              extensions={[javascript({ jsx: true })]}
              onChange={(value) => setCodeContent(value)}
              theme={theme === "dark" ? "dark" : "light"}
              className={theme === "dark" ? "bg-gray-800" : "bg-white"}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <h2 className="text-xl font-semibold mb-4">Tools</h2>

            <div className="space-y-4">
              <div>
                <p
                  className={`text-sm mb-2 font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Selected Image
                </p>
                {selectedImage ? (
                  <div className="p-2 rounded-md border overflow-hidden">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.name}
                      className="w-full h-24 object-contain mb-2"
                    />
                    <p className="text-sm truncate">{selectedImage.name}</p>
                  </div>
                ) : (
                  <div
                    className={`p-4 rounded-md ${
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    } text-center`}
                  >
                    <p className="text-sm">No image selected</p>
                    <Link
                      to="/images"
                      className="text-sm text-primary-500 hover:underline"
                    >
                      Select an image
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={handleCompile}
                  className={`w-full px-4 py-2 rounded-md text-white ${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  <FiPlay className="inline-block w-4 h-4 mr-2" />
                  Compile to PDF
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleInsertImage}
                  className={`w-full btn ${
                    selectedImage
                      ? "btn-primary"
                      : "btn-outline opacity-50 cursor-not-allowed"
                  } flex items-center justify-center space-x-2`}
                  disabled={!selectedImage}
                >
                  <FiImage />
                  <span>Insert Image</span>
                </button>

                <button
                  onClick={handleCompile}
                  className="w-full btn btn-secondary flex items-center justify-center space-x-2"
                >
                  <FiPlay />
                  <span>Compile to PDF</span>
                </button>
              </div>

              <div
                className={`p-4 rounded-md ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <h3 className="font-medium mb-2">Tips</h3>
                <ul
                  className={`text-sm space-y-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <li>• Use HTML tags for formatting</li>
                  <li>• Insert images from the toolbar</li>
                  <li>• Compile to generate a PDF</li>
                  <li>• View and download in PDF Preview</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link to="/images" className="btn btn-outline">
          Back to Images
        </Link>
        <Link to="/pdf" className="btn btn-primary">
          Go to PDF Preview
        </Link>
      </div>

      {/* Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
            notificationType === "success"
              ? "bg-success-500 text-white"
              : notificationType === "error"
              ? "bg-error-500 text-white"
              : "bg-warning-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notificationType === "error" && <FiAlertCircle />}
            <p>{notificationMessage}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CodeEditorPage;
