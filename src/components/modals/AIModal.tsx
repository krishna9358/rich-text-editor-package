
import React, { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { CloseIcon } from "../tiptap-icons/close-icon";
import { generateContent } from "../../services/aiService";
import MagicPencilIcon from "../tiptap-icons/magic-pencil-icon";
import type { AIChangeEvent } from "../editor/AIBubbleMenu";

interface AIModalProps {
    isOpen: boolean;
    closeModal: () => void;
    editor: Editor;
    aiBaseUrl?: string;
    token?: string;
    onAIChange?: (event: AIChangeEvent) => void;
}

const AIModal = ({ isOpen, closeModal, editor, aiBaseUrl, token, onAIChange }: AIModalProps) => {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
    const [style, setStyle] = useState('professional');

    useEffect(() => {
        if (isOpen) {
            setPrompt("");
            setLength('medium');
            setStyle('professional');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const content = await generateContent(prompt, length, style, aiBaseUrl, token);
            if (content) {
                // For generate, there's no original text being replaced — it's a fresh insertion
                const { from, to, empty } = editor.state.selection;
                const originalText = empty ? '' : editor.state.doc.textBetween(from, to);
                editor.chain().focus().insertContent(content).run();
                onAIChange?.({ originalText, newText: content });
                closeModal();
            }
        } catch (error) {
            console.error(error);
            alert("Failed to generate content. Please ensure backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    // Inline styles for reliable rendering in any consuming project
    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0,0,0,0.4)',
    };

    const modalStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '512px',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        padding: '24px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        position: 'relative',
    };

    const closeBtnStyle: React.CSSProperties = {
        position: 'absolute',
        right: '16px',
        top: '16px',
        color: '#6b7280',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: 500,
        color: '#374151',
    };

    const textareaStyle: React.CSSProperties = {
        width: '100%',
        minHeight: '100px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        padding: '8px 12px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    };

    const selectStyle: React.CSSProperties = {
        width: '100%',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        padding: '8px 12px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#ffffff',
    };

    const cancelBtnStyle: React.CSSProperties = {
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 500,
        color: '#374151',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
    };

    const submitBtnStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '6px',
        border: 'none',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#ffffff',
        backgroundColor: '#6d28d9',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.6 : 1,
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button
                    onClick={closeModal}
                    style={closeBtnStyle}
                >
                    <CloseIcon className="w-5 h-5" />
                </button>

                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '8px', backgroundColor: '#f3e8ff', borderRadius: '50%' }}>
                        <MagicPencilIcon className="w-6 h-6" />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937', margin: 0 }}>Generate Content with AI</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>
                            Prompt
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe what you want to write about..."
                            style={textareaStyle}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div>
                            <label style={labelStyle}>Length</label>
                            <select
                                value={length}
                                onChange={(e) => setLength(e.target.value as any)}
                                style={selectStyle}
                            >
                                <option value="short">Short</option>
                                <option value="medium">Medium</option>
                                <option value="long">Long</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Style</label>
                            <select
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                style={selectStyle}
                            >
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="enthusiastic">Enthusiastic</option>
                                <option value="informative">Informative</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={closeModal}
                            style={cancelBtnStyle}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={submitBtnStyle}
                        >
                            {isLoading ? (
                                <>
                                    <svg style={{ height: '16px', width: '16px', animation: 'spin 1s linear infinite', color: '#ffffff' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <MagicPencilIcon className="w-4 h-4" />
                                    Generate
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AIModal;
