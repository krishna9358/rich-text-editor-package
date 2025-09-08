import React from 'react';
interface RichTextEditorProps {
    initialContent?: string;
    onContentChange?: (content: string) => void;
    onHTMLChange?: (html: string) => void;
    onJSONChange?: (json: any) => void;
}
declare const RichTextEditor: ({ initialContent, onContentChange, onHTMLChange, onJSONChange }: RichTextEditorProps) => React.JSX.Element;
export default RichTextEditor;
