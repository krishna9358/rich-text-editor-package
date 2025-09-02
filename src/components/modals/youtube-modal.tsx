import React, { useState, useEffect } from "react";
import { getYouTubeEmbedUrl, isValidYouTubeUrl, getDefaultDimensions } from "../utils/youtube";

interface YouTubeModalProps {
  isOpen: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  closeModal: () => void;
  onSubmit: (data: { url: string; width: string; height: string }) => void;
}

export default function YoutubeModal({
  isOpen,
  onOpenChange,
  closeModal,
  onSubmit,
}: YouTubeModalProps) {
  const [url, setUrl] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl("");
      setWidth("");
      setHeight("");
      setError(null);
    }
  }, [isOpen]);

  const updateDimensions = (newWidth: string, newHeight: string) => {
    const w = newWidth ? parseInt(newWidth) : undefined;
    const h = newHeight ? parseInt(newHeight) : undefined;
    
    if (w && w < 320) return;
    if (h && h < 180) return;
    
    const { width: finalWidth, height: finalHeight } = getDefaultDimensions(w, h);
    setWidth(finalWidth.toString());
    setHeight(finalHeight.toString());
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    updateDimensions(newWidth, height);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    updateDimensions(width, newHeight);
  };

  const handleSubmit = () => {
    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    const embedUrl = getYouTubeEmbedUrl(url);
    if (!embedUrl) {
      setError("Could not process YouTube URL");
      return;
    }

    const { width: finalWidth, height: finalHeight } = getDefaultDimensions(
      width ? parseInt(width) : undefined,
      height ? parseInt(height) : undefined
    );

    onSubmit({
      url: embedUrl,
      width: finalWidth.toString(),
      height: finalHeight.toString()
    });
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md z-[9999] border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Attach Video</h3>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL
            </label>
            <input
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="Enter YouTube URL or video ID..."
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Accepts YouTube URLs (youtube.com, youtu.be) or video IDs
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (px)
              </label>
              <input
                value={width}
                onChange={handleWidthChange}
                placeholder="e.g., 640"
                type="number"
                min="320"
                step="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Min: 320px</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (px)
              </label>
              <input
                value={height}
                onChange={handleHeightChange}
                placeholder="e.g., 360"
                type="number"
                min="180"
                step="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Min: 180px</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Dimensions will maintain 16:9 aspect ratio
          </p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={!url}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
