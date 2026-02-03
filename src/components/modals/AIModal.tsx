
import React, { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { CloseIcon } from "../tiptap-icons/close-icon";
import { generateContent } from "../../services/aiService";
import MagicPencilIcon from "../tiptap-icons/magic-pencil-icon";

interface AIModalProps {
    isOpen: boolean;
    closeModal: () => void;
    editor: Editor;
}

const AIModal = ({ isOpen, closeModal, editor }: AIModalProps) => {
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
            const content = await generateContent(prompt, length, style);
            if (content) {
                editor.chain().focus().insertContent(content).run();
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={closeModal}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>

                <div className="mb-6 flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                        <MagicPencilIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Generate Content with AI</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Prompt
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe what you want to write about..."
                            className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Length</label>
                            <select
                                value={length}
                                onChange={(e) => setLength(e.target.value as any)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="short">Short</option>
                                <option value="medium">Medium</option>
                                <option value="long">Long</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Style</label>
                            <select
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="enthusiastic">Enthusiastic</option>
                                <option value="informative">Informative</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
