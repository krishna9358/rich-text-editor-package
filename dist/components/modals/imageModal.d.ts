import React from "react";
import { Editor } from '@tiptap/react';
interface ImageModalProps {
    isOpen: boolean;
    onOpenChange?: () => void;
    closeModal: () => void;
    editor: Editor;
}
export default function ImageModal({ isOpen, closeModal, editor, }: ImageModalProps): React.JSX.Element | null;
export {};
