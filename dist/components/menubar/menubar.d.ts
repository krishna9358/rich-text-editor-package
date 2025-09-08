import React from "react";
interface MenuBarProps {
    editor: any;
    setLink: () => void;
    unsetLink: () => void;
}
declare const MenuBar: ({ editor, unsetLink }: MenuBarProps) => React.JSX.Element;
export default MenuBar;
