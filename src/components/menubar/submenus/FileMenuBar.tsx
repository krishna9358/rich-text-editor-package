// ===============================================================================================
// File menu bar for Tiptap used for file operations
// ===============================================================================================
import React from "react";
import { useState, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import YoutubeModal from "../../modals/youtube-modal";
import TableModal from "../../modals/tableModal";
import LinkModal from "../../modals/linkModal";
import FormatMenu from "./FormatMenu";

// File menu bar component
export function FileMenuBar({ editor, onOpenFindReplace }: { editor: Editor; onOpenFindReplace: () => void }) {
  const [fileOpen, setFileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [, setIsImageModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const fileRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);
  const insertRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fileRef.current && !fileRef.current.contains(event.target as Node)) {
        setFileOpen(false);
      }
      if (editRef.current && !editRef.current.contains(event.target as Node)) {
        setEditOpen(false);
      }
      if (insertRef.current && !insertRef.current.contains(event.target as Node)) {
        setInsertOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle youtube submit
  const handleYoutubeSubmit = ({ url, width, height }: { url: string; width: string; height: string }) => {
    editor.chain().focus().insertContent({
      type: 'youtube',
      attrs: { src: url, width: parseInt(width), height: parseInt(height) }
    }).run();
  };

  // Handle table submit
  const handleTableSubmit = ({ rows, cols }: { rows: string; cols: string }) => {
    editor.chain().focus().insertTable({ rows: parseInt(rows), cols: parseInt(cols), withHeaderRow: true }).run();
  };

  // Return the file menu bar component
  return (
    <div className="flex items-center gap-3 px-2 sm:px-4 py-1 ml-2">
      {/* File */}
      {/* File menu */}
      <div className="relative" ref={fileRef}>
        {/* New file button */}
        <button className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm" onClick={() => setFileOpen(!fileOpen)}>File</button>
        {fileOpen && (
          <div className="absolute z-50 mt-1 bg-white border rounded shadow min-w-[180px]">
            <button className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm" onClick={() => { editor.commands.clearContent(true); setFileOpen(false); }}>New</button>
          </div>
        )}
      </div>

      {/* Edit */}
      {/* Edit menu */}
      <div className="relative" ref={editRef}>
        <button className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm" onClick={() => setEditOpen(!editOpen)}>Edit</button>
        {editOpen && (
          <div className="absolute z-50 mt-1 bg-white border rounded shadow min-w-[220px] p-1">
            {/* Undo button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => editor.chain().focus().undo().run()}>Undo</button>

            {/* Redo button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => editor.chain().focus().redo().run()}>Redo</button>
            <div className="h-px bg-gray-200 my-1" />

            {/* Cut button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => document.execCommand('cut')}>Cut</button>

            {/* Copy button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => document.execCommand('copy')}>Copy</button>

            {/* Paste button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => document.execCommand('paste')}>Paste</button>
            <div className="h-px bg-gray-200 my-1" />

            {/* Find and replace button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => { onOpenFindReplace(); setEditOpen(false); }}>Find & Replace</button>
          </div>
        )}
      </div>

      {/* Insert */}
      {/* Insert menu */}
      <div className="relative" ref={insertRef}>
        <button className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm" onClick={() => setInsertOpen(!insertOpen)}>Insert</button>
        {insertOpen && (
          <div className="absolute z-50 mt-1 bg-white border rounded shadow min-w-[220px] p-1">
            {/* Image button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => setIsImageModalOpen(true)}>Image</button>

            {/* Link button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => setIsLinkModalOpen(true)}>Link</button>

            {/* Youtube button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => setIsYoutubeModalOpen(true)}>Video</button>

            {/* Table button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => setIsTableModalOpen(true)}>Table</button>

            {/* Horizontal line button */}
            <button className="w-full text-left px-3 py-1 hover:bg-gray-100 text-sm" onClick={() => editor.chain().focus().setHorizontalRule().run()}>Horizontal Line</button>
          </div>
        )}
      </div>

      {/* Format */}
      {/* Format menu (submenus inside component) */}
      <FormatMenu editor={editor} />

      {/* Modals */}
      {/* Image modal */}
      {/* <ImageModal isOpen={isImageModalOpen} closeModal={() => setIsImageModalOpen(false)} onSubmit={({ url, altText, width, height }) => { */}
        {/* if (url) editor.chain().focus().setImage({ src: url, alt: altText, width: width ? parseInt(width) : undefined, height: height ? parseInt(height) : undefined }).run(); */}
      {/* }} /> */}

      {/* Youtube modal */}
      <YoutubeModal isOpen={isYoutubeModalOpen} closeModal={() => setIsYoutubeModalOpen(false)} onSubmit={handleYoutubeSubmit} />

      {/* Table modal */}
      <TableModal isOpen={isTableModalOpen} closeModal={() => setIsTableModalOpen(false)} onSubmit={handleTableSubmit} />

      {/* Link modal */}
      <LinkModal isOpen={isLinkModalOpen} closeModal={() => setIsLinkModalOpen(false)} onSubmit={({ url, text }) => {
        if (!editor.state.selection.empty) editor.chain().focus().setLink({ href: url }).run();
        else editor.chain().focus().insertContent([{ type: 'text', text: text || url, marks: [{ type: 'link', attrs: { href: url } }] }]).run();
      }} />
    </div>
  );
}

export default FileMenuBar;


