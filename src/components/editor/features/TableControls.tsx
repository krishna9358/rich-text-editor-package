"use client";
import { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';

export default function TableControls({ editor }: { editor: Editor }) {
  const [buttonPos, setButtonPos] = useState<{ top: number; left: number } | null>(null);
  const [open, setOpen] = useState(false);

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

  if (!buttonPos) return null;

  const run = (cmd: () => any) => { cmd(); setOpen(false); };

  return (
    <div>
      <button
        className="fixed z-40 text-black w-6 h-6 font-bold flex items-center justify-center"
        style={{ top: buttonPos.top, left: buttonPos.left }}
        onClick={() => setOpen(o => !o)}
        aria-label="Table options"
      >
        +
      </button>

      {open && (
        <div className="fixed z-50 bg-white border rounded shadow p-2 text-sm" style={{ top: buttonPos.top + 24, left: buttonPos.left - 160 }}>
          <button className="block w-full text-left px-2 py-1 hover:bg-gray-100" onClick={() => run(() => editor.chain().focus().addRowAfter().run())}>
            Add row below
          </button>

          <button className="block w-full text-left px-2 py-1 hover:bg-gray-100" onClick={() => run(() => editor.chain().focus().addRowBefore().run())}>
            Add row above
          </button>

          <button className="block w-full text-left px-2 py-1 hover:bg-gray-100" onClick={() => run(() => editor.chain().focus().addColumnAfter().run())}>
            Add column right
          </button>

          <button className="block w-full text-left px-2 py-1 hover:bg-gray-100" onClick={() => run(() => editor.chain().focus().addColumnBefore().run())}>
            Add column left
          </button>
        </div>
      )}
    </div>
  );
}
