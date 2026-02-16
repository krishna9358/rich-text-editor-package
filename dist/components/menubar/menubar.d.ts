import React from "react";
import type { AIChangeEvent } from "../editor/AIBubbleMenu";
interface MenuBarProps {
    editor: any;
    setLink: () => void;
    unsetLink: () => void;
    token?: string;
    aiBaseUrl?: string;
    onAIChange?: (event: AIChangeEvent) => void;
}
declare const MenuBar: ({ editor, unsetLink, token, aiBaseUrl, onAIChange }: MenuBarProps) => React.JSX.Element;
export default MenuBar;
