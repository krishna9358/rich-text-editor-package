import React from "react";
interface LinkModalProps {
    isOpen: boolean;
    onOpenChange?: () => void;
    closeModal: () => void;
    selectedText?: string;
    existingUrl?: string;
    onSubmit: (data: {
        url: string;
        text?: string;
    }) => void;
    onUnset?: () => void;
}
export default function LinkModal({ isOpen, closeModal, selectedText, existingUrl, onSubmit, onUnset, }: LinkModalProps): React.JSX.Element | null;
export {};
