import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { TextSelection } from 'prosemirror-state';

interface FindReplaceProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FindReplace({ editor, isOpen, onClose }: FindReplaceProps) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [currentMatch, setCurrentMatch] = useState(-1);
  const [matches, setMatches] = useState<{from: number, to: number}[]>([]);
  const findInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && findInputRef.current) {
      findInputRef.current.focus();
    }
  }, [isOpen]);

  const findTextInEditor = useCallback((searchText: string) => {
    if (!editor || !searchText) {
      setMatches([]);
      setCurrentMatch(-1);
      editor?.chain().focus().unsetHighlight().run();
      return;
    }

    try {
      if (searchText.trim().length === 0) {
        setMatches([]);
        setCurrentMatch(-1);
        editor.chain().focus().unsetHighlight().run();
        return;
      }

      const doc = editor.state.doc;
      if (!doc || doc.content.size === 0) {
        console.warn('Document is empty or invalid');
        setMatches([]);
        setCurrentMatch(-1);
        return;
      }

      const caseInsensitive = true;
      const needle = caseInsensitive ? searchText.toLowerCase() : searchText;
      const found: { from: number; to: number }[] = [];

      try {
        let fullText = '';
        let positionMap: number[] = [];
        
        doc.descendants((node, pos) => {
          if (node.isText && node.text) {
            for (let i = 0; i < node.text.length; i++) {
              fullText += node.text[i];
              positionMap.push(pos + i);
            }
          }
          return true;
        });
        
        const fullTextLower = caseInsensitive ? fullText.toLowerCase() : fullText;
        let searchIndex = 0;
        
        while (true) {
          searchIndex = fullTextLower.indexOf(needle, searchIndex);
          if (searchIndex === -1) break;
          
          if (searchIndex + searchText.length <= positionMap.length) {
            const from = positionMap[searchIndex];
            const to = positionMap[searchIndex + searchText.length - 1] + 1;
            
            if (from >= 0 && to <= doc.content.size) {
              found.push({ from, to });
            }
          }
          
          searchIndex += 1;
        }
        
        found.sort((a, b) => a.from - b.from);
        
      } catch (traversalError) {
        console.error('Error traversing document:', traversalError);
        throw traversalError;
      }

      setMatches(found);
      setCurrentMatch(found.length > 0 ? 0 : -1);

      const { state, view } = editor;
      let tr = state.tr;

      tr = tr.removeMark(0, state.doc.content.size, state.schema.marks.highlight);
      
      const highlightMark = state.schema.marks.highlight?.create?.({ color: '#fff3c4' });
      const currentHighlightMark = state.schema.marks.highlight?.create?.({ color: '#ffd700' });
      
      if (highlightMark && currentHighlightMark && found.length > 0) {
        found.forEach(({ from, to }) => {
          tr = tr.addMark(from, to, highlightMark);
        });

        const { from, to } = found[0];
        tr = tr.addMark(from, to, currentHighlightMark);

        tr = tr.setSelection(TextSelection.create(tr.doc, from, to));
        view.dispatch(tr);

        const domNode = view.domAtPos(from)?.node as HTMLElement;
        domNode?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        view.dispatch(tr);
      }
    } catch (error) {
      console.error('Error in findTextInEditor:', error);
      setMatches([]);
      setCurrentMatch(-1);
      editor.chain().focus().unsetHighlight().run();
    }
  }, [editor]);

  const handleFindChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFindText(value);
    findTextInEditor(value);
  };

  const updateHighlights = useCallback((newCurrentMatch: number) => {
    if (!editor || matches.length === 0 || newCurrentMatch < 0 || newCurrentMatch >= matches.length) return;

    try {
      const { state, view } = editor;
      let tr = state.tr;
      
      tr = tr.removeMark(0, state.doc.content.size, state.schema.marks.highlight);
      
      const highlightMark = state.schema.marks.highlight?.create?.({ color: '#fff3c4' });
      const currentHighlightMark = state.schema.marks.highlight?.create?.({ color: '#ffd700' });
      
      if (highlightMark && currentHighlightMark) {
        matches.forEach(({ from, to }) => {
          tr = tr.addMark(from, to, highlightMark);
        });

        const { from, to } = matches[newCurrentMatch];
        tr = tr.addMark(from, to, currentHighlightMark);

        tr = tr.setSelection(TextSelection.create(tr.doc, from, to));
        view.dispatch(tr);

        const domNode = view.domAtPos(from)?.node as HTMLElement;
        domNode?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        editor.commands.focus();
      } else {
        view.dispatch(tr);
      }
    } catch (error) {
      console.error('Error in updateHighlights:', error);
    }
  }, [editor, matches]);

  const findNext = useCallback(() => {
    if (matches.length === 0 || currentMatch === -1) return;
    
    const nextMatch = (currentMatch + 1) % matches.length;
    setCurrentMatch(nextMatch);
    updateHighlights(nextMatch);
  }, [matches, currentMatch, updateHighlights]);

  const findPrevious = useCallback(() => {
    if (matches.length === 0 || currentMatch === -1) return;
    
    const prevMatch = (currentMatch - 1 + matches.length) % matches.length;
    setCurrentMatch(prevMatch);
    updateHighlights(prevMatch);
  }, [matches, currentMatch, updateHighlights]);

  const replaceCurrent = useCallback(() => {
    if (currentMatch < 0 || !editor || !findText || currentMatch >= matches.length) return;
    
    try {
      const match = matches[currentMatch];
      if (!match) return;
      
      const { state, view } = editor;
      let tr = state.tr;
      
      tr = tr.replaceWith(match.from, match.to, state.schema.text(replaceText));
      tr = tr.removeMark(match.from, match.from + replaceText.length, state.schema.marks.highlight);
      
      view.dispatch(tr);
      
      findTextInEditor(findText);
      
      editor.commands.focus();
    } catch (error) {
      console.error('Error in replaceCurrent:', error);
    }
  }, [editor, findText, replaceText, currentMatch, matches, findTextInEditor]);

  const replaceAll = useCallback(() => {
    if (!editor || !findText || matches.length === 0) return;
    
    try {
      const { state, view } = editor;
      let tr = state.tr;
      
      const sortedMatches = [...matches].sort((a, b) => b.from - a.from);
      
      sortedMatches.forEach(({ from, to }) => {
        tr = tr.replaceWith(from, to, state.schema.text(replaceText));
      });
      
      tr = tr.removeMark(0, tr.doc.content.size, state.schema.marks.highlight);
      
      view.dispatch(tr);
      
      setMatches([]);
      setCurrentMatch(-1);
      
      editor.commands.focus();
    } catch (error) {
      console.error('Error in replaceAll:', error);
    }
  }, [editor, matches, replaceText, findText]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        findPrevious();
      } else {
        findNext();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const inputs = document.querySelectorAll('input[type="text"]');
      const currentIndex = Array.from(inputs).indexOf(document.activeElement as HTMLInputElement);
      const nextIndex = e.shiftKey ? (currentIndex - 1 + inputs.length) % inputs.length : (currentIndex + 1) % inputs.length;
      (inputs[nextIndex] as HTMLInputElement).focus();
    }
  }, [findNext, findPrevious, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-md z-[9999] border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Find & Replace</h3>
          <button 
            onClick={() => {
              if (editor) {
                editor.chain().setTextSelection({ from: 0, to: editor.state.doc.content.size }).unsetHighlight().run();
              }
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Find
            </label>
            <input
              ref={findInputRef}
              type="text"
              value={findText}
              onChange={handleFindChange}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Find..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Replace With
            </label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Replace with..."
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">
                {matches.length > 0 
                  ? `${currentMatch + 1} of ${matches.length} matches` 
                  : findText ? 'No matches found' : 'Type to start searching'}
              </span>
              
              <div className="text-xs text-gray-500">
                <span className="mr-4">Enter: Next</span>
                <span className="mr-4">Shift+Enter: Previous</span>
                <span>Tab: Switch fields</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={findPrevious}
                  disabled={matches.length === 0}
                  title="Previous match (Shift+Enter)"
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    matches.length > 0 
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
                      : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={findNext}
                  disabled={matches.length === 0}
                  title="Next match (Enter)"
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    matches.length > 0 
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
                      : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={replaceCurrent}
                  disabled={matches.length === 0}
                  title="Replace current match"
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    matches.length > 0 
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
                      : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  Replace
                </button>

                <button
                  onClick={replaceAll}
                  disabled={matches.length === 0}
                  title={`Replace all ${matches.length} matches`}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    matches.length > 0 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700' 
                      : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  Replace All {matches.length > 0 ? `(${matches.length})` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
