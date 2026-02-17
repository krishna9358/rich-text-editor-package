
import { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { processSelectedText, AIAction, fetchLanguages, LanguageOption } from '../../services/aiService'
import { TranslateIcon } from '../tiptap-icons/translate-icon'
import MagicPencilIcon from '../tiptap-icons/magic-pencil-icon'

export interface AIChangeEvent {
    originalText: string;
    newText: string;
}

interface AIBubbleMenuProps {
    editor: Editor
    aiBaseUrl?: string
    adminUserApiUrl?: string
    token?: string
    onAIChange?: (event: AIChangeEvent) => void
}

export const AIBubbleMenu = ({ editor, aiBaseUrl, adminUserApiUrl, token, onAIChange }: AIBubbleMenuProps) => {
    const [isLoading, setIsLoading] = useState<AIAction | null>(null);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [languages, setLanguages] = useState<LanguageOption[]>([]);
    const [langLoading, setLangLoading] = useState(false);
    const bubbleMenuRef = useRef<HTMLDivElement>(null);
    const langPickerRef = useRef<HTMLDivElement>(null);
    const translateBtnRef = useRef<HTMLDivElement>(null);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    useEffect(() => {
        if (bubbleMenuRef.current) {
            bubbleMenuRef.current.style.zIndex = '99999';
        }
    }, []);

    // Fetch languages from API when adminUserApiUrl is available
    useEffect(() => {
        if (!adminUserApiUrl) return;
        let cancelled = false;
        setLangLoading(true);
        fetchLanguages(adminUserApiUrl, token).then((langs) => {
            if (!cancelled) {
                setLanguages(langs);
                setLangLoading(false);
            }
        });
        return () => { cancelled = true; };
    }, [adminUserApiUrl, token]);

    // Position the dropdown relative to the translate button, flipping above if needed
    const updateDropdownPosition = useCallback(() => {
        if (translateBtnRef.current) {
            const rect = translateBtnRef.current.getBoundingClientRect();
            const dropdownHeight = 280;
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            // If not enough space below, position above the button
            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropdownPos({
                    top: rect.top - Math.min(dropdownHeight, spaceAbove - 8),
                    left: Math.max(8, Math.min(rect.left, window.innerWidth - 188)),
                });
            } else {
                setDropdownPos({
                    top: rect.bottom + 4,
                    left: Math.max(8, Math.min(rect.left, window.innerWidth - 188)),
                });
            }
        }
    }, []);

    useEffect(() => {
        if (showLangPicker) {
            updateDropdownPosition();
        }
    }, [showLangPicker, updateDropdownPosition]);

    // Close language picker on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                langPickerRef.current &&
                !langPickerRef.current.contains(e.target as Node) &&
                translateBtnRef.current &&
                !translateBtnRef.current.contains(e.target as Node)
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
                token,
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

    // Styles
    const bubbleMenuStyle: React.CSSProperties = {
        zIndex: 99999,
        display: 'flex',
        overflow: 'visible',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    };

    const menuContainerStyle: React.CSSProperties = {
        display: 'flex',
        padding: '4px',
        gap: '4px',
        alignItems: 'center',
    };

    const dividerStyle: React.CSSProperties = {
        width: '1px',
        backgroundColor: '#e5e7eb',
        margin: '4px 0',
        alignSelf: 'stretch',
    };

    const dropdownStyle: React.CSSProperties = {
        position: 'fixed',
        top: `${dropdownPos.top}px`,
        left: `${dropdownPos.left}px`,
        width: '200px',
        maxHeight: '300px',
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 25px -3px rgba(0,0,0,0.15), 0 4px 6px -2px rgba(0,0,0,0.08)',
        zIndex: 100001,
        padding: '4px 0',
        WebkitOverflowScrolling: 'touch',
    };

    const langBtnStyle: React.CSSProperties = {
        width: '100%',
        textAlign: 'left' as const,
        padding: '8px 12px',
        fontSize: '13px',
        color: '#374151',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.15s, color 0.15s',
        borderRadius: '0',
    };

    return (
        <>
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
                className=""
                style={bubbleMenuStyle}
            >
                <div style={menuContainerStyle}>
                    <MenuButton
                        onClick={() => handleAction('rephrase')}
                        isActive={isLoading === 'rephrase'}
                        label="Rephrase"
                        icon={<MagicPencilIcon className="w-3.5 h-3.5" />}
                    />

                    <div style={dividerStyle}></div>

                    <MenuButton
                        onClick={() => handleAction('summarize')}
                        isActive={isLoading === 'summarize'}
                        label="Summarize"
                    />

                    <div style={dividerStyle}></div>

                    <MenuButton
                        onClick={() => handleAction('expand')}
                        isActive={isLoading === 'expand'}
                        label="Expand"
                    />

                    <div style={dividerStyle}></div>

                    {/* Translate with language picker */}
                    <div style={{ position: 'relative' }} ref={translateBtnRef}>
                        <MenuButton
                            onClick={() => setShowLangPicker((v) => !v)}
                            isActive={isLoading === 'translate'}
                            label="Translate"
                            icon={<TranslateIcon className="w-3.5 h-3.5" />}
                        />
                    </div>
                </div>
            </BubbleMenu>

            {/* Language picker rendered via portal to avoid clipping */}
            {showLangPicker && createPortal(
                <div ref={langPickerRef} style={dropdownStyle}>
                    {langLoading ? (
                        <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
                            Loading languages...
                        </div>
                    ) : languages.length === 0 ? (
                        <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
                            {adminUserApiUrl ? 'No languages available' : 'Set adminUserApiUrl prop to load languages'}
                        </div>
                    ) : (
                        languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleAction('translate', lang.code)}
                                style={langBtnStyle}
                                onMouseEnter={(e) => {
                                    (e.target as HTMLButtonElement).style.backgroundColor = '#f3e8ff';
                                    (e.target as HTMLButtonElement).style.color = '#7c3aed';
                                }}
                                onMouseLeave={(e) => {
                                    (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                                    (e.target as HTMLButtonElement).style.color = '#374151';
                                }}
                            >
                                {lang.label}
                            </button>
                        ))
                    )}
                </div>,
                document.body
            )}
        </>
    )
}

interface MenuButtonProps {
    onClick: () => void;
    isActive: boolean;
    label: string;
    icon?: React.ReactNode;
}

const MenuButton = ({ onClick, isActive, label, icon }: MenuButtonProps) => {
    const [hovered, setHovered] = useState(false);

    const baseStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 8px',
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: '4px',
        transition: 'background-color 0.15s, color 0.15s',
        border: 'none',
        cursor: isActive ? 'wait' : 'pointer',
        backgroundColor: isActive ? '#f3e8ff' : hovered ? '#f3f4f6' : 'transparent',
        color: isActive ? '#7c3aed' : hovered ? '#111827' : '#374151',
    };

    return (
        <button
            onClick={onClick}
            style={baseStyle}
            disabled={isActive}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {icon}
            {label}
            {isActive && (
                <svg style={{ animation: 'spin 1s linear infinite', height: '12px', width: '12px', color: '#7c3aed', marginLeft: '4px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
        </button>
    );
};
