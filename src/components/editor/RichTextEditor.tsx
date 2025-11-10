
import React from 'react';
import { EditorContent, useEditor } from "@tiptap/react";
import FileMenuBar from "../menubar/submenus/FileMenuBar";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'

import Underline from "@tiptap/extension-underline"
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { YoutubeAlign } from './features/youtubeAlign'
import { useCallback, useState, useEffect } from "react";
import { TextStyleKit } from '@tiptap/extension-text-style'
import { FontSize } from '@tiptap/extension-font-size'
import { EditorContainer } from './EditorStyles';
import { CharacterCount } from '@tiptap/extension-character-count'
import ImageResize from 'tiptap-extension-resize-image'
import Image from '@tiptap/extension-image'
import { FindReplace } from './features/FindReplace';
// import TableControls from './features/TableControls'; // Moved to MenuBar toolbar
import { MenuBar } from "../menubar/index";

// Link configuration
const linkConfig = {
  openOnClick: true,
  enableClickSelection: true,
  linkOnPaste: true,
  autolink: true,
  defaultProtocol: 'https',
  protocols: [
    'http',
    'https',
    {
      scheme: 'tel',
      optionalSlashes: true,
    },
    {
      scheme: 'mailto',
      optionalSlashes: true,
    }
  ],
  HTMLAttributes: {
    target: '_blank',
    rel: 'noopener noreferrer',
    class: 'cursor-pointer text-blue-600 hover:text-blue-800 hover:underline'
  },
  validate: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onHTMLChange?: (html: string) => void;
  onJSONChange?: (json: any) => void;
  token?: string;
}

