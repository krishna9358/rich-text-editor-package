// ===============================================================================================
// Format menu bar for Tiptap used for formatting text used in the File Menubar
// ===============================================================================================
"use client";
import { useState } from "react";
import { Editor } from "@tiptap/react";
import { BoldIcon } from "../../tiptap-icons/bold-icon";
import { ItalicIcon } from "../../tiptap-icons/italic-icon";
import { UnderlineIcon } from "../../tiptap-icons/underline-icon";
import { StrikeIcon } from "../../tiptap-icons/strike-icon";
import { SubscriptIcon } from "../../tiptap-icons/subscript-icon";
import { SuperscriptIcon } from "../../tiptap-icons/superscript-icon";
import { Code2Icon } from "../../tiptap-icons/code2-icon";
import { AlignLeftIcon } from "../../tiptap-icons/align-left-icon";
import { AlignCenterIcon } from "../../tiptap-icons/align-center-icon";
import { AlignRightIcon } from "../../tiptap-icons/align-right-icon";
import { ListIcon } from "../../tiptap-icons/list-icon";
import { ListOrderedIcon } from "../../tiptap-icons/list-ordered-icon";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { BlockquoteIcon } from "../../tiptap-icons/blockquote-icon";

type Props = { editor: Editor };

// Format menu component
export default function FormatMenu({ editor }: Props) {
  // State for the format menu
  const [open, setOpen] = useState(false);
  const [textStyleOpen, setTextStyleOpen] = useState(false);
  const [formatsOpen, setFormatsOpen] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [alignOpen, setAlignOpen] = useState(false);
  const [listsOpen, setListsOpen] = useState(false);
  const [colorsOpen, setColorsOpen] = useState(false);

  // Font sizes
  const fontSizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72] as const;

  // Return the format menu component
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm" onClick={() => setOpen(!open)}>Format</button>
      {open && (
        <div className="absolute z-50 mt-1 bg-white border rounded shadow min-w-[220px] py-1">
          {/* Text Style submenu */}
          <div className="relative" onMouseEnter={() => setTextStyleOpen(true)} onMouseLeave={() => setTextStyleOpen(false)}>
            {/* Text style button */}
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100">
              <span>Text style</span>
              <ChevronRightIcon className="w-4 h-4 inline" />
            </button>

            {/* Text style menu */}
            {textStyleOpen && (
              <div className="absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[240px] ">
                {/* Bold button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md" onClick={() => editor.chain().focus().toggleBold().run()}><BoldIcon className="w-4 h-4 inline text-gray-800"/> Bold</button>

                {/* Italic button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md" onClick={() => editor.chain().focus().toggleItalic().run()}><ItalicIcon className="w-4 h-4 inline text-gray-800"/> Italic</button>

                {/* Underline button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md" onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4 inline text-gray-800"/> Underline</button>

                {/* Strikethrough button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md" onClick={() => editor.chain().focus().toggleStrike().run()}><StrikeIcon className="w-4 h-4 inline text-gray-800"/> Strikethrough</button>

                {/* Superscript button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md" onClick={() => editor.chain().focus().toggleSuperscript().run()}><SuperscriptIcon className="w-4 h-4 inline text-gray-800"/> Superscript</button>

                {/* Subscript button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md" onClick={() => editor.chain().focus().toggleSubscript().run()}><SubscriptIcon className="w-4 h-4 inline text-gray-800"/> Subscript</button>

                {/* Code button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md" onClick={() => editor.chain().focus().toggleCode().run()}><Code2Icon className="w-4 h-4 inline text-gray-800"/> Code</button>
              </div>
            )}
          </div>

          {/* Formats submenu */}
          <div className="relative" onMouseEnter={() => setFormatsOpen(true)} onMouseLeave={() => setFormatsOpen(false)}>
            {/* Formats button */}
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100">
              <span>Formats</span>
              <ChevronRightIcon className="w-4 h-4 inline" />
            </button>

            {/* Formats menu */}
            {formatsOpen && (
              <div className="absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[200px]">
                {/* Heading buttons */}
                {([1,2,3,4,5,6] as const).map(level => (
                  <button key={level} className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm rounded-md" onClick={() => editor.chain().focus().toggleHeading({ level }).run()}>Heading {level}</button>
                ))}

                {/* Paragraph button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm rounded-md" onClick={() => editor.chain().focus().setParagraph().run()}>Paragraph</button>
              </div>
            )}
          </div>

          {/* Font size submenu */}
          <div className="relative" onMouseEnter={() => setFontSizeOpen(true)} onMouseLeave={() => setFontSizeOpen(false)}>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100">
              <span>Font size</span>
              <ChevronRightIcon className="w-4 h-4 inline" />
            </button>

            {/* Font size menu */}
            {fontSizeOpen && (
              <div className="absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[160px] max-h-64 overflow-auto">
                {/* Font size buttons */}
                {fontSizes.map(s => (
                  <button key={s} className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm rounded-md" onClick={() => editor.chain().focus().setFontSize(`${s}px`).run()}>{s}px</button>
                ))}
              </div>
            )}
          </div>

          {/* Align submenu */}
          <div className="relative" onMouseEnter={() => setAlignOpen(true)} onMouseLeave={() => setAlignOpen(false)}>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100">
              <span>Align</span>
              <ChevronRightIcon className="w-4 h-4 inline" />
            </button>

            {/* Align menu */}
            {alignOpen && (
              <div className="absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[180px]">
                {/* Left align button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md" onClick={() => {
                  if (editor.isActive('image')) editor.chain().focus().updateAttributes('image', { align: 'left' }).run();
                  else if (editor.isActive('youtube')) editor.chain().focus().updateAttributes('youtube', { align: 'left' }).run();
                  else editor.chain().focus().setTextAlign('left').run();
                }}><AlignLeftIcon className="w-4 h-4 inline"/> Left</button>

                {/* Center align button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md" onClick={() => {
                  if (editor.isActive('image')) editor.chain().focus().updateAttributes('image', { align: 'center' }).run();
                  else if (editor.isActive('youtube')) editor.chain().focus().updateAttributes('youtube', { align: 'center' }).run();
                  else editor.chain().focus().setTextAlign('center').run();
                }}><AlignCenterIcon className="w-4 h-4 inline"/> Center</button>

                {/* Right align button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md" onClick={() => {
                  if (editor.isActive('image')) editor.chain().focus().updateAttributes('image', { align: 'right' }).run();
                  else if (editor.isActive('youtube')) editor.chain().focus().updateAttributes('youtube', { align: 'right' }).run();
                  else editor.chain().focus().setTextAlign('right').run();
                }}><AlignRightIcon className="w-4 h-4 inline"/> Right</button>
              </div>
            )}
          </div>

          {/* Lists submenu */}
          <div className="relative" onMouseEnter={() => setListsOpen(true)} onMouseLeave={() => setListsOpen(false)}>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100">
              <span>Lists</span>
              <ChevronRightIcon className="w-4 h-4 inline" />
            </button>

            {/* Lists menu */}
            {listsOpen && (
              <div className="absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[180px]">
                {/* Bulleted list button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm rounded-md flex items-center gap-2" onClick={() => editor.chain().focus().toggleBulletList().run()}><ListIcon className="w-4 h-4 inline"/> Bulleted</button>

                {/* Numbered list button */}
                <button className="block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm rounded-md flex items-center gap-2" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrderedIcon className="w-4 h-4 inline"/> Numbered</button>
              </div>
            )}
          </div>

          {/* Colors submenu */}
          <div className="relative" onMouseEnter={() => setColorsOpen(true)} onMouseLeave={() => setColorsOpen(false)}>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100">
              <span>Colors</span>
              <ChevronRightIcon className="w-4 h-4 inline" />
            </button>

            {/* Colors menu */}
            {colorsOpen && (
              <div className="absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[220px]">
                {/* Text color input */}
                <div className="px-2 py-1 text-xs text-gray-500 flex items-center gap-2">Text</div>
                <input aria-label="text color" type="color" className="ml-2 mb-2 h-8 w-8 cursor-pointer" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />

                {/* Background color input */}
                <div className="px-2 py-1 text-xs text-gray-500">Background</div>
                <input aria-label="background color" type="color" className="ml-2 h-8 w-8 cursor-pointer" onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()} />
              </div>
            )}
          </div>

          {/* Blockquote submenu */}
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <span>Blockquote</span>
            <BlockquoteIcon className="w-4 h-4 inline" />
          </button>
        </div>
      )}
    </div>
  );
}
