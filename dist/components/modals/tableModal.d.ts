import React from "react";
interface TableModalProps {
    isOpen: boolean;
    onOpenChange?: () => void;
    closeModal: () => void;
    onSubmit: (data: {
        rows: string;
        cols: string;
    }) => void;
}
export default function TableModal({ isOpen, closeModal, onSubmit, }: TableModalProps): React.JSX.Element | null;
export {};