const RichTextEditor = ({ 
  initialContent = "", 
  onContentChange, 
  onHTMLChange, 
  onJSONChange,
  token,
}: RichTextEditorProps) => {
  const [wordCount, setWordCount] = useState(0);  
  const [characterCount, setCharacterCount] = useState(0);
  const [showFindReplace, setShowFindReplace] = useState(false);

  const editor = useEditor({
    autofocus: true,
    extensions: [
      CharacterCount.configure({
        limit: Infinity,
      }),
      Image.configure({
        allowBase64: true,
      }),
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {},
        },
        orderedList: {
          HTMLAttributes: {},
        },
      }),
      ImageResize.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            style: {
              default: null,
              parseHTML: element => element.getAttribute('style'),
              renderHTML: attributes => ({
                style: attributes.style,
              }),
            },
            align: {
              default: 'left',
              parseHTML: element => (element as HTMLElement).getAttribute('data-align'),
              renderHTML: attributes => {
                if (!attributes.align) return {}
                return { 'data-align': attributes.align }
              },
            },
          }
        }
      }).configure({
        HTMLAttributes: {
          class: 'resizable-image',
        },
      }),
      TextStyleKit,
      FontSize.configure({
        types: ['textStyle'],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "table", "image", "youtube"],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TaskList.configure({
        HTMLAttributes: {},
      }),
      Underline,
      TaskItem.configure({ 
        nested: true,
        HTMLAttributes: {},
      }),
      Link.configure({
        ...linkConfig,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {},
      }),
      TableRow.configure({
        HTMLAttributes: {},
      }),
      TableHeader.configure({
        HTMLAttributes: {},
      }),
      TableCell.configure({
        HTMLAttributes: {},
      }),
      YoutubeAlign.configure({
        controls: true,
        nocookie: true,
        progressBarColor: 'white',
        modestBranding: true,
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      HorizontalRule.configure({}),
      Subscript,
      Superscript,
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none p-4 min-h-[500px] max-h-[500px] overflow-y-auto prose max-w-none bg-white",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files.length) {
          const files = Array.from(event.dataTransfer.files);
          const images = files.filter(file => file.type.startsWith('image'));
          
          if (images.length === 0) return false;
          
          event.preventDefault();
          
          const { tr, schema } = view.state;
          const imageType = schema.nodes?.image;
          if (!imageType) return false;
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          
          if (!coordinates) return false;
          
          images.forEach(image => {
            const reader = new FileReader();
            reader.onload = readerEvent => {
              const node = imageType.create({
                src: readerEvent.target?.result,
              });
              const transaction = tr.insert(coordinates.pos, node);
              view.dispatch(transaction);
            };
            reader.readAsDataURL(image);
          });
          
          return true;
        }
        return false;
      },
      handlePaste: (view: any, event: ClipboardEvent) => {
        const files = Array.from(event.clipboardData?.files || []);
        const images = files.filter((file) => file.type.startsWith('image'));
        if (images.length === 0) return false;

        event.preventDefault();

        const maybeUploadAndReplace = async (file: File, tempSrc: string) => {
          if (!token) return;
          try {
            const formData = new FormData();
            formData.append('files', file);
            const res = await fetch('https://api.mrmeds.in/admin/file/media', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            });
            if (!res.ok) return;
            const json = await res.json();
            const uploaded = json?.data?.[0];
            const link: string | undefined = uploaded?.link;
            if (!link) return;

            const { state } = view;
            const tr = state.tr;
            state.doc.descendants((node: any, pos: number) => {
              if (node.type.name === 'image' && node.attrs?.src === tempSrc) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: link });
              }
            });
            if (tr.steps.length) {
              view.dispatch(tr);
            }
          } catch (e) {
            // noop
          }
        };

        images.forEach((image) => {
          const tempSrc = URL.createObjectURL(image);
          const imageType = view.state.schema.nodes?.image;
          if (!imageType) return;
          // Insert at current selection
          const node = imageType.create({ src: tempSrc });
          const { tr } = view.state;
          const transaction = tr.replaceSelectionWith(node).scrollIntoView();
          view.dispatch(transaction);
          // Attempt upload and replace
          maybeUploadAndReplace(image, tempSrc);
        });

        return true;
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      setCharacterCount(text.length);

      if (onContentChange) {
        onContentChange(editor.getText());
      }
      
      if (onHTMLChange) {
        const rawHtml = editor.getHTML();
        onHTMLChange(rawHtml);
      }
      
      if (onJSONChange) {
        onJSONChange(editor.getJSON());
      }
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const selection = editor.state.selection;
    const selectedText = selection.empty
      ? ''
      : editor.state.doc.textBetween(selection.from, selection.to);

    const previousUrl = editor.getAttributes('link').href;

    const url = window.prompt('URL', previousUrl || selectedText);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    try {
      let formattedUrl = url.startsWith('http://') || url.startsWith('https://')
        ? url
        : `https://${url}`;

      editor.chain().focus().setLink({ href: formattedUrl }).run();
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An error occurred while setting the link');
      }
    }
  }, [editor]);

  const unsetLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  useEffect(() => {
    return () => {
      editor?.commands.unsetHighlight();
    };
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setShowFindReplace(true);
      } else if (e.key === 'Escape' && showFindReplace) {
        setShowFindReplace(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFindReplace]);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm rounded-t-lg">

      <div className="flex items-center justify-start">
            <img
              src="/rte-editor/logo.svg"
              alt="logo"
              width={30}
              height={30}
              className="ml-2"
            />
            <div className="text-sm font-semibold text-gray-700 sm:px-4 py-2">ProtiumPad</div>
          </div>
        {editor && (
          <FileMenuBar
            editor={editor}
            onOpenFindReplace={() => setShowFindReplace(true)}
          />
        )}

        {editor && (
          <MenuBar
            editor={editor}
            setLink={setLink}
            unsetLink={unsetLink}
            token={token}
          />
        )}
      </div>

      {editor && (
        <EditorContainer>
          <div className="min-h-[300px] border-t border-gray-200">
            <EditorContent editor={editor} className="prose max-w-none -z-500" />
          </div>
          {/* TableControls moved to toolbar - see MenuBar component */}
          {/* <TableControls editor={editor} /> */}
        </EditorContainer>
      )}

      <div className="flex justify-end py-2 px-2 sm:px-4 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <span>{wordCount} words • {characterCount} characters</span>
        </div>
      </div>

      <FindReplace 
        editor={editor!}
        isOpen={showFindReplace}
        onClose={() => setShowFindReplace(false)}
      />
    </div>
  );
}

export default RichTextEditor;
