
import { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import React, { useState } from 'react'
import { processSelectedText, AIAction } from '../../services/aiService'
import { TranslateIcon } from '../tiptap-icons/translate-icon'
import MagicPencilIcon from '../tiptap-icons/magic-pencil-icon'

interface AIBubbleMenuProps {
    editor: Editor
}

export const AIBubbleMenu = ({ editor }: AIBubbleMenuProps) => {
    const [isLoading, setIsLoading] = useState<AIAction | null>(null);

    const handleAction = async (action: AIAction) => {
        const { from, to, empty } = editor.state.selection
        if (empty) return

        setIsLoading(action)
        try {
            const text = editor.state.doc.textBetween(from, to)
            const result = await processSelectedText(text, action)

            if (result) {
                editor.chain().focus().insertContentAt({ from, to }, result).run()
            }
        } catch (error) {
            console.error(error)
            alert("Failed to process text. Ensure backend is available.")
        } finally {
            setIsLoading(null)
        }
    }

    const shouldShow = ({ editor }: { editor: Editor }) => {
        return !editor.state.selection.empty
    }

    return (
        <BubbleMenu
            editor={editor}
            options={{
                placement: 'top',
                strategy: 'fixed', // Fixed positioning to escape parent overflow
                offset: 8, // Add spacing between selection and menu
                flip: {
                    fallbackPlacements: ['bottom', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
                    padding: 8
                }, // Auto-flip when near edges
                shift: { padding: 8 }, // Shift along axis to stay in viewport
            }}
            shouldShow={shouldShow}
            className="flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl ring-1 ring-black ring-opacity-5"
            style={{ zIndex: 99999 }}
        >
            <div className="flex p-1 gap-1">
                <MenuButton
                    onClick={() => handleAction('rephrase')}
                    isActive={isLoading === 'rephrase'}
                    label="Rephrase"
                    icon={<MagicPencilIcon className="w-3.5 h-3.5" />}
                />

                <div className="w-px bg-gray-200 my-1"></div>

                <MenuButton
                    onClick={() => handleAction('summarize')}
                    isActive={isLoading === 'summarize'}
                    label="Summarize"
                />

                <div className="w-px bg-gray-200 my-1"></div>

                <MenuButton
                    onClick={() => handleAction('expand')}
                    isActive={isLoading === 'expand'}
                    label="Expand"
                />

                <div className="w-px bg-gray-200 my-1"></div>

                <MenuButton
                    onClick={() => handleAction('translate')}
                    isActive={isLoading === 'translate'}
                    label="Translate"
                    icon={<TranslateIcon className="w-3.5 h-3.5" />}
                />
            </div>
        </BubbleMenu>
    )
}

interface MenuButtonProps {
    onClick: () => void;
    isActive: boolean;
    label: string;
    icon?: React.ReactNode;
}

const MenuButton = ({ onClick, isActive, label, icon }: MenuButtonProps) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded transition-colors
        ${isActive ? 'bg-purple-50 text-purple-700 cursor-wait' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
        `}
        disabled={isActive}
    >
        {icon}
        {label}
        {isActive && (
            <svg className="animate-spin h-3 w-3 text-purple-700 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        )}
    </button>
)
