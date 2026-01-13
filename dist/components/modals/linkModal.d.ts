import React from "react";
interface LinkModalProps {
    isOpen: boolean;
    onOpenChange?: () => void;
    closeModal: () => void;
    selectedText?: string;
    existingUrl?: string;
    existingNofollow?: boolean;
    onSubmit: (data: {
        url: string;
        text?: string;
        nofollow: boolean;
    }) => void;
    onUnset?: () => void;
}
export default function LinkModal({ isOpen, closeModal, selectedText, existingUrl, existingNofollow, onSubmit, onUnset, }: LinkModalProps): React.JSX.Element | null;
export {};
