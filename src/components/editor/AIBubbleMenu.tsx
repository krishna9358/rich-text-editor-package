
import { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import React, { useState, useRef, useEffect } from 'react'
import { processSelectedText, AIAction } from '../../services/aiService'
import { TranslateIcon } from '../tiptap-icons/translate-icon'
import MagicPencilIcon from '../tiptap-icons/magic-pencil-icon'

const LANGUAGES = [
    { code: 'as', label: 'Assamese' },
    { code: 'bn', label: 'Bengali' },
    { code: 'gu', label: 'Gujarati' },
    { code: 'hi', label: 'Hindi' },
    { code: 'kn', label: 'Kannada' },
    { code: 'ml', label: 'Malayalam' },
    { code: 'mr', label: 'Marathi' },
    { code: 'ne', label: 'Nepali' },
    { code: 'or', label: 'Odia' },
    { code: 'pa', label: 'Punjabi' },
    { code: 'sd', label: 'Sindhi' },
    { code: 'si', label: 'Sinhala' },
    { code: 'ta', label: 'Tamil' },
    { code: 'te', label: 'Telugu' },
]

export interface AIChangeEvent {
    originalText: string;
    newText: string;
}

interface AIBubbleMenuProps {
    editor: Editor
    aiBaseUrl?: string
    onAIChange?: (event: AIChangeEvent) => void
}

export const AIBubbleMenu = ({ editor, aiBaseUrl, onAIChange }: AIBubbleMenuProps) => {
    const [isLoading, setIsLoading] = useState<AIAction | null>(null);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const bubbleMenuRef = useRef<HTMLDivElement>(null);
    const langPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bubbleMenuRef.current) {
            bubbleMenuRef.current.style.zIndex = '99999';
        }
    }, []);

    // Close language picker on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                langPickerRef.current &&
                !langPickerRef.current.contains(e.target as Node)
            ) {
                setShowLangPicker(false);
            }
        };
        if (showLangPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showLangPicker]);

    const handleAction = async (action: AIAction, targetLanguage?: string) => {
        const { from, to, empty } = editor.state.selection
        if (empty) return

        setIsLoading(action)
        setShowLangPicker(false)
        try {
            const originalText = editor.state.doc.textBetween(from, to)
            console.log(`[AI BubbleMenu] Action: ${action}, Selection: "${originalText}" (from: ${from}, to: ${to})`)

            const newText = await processSelectedText(
                originalText,
                action,
                { targetLanguage },
                aiBaseUrl,
            )

            console.log(`[AI BubbleMenu] API returned newText:`, newText)
            console.log(`[AI BubbleMenu] newText type: ${typeof newText}, truthy: ${!!newText}`)

            if (newText) {
                console.log(`[AI BubbleMenu] Replacing text at (${from}, ${to}) with new text`)
                editor.chain().focus().insertContentAt({ from, to }, newText).run()
                onAIChange?.({ originalText, newText })
                console.log(`[AI BubbleMenu] Replacement done`)
            } else {
                console.warn(`[AI BubbleMenu] newText is falsy, skipping replacement`)
            }
        } catch (error) {
            console.error('[AI BubbleMenu] Error:', error)
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
            ref={bubbleMenuRef}
            editor={editor}
            options={{
                placement: 'top',
                strategy: 'fixed',
                offset: 10,
                flip: {
                    fallbackPlacements: ['bottom', 'bottom-start', 'bottom-end', 'top-start', 'top-end'],
                    padding: { top: 130, left: 16, right: 16, bottom: 16 },
                },
                shift: {
                    padding: { top: 130, left: 16, right: 16, bottom: 16 },
                    crossAxis: true,
                },
            }}
            shouldShow={shouldShow}
            className="flex overflow-visible rounded-lg border border-gray-200 bg-white shadow-xl ring-1 ring-black ring-opacity-5"
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

                {/* Translate with language picker */}
                <div className="relative" ref={langPickerRef}>
                    <MenuButton
                        onClick={() => setShowLangPicker((v) => !v)}
                        isActive={isLoading === 'translate'}
                        label="Translate"
                        icon={<TranslateIcon className="w-3.5 h-3.5" />}
                    />

                    {showLangPicker && (
                        <div className="absolute top-full left-0 mt-1 w-40 max-h-52 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg z-[100000]">
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleAction('translate', lang.code)}
                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
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
