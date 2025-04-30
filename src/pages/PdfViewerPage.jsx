import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { FiDownload, FiEdit, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js"; // Import html2pdf.js

import "./style.css"; // Make sure you have your styles in this file

const PdfViewerPage = () => {
  const { pdfContent, codeContent, compileToPdf, theme } = useAppContext();

  const pdfContainerRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (!pdfContent && codeContent) {
      compileToPdf();
    }
  }, [pdfContent, codeContent, compileToPdf]);

  const generatePdf = () => {
    if (!pdfContent || !pdfContainerRef.current) {
      setError("No content available to generate PDF");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      const container = pdfContainerRef.current;
      container.style.display = "block";

      setTimeout(() => {
        const options = {
          margin: [10, 10, 10, 10],
          filename: "generated_document.pdf",
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        };

        html2pdf()
          .from(container)
          .set(options)
          .toPdf()
          .get("pdf")
          .then((pdf) => {
            // Save the generated PDF blob
            const pdfBlobData = pdf.output("blob");
            setPdfBlob(pdfBlobData);
            const newPdfUrl = URL.createObjectURL(pdfBlobData);
            setPdfUrl(newPdfUrl);
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);
            setError("Failed to generate PDF. Please try again.");
            setPdfBlob(null);
            setPdfUrl(null);
          })
          .finally(() => {
            setIsGenerating(false);
            container.style.display = "none";
          });
      }, 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
      setPdfBlob(null);
      setPdfUrl(null);
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfBlob) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `document-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (pdfContent) {
      generatePdf();
    }
  }, [pdfContent]);

  if (!pdfContent) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PDF Preview</h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            No PDF content available. Please compile your code to generate a
            PDF.
          </p>
        </div>

        <div
          className={`text-center py-20 ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-100"
          } rounded-lg flex flex-col items-center justify-center`}
        >
          <FiAlertCircle size={48} className="mb-4 text-gray-400" />
          <p className="text-xl mb-4">No PDF has been generated yet</p>
          <p
            className={`mb-6 max-w-md ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Go to the Code Editor to write your code and compile it to PDF
          </p>
          <Link to="/editor" className="btn btn-primary">
            Go to Code Editor
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PDF Preview</h1>
        <p
          className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
        >
          View and download your generated PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div
            className={`rounded-lg overflow-hidden border ${
              theme === "dark" ? "border-gray-700" : "border-gray-300"
            } bg-white`}
          >
            {error ? (
              <div className="w-full h-[600px] flex items-center justify-center">
                <div className="text-center text-red-500">
                  <FiAlertCircle size={48} className="mx-auto mb-4" />
                  <p className="font-medium">Error generating PDF</p>
                  <p className="text-sm mt-2">{error}</p>
                </div>
              </div>
            ) : pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-[600px]"
                title="PDF Preview"
              />
            ) : (
              <div className="w-full h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                  <p>Generating PDF preview...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <h2 className="text-xl font-semibold mb-4">PDF Actions</h2>

            <div className="space-y-4">
              <div
                className={`p-3 rounded-md ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm">
                  {new Date(pdfContent.compiledAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleDownloadPdf}
                  className={`w-full btn btn-primary flex items-center justify-center space-x-2 ${
                    !pdfBlob ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!pdfBlob}
                >
                  <FiDownload />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={generatePdf}
                  className={`w-full btn btn-outline flex items-center justify-center space-x-2 ${
                    isGenerating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isGenerating}
                >
                  <FiRefreshCw className={isGenerating ? "animate-spin" : ""} />
                  <span>
                    {isGenerating ? "Regenerating..." : "Regenerate PDF"}
                  </span>
                </button>

                <Link
                  to="/editor"
                  className="w-full btn btn-outline flex items-center justify-center space-x-2"
                >
                  <FiEdit />
                  <span>Edit Content</span>
                </Link>
              </div>

              <div
                className={`p-4 rounded-md ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <h3 className="font-medium mb-2">Next Steps</h3>
                <ul
                  className={`text-sm space-y-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <li>• Download the PDF</li>
                  <li>• Share with colleagues</li>
                  <li>• Make edits in the Code Editor</li>
                  <li>• Add more images if needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden">
        <div
          ref={pdfContainerRef}
          className="p-8 bg-white text-black"
          style={{ width: "800px", minHeight: "500px", display: "none" }}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Generated Document</h1>
            <p className="text-sm text-gray-500">
              Created on {new Date().toLocaleString()}
            </p>
          </div>

          <div className="pdf-content">
            <div className="markdown-body">
              <div
                dangerouslySetInnerHTML={{
                  __html: pdfContent?.code?.replace(/\n/g, "<br>"),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .markdown-body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.5;
          color: #24292e;
          padding: 1rem;
        }
        .markdown-body pre {
          background-color: #f6f8fa;
          border-radius: 6px;
          padding: 1rem;
          overflow-x: auto;
        }
        .markdown-body code {
          font-family: "Consolas", "Monaco", "Courier New", monospace;
          font-size: 0.875em;
        }
        .markdown-body img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
      `}</style>

      <div className="mt-8 flex justify-between">
        <Link to="/editor" className="btn btn-outline">
          Back to Editor
        </Link>
        <Link to="/images" className="btn btn-outline">
          Manage Images
        </Link>
      </div>
    </div>
  );
};

export default PdfViewerPage;
