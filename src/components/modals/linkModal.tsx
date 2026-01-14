import React, { useState, useEffect } from "react";
import { Switch } from "@heroui/react";

interface LinkModalProps {
  isOpen: boolean;
  onOpenChange?: () => void;
  closeModal: () => void;
  selectedText?: string;
  existingUrl?: string;
  existingNofollow?: boolean;
  onSubmit: (data: { url: string; text?: string; nofollow: boolean }) => void;
  onUnset?: () => void;
}

export default function LinkModal({
  isOpen,
  closeModal,
  selectedText,
  existingUrl,
  existingNofollow,
  onSubmit,
  onUnset,
}: LinkModalProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [nofollow, setNofollow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (selectedText) {
        setText(selectedText);
      }
      if (existingUrl) {
        setUrl(existingUrl);
      }
      if (existingNofollow !== undefined) {
        setNofollow(existingNofollow);
      }
    } else {
      setText("");
      setUrl("");
      setNofollow(false);
    }
  }, [isOpen, selectedText, existingUrl, existingNofollow]);

  const handleSubmit = () => {
    if (onSubmit) { 
      onSubmit({ url, text: text || undefined, nofollow });
    }
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md z-[9999] border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Insert Link</h3>
          <div className="flex items-center gap-3">
            {/* Nofollow Toggle */}
            <Switch
              isSelected={nofollow}
              onValueChange={setNofollow}
              size="sm"
            >
              <span className="text-sm text-gray-600">Nofollow</span>
            </Switch>
            <button 
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text
            </label>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Link text (optional)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Insert URL..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {existingUrl && (
            <button
              onClick={() => { onUnset?.(); closeModal(); }}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md mr-auto"
            >
              Remove link
            </button>
          )}
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
