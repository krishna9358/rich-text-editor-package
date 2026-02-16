import React from 'react';
import type { AIChangeEvent } from './AIBubbleMenu';
interface RichTextEditorProps {
    initialContent?: string;
    onContentChange?: (content: string) => void;
    onHTMLChange?: (html: string) => void;
    onJSONChange?: (json: any) => void;
    token?: string;
    aiBaseUrl?: string;
    onAIChange?: (event: AIChangeEvent) => void;
}
declare const RichTextEditor: ({ initialContent, onContentChange, onHTMLChange, onJSONChange, token, aiBaseUrl, onAIChange, }: RichTextEditorProps) => React.JSX.Element;
export default RichTextEditor;
