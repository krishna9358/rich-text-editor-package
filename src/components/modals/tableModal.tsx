import { useState } from "react";

interface TableModalProps {
  isOpen: boolean;
  onOpenChange?: () => void;
  closeModal: () => void;
  onSubmit: (data: { rows: string; cols: string }) => void;
}

export default function TableModal({
  isOpen,
  onOpenChange,
  closeModal,
  onSubmit,
}: TableModalProps) {
  const [rows, setRows] = useState("2");
  const [cols, setCols] = useState("3");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ rows, cols });
    }
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md z-[9999] border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Insert Table</h3>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rows
            </label>
            <input
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              placeholder="Number of rows..."
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Columns
            </label>
            <input
              value={cols}
              onChange={(e) => setCols(e.target.value)}
              placeholder="Number of columns..."
              type="number"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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
            disabled={!rows || !cols || parseInt(rows) < 1 || parseInt(cols) < 1}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
