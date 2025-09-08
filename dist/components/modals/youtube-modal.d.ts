import React from "react";
interface YouTubeModalProps {
    isOpen: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    closeModal: () => void;
    onSubmit: (data: {
        url: string;
        width: string;
        height: string;
    }) => void;
}
export default function YoutubeModal({ isOpen, closeModal, onSubmit, }: YouTubeModalProps): React.JSX.Element | null;
export {};
