import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Editor } from '@tiptap/react';

export default function TableControls({ editor }: { editor: Editor }) {
  const [buttonPos, setButtonPos] = useState<{ top: number; left: number } | null>(null);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!editor.isActive('table')) { 
        setButtonPos(null); 
        setOpen(false);
        return; 
      }
      const table = editor.view.dom.querySelector('table') as HTMLElement | null;
      if (!table) { 
        setButtonPos(null); 
        setOpen(false);
        return; 
      }
      const rect = table.getBoundingClientRect();
      const editorContainer = editor.view.dom.closest('.prose') as HTMLElement | null;
      const containerRect = editorContainer?.getBoundingClientRect();
      
      if (containerRect) {
        setButtonPos({ 
          top: rect.bottom - containerRect.top - 8, 
          left: rect.right - containerRect.left - 8 
        });
      }
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    editor.on('selectionUpdate', update);
    editor.on('update', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      editor.off('selectionUpdate', update);
      editor.off('update', update);
    };
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
        menuRef.current && !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  if (!buttonPos) return null;

  const run = (cmd: () => any) => { cmd(); setOpen(false); };

  return (
    <div>
      <button
        ref={buttonRef}
        className="absolute z-[100] bg-blue-500 hover:bg-blue-600 text-white w-7 h-7 rounded-full font-bold flex items-center justify-center shadow-lg transition-colors"
        style={{ top: `${buttonPos.top}px`, left: `${buttonPos.left}px` }}
        onClick={() => setOpen(o => !o)}
        aria-label="Table options"
      >
        +
      </button>

      {open && (
        <div 
          ref={menuRef}
          className="absolute z-[101] bg-white border border-gray-300 rounded-lg shadow-xl p-2 text-sm min-w-[180px]" 
          style={{ top: `${buttonPos.top + 32}px`, left: `${buttonPos.left - 160}px` }}
        >
          <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors" onClick={() => run(() => editor.chain().focus().addRowAfter().run())}>
            Add row below
          </button>

          <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors" onClick={() => run(() => editor.chain().focus().addRowBefore().run())}>
            Add row above
          </button>

          <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors" onClick={() => run(() => editor.chain().focus().addColumnAfter().run())}>
            Add column right
          </button>

          <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md transition-colors" onClick={() => run(() => editor.chain().focus().addColumnBefore().run())}>
            Add column left
          </button>

          <hr className="my-1 border-gray-200" />

          <button className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-md transition-colors" onClick={() => run(() => editor.chain().focus().deleteRow().run())}>
            Delete row
          </button>

          <button className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-md transition-colors" onClick={() => run(() => editor.chain().focus().deleteColumn().run())}>
            Delete column
          </button>

          <button className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-md transition-colors" onClick={() => run(() => editor.chain().focus().deleteTable().run())}>
            Delete table
          </button>
        </div>
      )}
    </div>
  );
}
