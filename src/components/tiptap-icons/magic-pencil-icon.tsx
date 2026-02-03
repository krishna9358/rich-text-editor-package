
import React from "react";

const MagicPencilIcon = ({
    className,
}: {
    className?: string;
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 17v4" />
            <path d="M3 5h4" />
            <path d="M17 9h4" />
        </svg>
    );
};
// I'm using a "sparkle" like star shape. Let's actually make it look like a pencil with stars.
// Changing the path to be a pencil + sparkles.
export const MagicPencilIcon2 = ({
    className,
}: {
    className?: string;
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            <path d="m15 7 3 3" />
            <path d="M2 2l3 3" strokeOpacity="0.5" />
            <path d="m2 2 3 3" />
            <path d="M4 4l-1 1" />
            <path d="M5 2L2 5" />
            {/* Stars around */}
            <path d="M19 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" fill="currentColor" opacity="0.2" stroke="none" />
            <path d="M9 19l-1.5 1.5" />
            <path d="M7 21l3-3" />
            {/* Better simpler sparkle pencil */}
        </svg>
    );
};

// Going for a cleaner standard icon: Pencil with sparkles
export default function ({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
            <path d="M4 20h1" />
            <path d="m2 22 1-1" />
            {/* Sparkles */}
            <path d="M20 14h2" />
            <path d="M21 13v2" />
            <path d="M17 17l2 2" />
        </svg>
    )
}
