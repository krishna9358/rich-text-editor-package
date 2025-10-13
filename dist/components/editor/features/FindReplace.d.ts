import React from 'react';
import { Editor } from '@tiptap/react';
interface FindReplaceProps {
    editor: Editor | null;
    isOpen: boolean;
    onClose: () => void;
}
export declare function FindReplace({ editor, isOpen, onClose }: FindReplaceProps): React.JSX.Element | null;
export {};
