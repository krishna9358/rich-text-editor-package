import React from "react";
import { useEditorState } from "@tiptap/react";
import YoutubeModal from "../modals/youtube-modal";
import TableModal from "../modals/tableModal";
import LinkModal from "../modals/linkModal";
import { useState } from "react";
import ImageModal from "../modals/imageModal";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, AlignJustifyIcon, BlockquoteIcon, ItalicIcon, LinkIcon, ListIcon, ListOrderedIcon, Redo2Icon, StrikeIcon, TableIcon,  UnderlineIcon, Undo2Icon, ImagePlusIcon,  BoldIcon, TrashIcon, AddColumnIcon, AddRowIcon, DeleteColumnIcon, DeleteRowIcon } from "../tiptap-icons";
import YoutubeIcon from "../tiptap-icons/youtube-icon";

interface MenuBarProps {
  editor: any;
  setLink: () => void;
  unsetLink: () => void;
  token?: string;
}

const FONT_SIZES: string[] = [
  '8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'
];

const HEADING_SIZES: Record<number, string> = {
  1: '32px',
  2: '24px',
  3: '20px',
  4: '18px',
  5: '16px',
  6: '14px',
};

const MenuBar = ({ editor, unsetLink, token }: MenuBarProps) => {
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);

  const handleYoutubeSubmit = (data: { url: string; width: string; height: string }) => {
    if (!editor) return;

    try {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'youtube',
          attrs: {
            src: data.url,
            width: data.width ? parseInt(data.width) : 640,
            height: data.height ? parseInt(data.height) : 480,
            align: 'center',
          }
        })
        .run();
    } catch (error) {
      console.error('Error inserting YouTube video:', error);
    }
  };

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const getCurrentFontSize = () => {
    if (editor.isActive('heading')) {
      const level = editor.getAttributes('heading').level;
      return HEADING_SIZES[level]?.replace('px', '') || '16';
    }
    
    const attrs = editor.getAttributes('textStyle');
    if (attrs.fontSize) {
      return attrs.fontSize.replace('px', '');
    }
    return '16';
  };

  const handleFontSizeChange = (size: string) => {
    if (editor.isActive('heading')) {
      editor.chain().focus().setParagraph().run();
    }
    editor.chain().focus().setFontSize(`${size}px`).run();
  };

  const handleHeadingChange = (value: string) => {
    editor.chain().focus().unsetFontSize().run();
    
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value.substring(1));
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const handleTableSubmit = ({ rows, cols }: { rows: string; cols: string }) => {
    editor.chain().focus().insertTable({ 
      rows: parseInt(rows), 
      cols: parseInt(cols), 
      withHeaderRow: true 
    }).run();
  };

  const isTableSelected = editor.isActive('table');

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold"),
        canBold: ctx.editor.can().chain().focus().toggleBold().run(),
        isItalic: ctx.editor.isActive("italic"),
        canItalic: ctx.editor.can().chain().focus().toggleItalic().run(),
        isStrike: ctx.editor.isActive("strike"),
        canStrike: ctx.editor.can().chain().focus().toggleStrike().run(),
        canCode: ctx.editor.can().chain().focus().toggleCode().run(),
        canClearMarks: ctx.editor.can().chain().focus().unsetAllMarks().run(),
        isParagraph: ctx.editor.isActive("paragraph"),
        isHeading1: ctx.editor.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor.isActive("heading", { level: 2 }),
        isHeading3: ctx.editor.isActive("heading", { level: 3 }),
        isHeading4: ctx.editor.isActive("heading", { level: 4 }),
        isHeading5: ctx.editor.isActive("heading", { level: 5 }),
        isHeading6: ctx.editor.isActive("heading", { level: 6 }),
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
        isCodeBlock: ctx.editor.isActive("codeBlock"),
        isBlockquote: ctx.editor.isActive("blockquote"),
        canUndo: ctx.editor.can().chain().focus().undo().run(),
        canRedo: ctx.editor.can().chain().focus().redo().run(),
        canClearFormatting: ctx.editor
          .can()
          .chain()
          .focus()
          .unsetAllMarks()
          .run(),
        isAlignLeft: ctx.editor.isActive("textAlign", { align: "left" }),
        isAlignCenter: ctx.editor.isActive("textAlign", { align: "center" }),
        isAlignRight: ctx.editor.isActive("textAlign", { align: "right" }),
        isUnderline: ctx.editor.isActive("underline"),
        isTable: ctx.editor.isActive("table"),
        isLink: ctx.editor.isActive("link"),
        isYoutube: ctx.editor.isActive('youtube'),
        currentFontSize: ctx.editor.getAttributes('textStyle')?.fontSize || '16px',
        isHeading: ctx.editor.isActive('heading'),
        isImage: ctx.editor.isActive('image'),
        isSubscript: ctx.editor.isActive('subscript'),
        isSuperscript: ctx.editor.isActive('superscript'),
        isHighlight: ctx.editor.isActive('highlight'),
        youtubeAlignment: ctx.editor.getAttributes('youtube').align || 'left',
        imageAlignment: ctx.editor.getAttributes('image').align || 'left',
      };
    },
  });

  return (
    <div className="border-b border-gray-200 bg-white z-[9999] rounded-lg">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2.5 px-2 sm:px-4 py-2 overflow-x-auto overflow-y-visible">
        <div className="flex items-center gap-1 border-r pr-1 sm:pr-2">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            disabled={!editor.can().chain().focus().undo().run()}
            title="Undo"
          >
            <Undo2Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            disabled={!editor.can().chain().focus().redo().run()}
            title="Redo"
          >
           <Redo2Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-1 sm:pr-2">
          <select
            value={editor.isActive('paragraph') ? 'paragraph' : editor.isActive('heading') ? `h${editor.getAttributes('heading').level}` : 'paragraph'}
            onChange={(e) => handleHeadingChange(e.target.value)}
            className="px-2 py-1.5 border border-gray-200 rounded-md text-xs sm:text-sm min-w-[90px] sm:min-w-[130px] bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="paragraph">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>

          <select
            value={getCurrentFontSize()}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="px-2 py-1.5 border border-gray-200 rounded-md text-xs sm:text-sm min-w-[60px] sm:min-w-[80px] bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={editor.isActive('heading')}
          >
            {FONT_SIZES.map(size => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 border-r pr-1 sm:pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('bold') ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
            title="Bold"
          >
            <BoldIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('italic') ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
            title="Italic"
          >
            <ItalicIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('underline') ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('strike') ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
            title="Strikethrough"
          >
            <StrikeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-1 sm:pr-2">
          <button
            onClick={() => {
              if (editor.isActive('youtube')) {
                editor.chain().focus().updateAttributes('youtube', { align: 'left' }).run();
              } else if (editor.isActive('image')) {
                editor.chain().focus().updateAttributes('image', { align: 'left' }).run();
              } else {
                editor.chain().focus().setTextAlign('left').run();
              }
            }}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              (editor.isActive('youtube') && editorState.youtubeAlignment === 'left') ||
              (editor.isActive('image') && editorState.imageAlignment === 'left') ||
              editor.isActive({ textAlign: 'left' })
                ? 'bg-gray-100 ring-1 ring-gray-300'
                : ''
            }`}
            title="Align left"
          >
            <AlignLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          <button
            onClick={() => {
              if (editor.isActive('youtube')) {
                editor.chain().focus().updateAttributes('youtube', { align: 'center' }).run();
              } else if (editor.isActive('image')) {
                editor.chain().focus().updateAttributes('image', { align: 'center' }).run();
              } else {
                editor.chain().focus().setTextAlign('center').run();
              }
            }}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              (editor.isActive('youtube') && editorState.youtubeAlignment === 'center') ||
              (editor.isActive('image') && editorState.imageAlignment === 'center') ||
              editor.isActive({ textAlign: 'center' })
                ? 'bg-gray-100 ring-1 ring-gray-300'
                : ''
            }`}
            title="Align center"
          >
            <AlignCenterIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          <button
            onClick={() => {
              if (editor.isActive('youtube')) {
                editor.chain().focus().updateAttributes('youtube', { align: 'right' }).run();
              } else if (editor.isActive('image')) {
                editor.chain().focus().updateAttributes('image', { align: 'right' }).run();
              } else {
                editor.chain().focus().setTextAlign('right').run();
              }
            }}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              (editor.isActive('youtube') && editorState.youtubeAlignment === 'right') ||
              (editor.isActive('image') && editorState.imageAlignment === 'right') ||
              editor.isActive({ textAlign: 'right' })
                ? 'bg-gray-100 ring-1 ring-gray-300'
                : ''
            }`}
            title="Align right"
          >
            <AlignRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('justify').run();
            }}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              editor.isActive({ textAlign: 'justify' })
                ? 'bg-gray-100 ring-1 ring-gray-300'
                : ''
            }`}
            title="Justify"
          >
            <AlignJustifyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>
        </div>

        <div className="flex items-center gap-1 border-r pr-1 sm:pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('bulletList') ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
            title="Bullet List"
          >
            <ListIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('orderedList') ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
            title="Numbered List"
          >
            <ListOrderedIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
              onClick={() => {
                if (editor.isActive('link')) {
                  unsetLink();
                } else {
                  setIsLinkModalOpen(true);
                }
              }}
              className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('link') ? 'bg-red-50 ring-1 ring-red-300' : ''}`}
              title={editor.isActive('link') ? 'Remove link' : 'Insert link'}
            >
              <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
            </button>

          <button
            onClick={() => setIsTableModalOpen(true)}
            className="p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            title="Insert Table"
          >
            <TableIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          {/* Table Controls - Individual buttons visible when table is active */}
          {isTableSelected && (
            <>
              <div className="h-6 w-px bg-gray-300 mx-1"></div>
              
              <button
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="mt-2 rounded-md transition-colors hover:bg-green-50 bg-green-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                title="Add Row Below"
              >
                <AddRowIcon className="w-8 h-8 text-gray-800" />
              </button>

              <button
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="mt-2 rounded-md transition-colors hover:bg-green-50 bg-green-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                title="Add Column Right"
              >
                <AddColumnIcon className="w-8 h-8 text-gray-800" />
              </button>

              <button
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="mt-2 rounded-md transition-colors hover:bg-red-50 bg-red-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                title="Delete Row"
              >
                <DeleteRowIcon className="w-8 h-8 text-gray-800" />
              </button>

              <button
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="mt-2 rounded-md transition-colors hover:bg-red-50 bg-red-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                title="Delete Column"
              >
                <DeleteColumnIcon className="w-8 h-8 text-gray-800" />
              </button>

              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="p-1.5 rounded-md transition-colors hover:bg-red-100 bg-red-100/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                title="Delete Table"
              >
                <TrashIcon className="w-4 h-4 text-red-700" />
              </button>
            </>
          )}

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('blockquote') ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
            title="Blockquote"
          >
            <BlockquoteIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          {/* <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('codeBlock') ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
            title="Code block"
          >
              <CodeBlockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('code') ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
            title="Inline code"
          >
            <Code2Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button> */}
        </div>

        <div className="flex items-center gap-1 border-l pr-1 sm:pr-2">
          <button
            onClick={() => setIsImageModalOpen(true)}
            className="p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            title="Upload Image"
          >
            <ImagePlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
          </button>

          <button
            onClick={() => setIsYoutubeModalOpen(true)}
            className={`mt-2 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${editor.isActive('youtube') ? 'bg-gray-100 ring-1 ring-gray-300' : ''}`}
            title="Insert YouTube video"
          >
            <YoutubeIcon className="w-8 h-8 text-gray-800" />
          </button>
        </div>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        closeModal={() => setIsImageModalOpen(false)}
        editor={editor}
        token={token}
      />

      <YoutubeModal
        isOpen={isYoutubeModalOpen}
        closeModal={() => setIsYoutubeModalOpen(false)}
        onSubmit={handleYoutubeSubmit}
      />

      <TableModal
        isOpen={isTableModalOpen}
        closeModal={() => setIsTableModalOpen(false)}
        onSubmit={handleTableSubmit}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        closeModal={() => setIsLinkModalOpen(false)}
        selectedText={editor.state.selection.empty ? undefined : editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
        )}
        existingUrl={editor.isActive('link') ? editor.getAttributes('link').href : undefined}
        onSubmit={({ url, text }) => {
          if (editor.state.selection.empty) {
            editor.chain()
              .focus()
              .insertContent([
                {
                  type: 'text',
                  text: text || url,
                  marks: [
                    {
                      type: 'link',
                      attrs: { href: url }
                    }
                  ]
                }
              ])
              .run();
          } else {
            editor.chain()
              .focus()
              .setLink({ href: url })
              .run();
          }
        }}
        onUnset={() => {
          editor.chain().focus().unsetLink().run();
        }}
      />
    </div>
  );
};

export default MenuBar;
