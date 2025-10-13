import React from "react";
interface MenuBarProps {
    editor: any;
    setLink: () => void;
    unsetLink: () => void;
    token?: string;
}
declare const MenuBar: ({ editor, unsetLink, token }: MenuBarProps) => React.JSX.Element;
export default MenuBar;
