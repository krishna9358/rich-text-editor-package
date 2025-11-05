// ===============================================================================================
// Table controls for Tiptap used for adding rows and columns to the table after inserting a table
// ===============================================================================================

"use client";
import React, { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  PlusCircleIcon,
  TrashIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline';

// Table controls component
export default function TableControls({ editor }: { editor: Editor }) {
  const [buttonPos, setButtonPos] = useState<{ top: number; left: number } | null>(null);
  const [open, setOpen] = useState(false);

  // Update the button position when the table is inserted
  useEffect(() => {
    const update = () => {
      if (!editor.isActive('table')) { setButtonPos(null); return; }
      const table = editor.view.dom.querySelector('table') as HTMLElement | null;
      if (!table) { setButtonPos(null); return; }
      const rect = table.getBoundingClientRect();
      setButtonPos({ top: rect.bottom + window.scrollY - 8, left: rect.right + window.scrollX - 8 });
    };
    update();
    window.addEventListener('scroll', update, true);
    editor.on('selectionUpdate', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      editor.off('selectionUpdate', update);
    };
  }, [editor]);

  // If the button position is not set, return null
  if (!buttonPos) return null;

  const run = (cmd: () => any) => { cmd(); setOpen(false); };

  // Return the table controls component
  return (
    <div>
      {/* Table controls button */}
      <button
        className="fixed z-40 text-black w-6 h-6 font-bold flex items-center justify-center "
        style={{ top: buttonPos.top, left: buttonPos.left }}
        onClick={() => setOpen(o => !o)}
        aria-label="Table options"
      >
        <PlusCircleIcon className="w-6 h-6" />
      </button>

      {/* Table controls menu */}
      {open && (
        <div className="fixed z-50 bg-white border rounded shadow p-2 text-sm" style={{ top: buttonPos.top + 24, left: buttonPos.left - 160 }}>
          {/* Add row below */}
          <button className="block flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100"
            onClick={() => run(() => editor.chain().focus().addRowAfter().run())}>
            <PlusCircleIcon className="w-4 h-4" />
            Add row below
          </button>

          {/* Add row above */}
          <button className="block flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100"
            onClick={() => run(() => editor.chain().focus().addRowBefore().run())}>
            <PlusCircleIcon className="w-4 h-4" />
            Add row above
          </button>

          {/* Add column right */}
          <button className="block flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100"
            onClick={() => run(() => editor.chain().focus().addColumnAfter().run())}>
            <PlusCircleIcon className="w-4 h-4" />
            Add column right
          </button>

          {/* Add column left */}
          <button className="block flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100"
            onClick={() => run(() => editor.chain().focus().addColumnBefore().run())}>
            <PlusCircleIcon className="w-4 h-4" />
            Add column left
          </button>

          {/* Divider */}
          <hr className="my-2" />

          {/* Delete row */}
          <button className="block flex items-center gap-2 w-full text-left px-2 py-1 text-red-600 hover:bg-red-50"
            onClick={() => run(() => editor.chain().focus().deleteRow().run())}>
            <TrashIcon className="w-4 h-4" />
            Delete row
          </button>

          {/* Delete column */}
          <button className="block flex items-center gap-2 w-full text-left px-2 py-1 text-red-600 hover:bg-red-50"
            onClick={() => run(() => editor.chain().focus().deleteColumn().run())}>
            <TrashIcon className="w-4 h-4" />
            Delete column
          </button>

          {/* Delete table */}
          <button className="block flex items-center gap-2 w-full text-left px-2 py-1 text-red-700 font-semibold hover:bg-red-100"
            onClick={() => run(() => editor.chain().focus().deleteTable().run())}>
            <MinusCircleIcon className="w-4 h-4" />
            Delete table
          </button>
        </div>
      )}
    </div>
  );
}
