import React from 'react';
interface RichTextEditorProps {
    initialContent?: string;
    onContentChange?: (content: string) => void;
    onHTMLChange?: (html: string) => void;
    onJSONChange?: (json: any) => void;
    token?: string;
}
declare const RichTextEditor: ({ initialContent, onContentChange, onHTMLChange, onJSONChange, token, }: RichTextEditorProps) => React.JSX.Element;
export default RichTextEditor;
