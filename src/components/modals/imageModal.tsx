import React from "react";
import { useState } from "react";
import { Editor } from '@tiptap/react';
import ImageUploader from "../uploader/ImageUploader";

interface ImageModalProps {
  isOpen: boolean;
  onOpenChange?: () => void;
  closeModal: () => void;
  editor: Editor;
  token?: string;
}

export default function ImageModal({
  isOpen,

  closeModal,
  editor,
  token,
}: ImageModalProps) {
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isUploading, ] = useState(false);
  const [, setUploadedImage] = useState<any>(null);

  const isValidImageSrc = (value: string | null | undefined): boolean => {
    if (!value) return false;
    return (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("/") ||
      value.startsWith("data:") ||
      value.startsWith("blob:")
    );
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setUploadedImage(null);
    if (!e.target.value) {
      setUrlError(null);
    } else if (!isValidImageSrc(e.target.value)) {
      setUrlError('Enter a valid image URL starting with http(s)://, /, data:, or blob:');
    } else {
      setUrlError(null);
    }
  };

  const handleSubmit = () => {
    if (!url || (url && !isValidImageSrc(url))) {
      setUrlError('Please enter a valid image URL');
      return;
    }

    if (!altText) {
      return;
    }

    if (editor) {
      try {
        editor
          .chain()
          .focus()
          .setImage({ 
            src: url,
            alt: altText,
            title: altText,
            width: width ? parseInt(width) : undefined,
            height: height ? parseInt(height) : undefined,
          })
          .run();

        handleReset();
        closeModal();
      } catch (error) {
        console.error('Error inserting image:', error);
      }
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setUrl("");
    setAltText("");
    setWidth("");
    setHeight("");
    setUrlError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md z-[9999] border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Image</h3>
          <button 
            onClick={() => {
              closeModal();
              handleReset();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        <div className="space-y-4">
          <ImageUploader
            token={token}
            onUploaded={(uploaded) => {
              setUrl(uploaded.link);
            }}
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              {url && (
                <button onClick={() => setUrl("")} className="text-xs text-gray-500 hover:text-red-500 transition-colors">Clear</button>
              )}
            </div>
            <input
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {urlError && (
              <div className="mt-1 text-xs text-red-500">{urlError}</div>
            )}
            {url && (
              <div className="mt-1 text-xs text-gray-500">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  View image
                </a>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Alt Text</label>
                <div className="text-xs text-gray-400">Required</div>
              </div>
              <input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="mt-1 text-xs text-gray-500">Helps accessibility and SEO</div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Dimensions</label>
                <div className="text-xs text-gray-400">Optional</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Width (px)"
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Height (px)"
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mt-1 text-xs text-gray-500">Leave empty to keep original size</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => {
              closeModal();
              handleReset();
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={(!!url && !isValidImageSrc(url)) || (!url) || !altText || isUploading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Insert'}
          </button>
        </div>
      </div>
    </div>
  );
}
