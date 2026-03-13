import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { buildFileUrl } from '@/utils/build_file_url';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: string;
  fileId: number;
  filename: string;
}

export function FilePreviewModal({ isOpen, onClose, module, fileId, filename }: FilePreviewModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && filename) {
      const fetchFile = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const url = buildFileUrl(module, String(fileId), filename);
          const authToken = localStorage.getItem('token');
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Error al cargar el archivo');
          }

          const arrayBuffer = await response.arrayBuffer();
          let mimeType = 'application/octet-stream';
          const lowerFilename = filename.toLowerCase();
          
          if (lowerFilename.endsWith('.pdf')) {
            mimeType = 'application/pdf';
          } else if (lowerFilename.match(/\.(jpeg|jpg)$/)) {
            mimeType = 'image/jpeg';
          } else if (lowerFilename.endsWith('.png')) {
            mimeType = 'image/png';
          } else if (lowerFilename.endsWith('.gif')) {
            mimeType = 'image/gif';
          } else if (lowerFilename.endsWith('.webp')) {
            mimeType = 'image/webp';
          } else if (lowerFilename.endsWith('.svg')) {
            mimeType = 'image/svg+xml';
          }

          const blob = new Blob([arrayBuffer], { type: mimeType });
          const urlObj = window.URL.createObjectURL(blob);
          setBlobUrl(urlObj);
        } catch (err: any) {
          setError(err.message || 'Error desconocido');
        } finally {
          setIsLoading(false);
        }
      };

      fetchFile();
    }

    return () => {
      if (blobUrl) {
        window.URL.revokeObjectURL(blobUrl);
      }
    };
  }, [isOpen, module, fileId, filename]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPdf = filename?.toLowerCase().endsWith('.pdf');
  const isImage = filename?.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp|svg)$/);

  const handleDownload = () => {
    if (blobUrl) {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.click();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
            Vista previa: {filename}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2"
              title="Descargar archivo"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2"
              title="Cerrar"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative bg-gray-100 flex items-center justify-center rounded-b-2xl p-4">
          {isLoading && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600 font-medium">Cargando vista previa...</p>
            </div>
          )}

          {error && (
            <div className="text-center p-4">
              <p className="text-red-500 mb-2">Error al cargar el documento.</p>
              <p className="text-gray-600 text-sm">{error}</p>
            </div>
          )}

          {!isLoading && !error && blobUrl && (
            <div className="w-full h-full flex items-center justify-center overflow-auto bg-white rounded-lg shadow-inner">
              {isPdf ? (
                <iframe
                  src={`${blobUrl}#toolbar=0`}
                  className="w-full h-full border-0 rounded-lg"
                  title="PDF Preview"
                />
              ) : isImage ? (
                <img
                  src={blobUrl}
                  alt={filename}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    La vista previa no está disponible para este tipo de archivo.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#cf2e2e] text-white rounded-lg hover:bg-[#b02727] transition-colors mx-auto"
                  >
                    <Download size={20} />
                    <span>Descargar archivo</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
