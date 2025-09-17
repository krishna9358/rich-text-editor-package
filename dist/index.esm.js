import * as React from 'react';
import React__default, { useState, useEffect, useRef, useCallback } from 'react';
import { NodeViewWrapper, ReactNodeViewRenderer, useEditorState, useEditor, EditorContent } from '@tiptap/react';
import { Extension, Node, mergeAttributes, wrappingInputRule, getNodeType, getNodeAtPosition, isNodeActive, isAtStartOfNode, isAtEndOfNode, Mark, markInputRule, markPasteRule, canInsertNode, isNodeSelection, nodeInputRule, combineTransactionSteps, getChangedRanges, findChildrenInRange, getMarksBetween, getAttributes, callOrReturn, getExtensionField, findParentNodeClosestToPos, nodePasteRule, isNodeEmpty } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { TextSelection as TextSelection$1, NodeSelection as NodeSelection$1, Plugin, PluginKey } from '@tiptap/pm/state';
import { addColumnBefore, addColumnAfter, deleteColumn, addRowBefore, addRowAfter, deleteRow, deleteTable, mergeCells, splitCell, toggleHeader, toggleHeaderCell, setCellAttr, goToNextCell, fixTables, CellSelection, columnResizing, tableEditing } from '@tiptap/pm/tables';
import styled from 'styled-components';
import { dropCursor } from '@tiptap/pm/dropcursor';
import { DecorationSet, Decoration } from '@tiptap/pm/view';
import { gapCursor } from '@tiptap/pm/gapcursor';
import { undo, redo, history } from '@tiptap/pm/history';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// Default dimensions for YouTube videos
var DEFAULT_WIDTH = 640;
var DEFAULT_HEIGHT = 360;
var ASPECT_RATIO = 16 / 9;
// Get default dimensions maintaining aspect ratio
var getDefaultDimensions = function (width, height) {
    if (width && height) {
        return { width: width, height: height };
    }
    if (width) {
        return {
            width: width,
            height: Math.round(width / ASPECT_RATIO)
        };
    }
    if (height) {
        return {
            width: Math.round(height * ASPECT_RATIO),
            height: height
        };
    }
    return {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    };
};
// Extract video ID from YouTube URL
var getYouTubeVideoId = function (url) {
    var _a, _b;
    try {
        // Handle youtu.be URLs
        if (url.includes('youtu.be/')) {
            var id = (_a = url.split('youtu.be/')[1]) === null || _a === void 0 ? void 0 : _a.split(/[#?]/)[0];
            return id || null;
        }
        // Handle youtube.com URLs
        if (url.includes('youtube.com/')) {
            var urlObj = new URL(url);
            // Handle watch URLs
            if (url.includes('/watch')) {
                return urlObj.searchParams.get('v');
            }
            // Handle embed URLs
            if (url.includes('/embed/')) {
                return ((_b = url.split('/embed/')[1]) === null || _b === void 0 ? void 0 : _b.split(/[#?]/)[0]) || null;
            }
        }
        // Handle direct video IDs
        if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
            return url;
        }
        return null;
    }
    catch (_c) {
        return null;
    }
};
// Check if URL is a valid YouTube URL
var isValidYouTubeUrl = function (url) {
    return !!getYouTubeVideoId(url);
};
// Get YouTube embed URL
var getYouTubeEmbedUrl = function (url) {
    var videoId = getYouTubeVideoId(url);
    if (!videoId)
        return null;
    return "https://www.youtube.com/embed/".concat(videoId);
};

function YoutubeModal(_a) {
    var isOpen = _a.isOpen, closeModal = _a.closeModal, onSubmit = _a.onSubmit;
    var _b = useState(""), url = _b[0], setUrl = _b[1];
    var _c = useState(""), width = _c[0], setWidth = _c[1];
    var _d = useState(""), height = _d[0], setHeight = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    useEffect(function () {
        if (isOpen) {
            setUrl("");
            setWidth("");
            setHeight("");
            setError(null);
        }
    }, [isOpen]);
    var updateDimensions = function (newWidth, newHeight) {
        var w = newWidth ? parseInt(newWidth) : undefined;
        var h = newHeight ? parseInt(newHeight) : undefined;
        if (w && w < 320)
            return;
        if (h && h < 180)
            return;
        var _a = getDefaultDimensions(w, h), finalWidth = _a.width, finalHeight = _a.height;
        setWidth(finalWidth.toString());
        setHeight(finalHeight.toString());
    };
    var handleWidthChange = function (e) {
        var newWidth = e.target.value;
        updateDimensions(newWidth, height);
    };
    var handleHeightChange = function (e) {
        var newHeight = e.target.value;
        updateDimensions(width, newHeight);
    };
    var handleSubmit = function () {
        if (!isValidYouTubeUrl(url)) {
            setError("Please enter a valid YouTube URL");
            return;
        }
        var embedUrl = getYouTubeEmbedUrl(url);
        if (!embedUrl) {
            setError("Could not process YouTube URL");
            return;
        }
        var _a = getDefaultDimensions(width ? parseInt(width) : undefined, height ? parseInt(height) : undefined), finalWidth = _a.width, finalHeight = _a.height;
        onSubmit({
            url: embedUrl,
            width: finalWidth.toString(),
            height: finalHeight.toString()
        });
        closeModal();
    };
    if (!isOpen)
        return null;
    return (React__default.createElement("div", { className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50" },
        React__default.createElement("div", { className: "bg-white p-4 rounded-lg shadow-xl w-full max-w-md z-[9999] border border-gray-200" },
            React__default.createElement("div", { className: "flex justify-between items-center mb-4" },
                React__default.createElement("h3", { className: "text-lg font-semibold" }, "Attach Video"),
                React__default.createElement("button", { onClick: closeModal, className: "text-gray-500 hover:text-gray-700" }, "Close")),
            React__default.createElement("div", { className: "space-y-4" },
                React__default.createElement("div", null,
                    React__default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Video URL"),
                    React__default.createElement("input", { value: url, onChange: function (e) {
                            setUrl(e.target.value);
                            setError(null);
                        }, placeholder: "Enter YouTube URL or video ID...", className: "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ".concat(error ? 'border-red-500' : 'border-gray-300') }),
                    error && (React__default.createElement("p", { className: "mt-1 text-xs text-red-500" }, error)),
                    React__default.createElement("p", { className: "text-xs text-gray-500 mt-1" }, "Accepts YouTube URLs (youtube.com, youtu.be) or video IDs")),
                React__default.createElement("div", { className: "grid grid-cols-2 gap-4" },
                    React__default.createElement("div", null,
                        React__default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Width (px)"),
                        React__default.createElement("input", { value: width, onChange: handleWidthChange, placeholder: "e.g., 640", type: "number", min: "320", step: "10", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" }),
                        React__default.createElement("p", { className: "mt-1 text-xs text-gray-500" }, "Min: 320px")),
                    React__default.createElement("div", null,
                        React__default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Height (px)"),
                        React__default.createElement("input", { value: height, onChange: handleHeightChange, placeholder: "e.g., 360", type: "number", min: "180", step: "10", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" }),
                        React__default.createElement("p", { className: "mt-1 text-xs text-gray-500" }, "Min: 180px"))),
                React__default.createElement("p", { className: "text-xs text-gray-500" }, "Dimensions will maintain 16:9 aspect ratio")),
            React__default.createElement("div", { className: "flex justify-end gap-2 mt-6" },
                React__default.createElement("button", { onClick: closeModal, className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md" }, "Close"),
                React__default.createElement("button", { onClick: handleSubmit, disabled: !url, className: "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed" }, "Add")))));
}

function TableModal(_a) {
    var isOpen = _a.isOpen, closeModal = _a.closeModal, onSubmit = _a.onSubmit;
    var _b = useState("2"), rows = _b[0], setRows = _b[1];
    var _c = useState("3"), cols = _c[0], setCols = _c[1];
    var handleSubmit = function () {
        if (onSubmit) {
            onSubmit({ rows: rows, cols: cols });
        }
        closeModal();
    };
    if (!isOpen)
        return null;
    return (React__default.createElement("div", { className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50" },
        React__default.createElement("div", { className: "bg-white p-4 rounded-lg shadow-xl w-full max-w-md z-[9999] border border-gray-200" },
            React__default.createElement("div", { className: "flex justify-between items-center mb-4" },
                React__default.createElement("h3", { className: "text-lg font-semibold" }, "Insert Table"),
                React__default.createElement("button", { onClick: closeModal, className: "text-gray-500 hover:text-gray-700" }, "Close")),
            React__default.createElement("div", { className: "grid grid-cols-2 gap-4" },
                React__default.createElement("div", null,
                    React__default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Rows"),
                    React__default.createElement("input", { value: rows, onChange: function (e) { return setRows(e.target.value); }, placeholder: "Number of rows...", type: "number", min: "1", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })),
                React__default.createElement("div", null,
                    React__default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Columns"),
                    React__default.createElement("input", { value: cols, onChange: function (e) { return setCols(e.target.value); }, placeholder: "Number of columns...", type: "number", min: "1", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" }))),
            React__default.createElement("div", { className: "flex justify-end gap-2 mt-6" },
                React__default.createElement("button", { onClick: closeModal, className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md" }, "Close"),
                React__default.createElement("button", { onClick: handleSubmit, disabled: !rows || !cols || parseInt(rows) < 1 || parseInt(cols) < 1, className: "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed" }, "Add")))));
}

function LinkModal(_a) {
    var isOpen = _a.isOpen, closeModal = _a.closeModal, selectedText = _a.selectedText, existingUrl = _a.existingUrl, onSubmit = _a.onSubmit, onUnset = _a.onUnset;
    var _b = useState(""), url = _b[0], setUrl = _b[1];
    var _c = useState(""), text = _c[0], setText = _c[1];
    useEffect(function () {
        if (isOpen) {
            if (selectedText) {
                setText(selectedText);
            }
            if (existingUrl) {
                setUrl(existingUrl);
            }
        }
        else {
            setText("");
            setUrl("");
        }
    }, [isOpen, selectedText, existingUrl]);
    var handleSubmit = function () {
        if (onSubmit) {
            onSubmit({ url: url, text: text || undefined });
        }
        closeModal();
    };
    if (!isOpen)
        return null;
    return (React__default.createElement("div", { className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50" },
        React__default.createElement("div", { className: "bg-white p-4 rounded-lg shadow-xl w-full max-w-md z-[9999] border border-gray-200" },
            React__default.createElement("div", { className: "flex justify-between items-center mb-4" },
                React__default.createElement("h3", { className: "text-lg font-semibold" }, "Insert Link"),
                React__default.createElement("button", { onClick: closeModal, className: "text-gray-500 hover:text-gray-700" }, "Close")),
            React__default.createElement("div", { className: "space-y-4" },
                React__default.createElement("div", null,
                    React__default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Text"),
                    React__default.createElement("input", { value: text, onChange: function (e) { return setText(e.target.value); }, placeholder: "Link text (optional)...", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })),
                React__default.createElement("div", null,
                    React__default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "URL"),
                    React__default.createElement("input", { value: url, onChange: function (e) { return setUrl(e.target.value); }, placeholder: "Insert URL...", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" }))),
            React__default.createElement("div", { className: "flex justify-end gap-2 mt-6" },
                existingUrl && (React__default.createElement("button", { onClick: function () { onUnset === null || onUnset === void 0 ? void 0 : onUnset(); closeModal(); }, className: "px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md mr-auto" }, "Remove link")),
                React__default.createElement("button", { onClick: closeModal, className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md" }, "Close"),
                React__default.createElement("button", { onClick: handleSubmit, disabled: !url, className: "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed" }, "Add")))));
}

var BoldIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6 2.5C5.17157 2.5 4.5 3.17157 4.5 4V20C4.5 20.8284 5.17157 21.5 6 21.5H15C16.4587 21.5 17.8576 20.9205 18.8891 19.8891C19.9205 18.8576 20.5 17.4587 20.5 16C20.5 14.5413 19.9205 13.1424 18.8891 12.1109C18.6781 11.9 18.4518 11.7079 18.2128 11.5359C19.041 10.5492 19.5 9.29829 19.5 8C19.5 6.54131 18.9205 5.14236 17.8891 4.11091C16.8576 3.07946 15.4587 2.5 14 2.5H6ZM14 10.5C14.663 10.5 15.2989 10.2366 15.7678 9.76777C16.2366 9.29893 16.5 8.66304 16.5 8C16.5 7.33696 16.2366 6.70107 15.7678 6.23223C15.2989 5.76339 14.663 5.5 14 5.5H7.5V10.5H14ZM7.5 18.5V13.5H15C15.663 13.5 16.2989 13.7634 16.7678 14.2322C17.2366 14.7011 17.5 15.337 17.5 16C17.5 16.663 17.2366 17.2989 16.7678 17.7678C16.2989 18.2366 15.663 18.5 15 18.5H7.5Z", fill: "currentColor" })));
});
BoldIcon.displayName = "BoldIcon";

var ItalicIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M15.0222 3H19C19.5523 3 20 3.44772 20 4C20 4.55228 19.5523 5 19 5H15.693L10.443 19H14C14.5523 19 15 19.4477 15 20C15 20.5523 14.5523 21 14 21H9.02418C9.00802 21.0004 8.99181 21.0004 8.97557 21H5C4.44772 21 4 20.5523 4 20C4 19.4477 4.44772 19 5 19H8.30704L13.557 5H10C9.44772 5 9 4.55228 9 4C9 3.44772 9.44772 3 10 3H14.9782C14.9928 2.99968 15.0075 2.99967 15.0222 3Z", fill: "currentColor" })));
});
ItalicIcon.displayName = "ItalicIcon";

var UnderlineIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 4C7 3.44772 6.55228 3 6 3C5.44772 3 5 3.44772 5 4V10C5 11.8565 5.7375 13.637 7.05025 14.9497C8.36301 16.2625 10.1435 17 12 17C13.8565 17 15.637 16.2625 16.9497 14.9497C18.2625 13.637 19 11.8565 19 10V4C19 3.44772 18.5523 3 18 3C17.4477 3 17 3.44772 17 4V10C17 11.3261 16.4732 12.5979 15.5355 13.5355C14.5979 14.4732 13.3261 15 12 15C10.6739 15 9.40215 14.4732 8.46447 13.5355C7.52678 12.5979 7 11.3261 7 10V4ZM4 19C3.44772 19 3 19.4477 3 20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20C21 19.4477 20.5523 19 20 19H4Z", fill: "currentColor" })));
});
UnderlineIcon.displayName = "UnderlineIcon";

var StrikeIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M9.00039 3H16.0001C16.5524 3 17.0001 3.44772 17.0001 4C17.0001 4.55229 16.5524 5 16.0001 5H9.00011C8.68006 4.99983 8.36412 5.07648 8.07983 5.22349C7.79555 5.37051 7.55069 5.5836 7.36585 5.84487C7.181 6.10614 7.06155 6.40796 7.01754 6.72497C6.97352 7.04198 7.00623 7.36492 7.11292 7.66667C7.29701 8.18737 7.02414 8.75872 6.50344 8.94281C5.98274 9.1269 5.4114 8.85403 5.2273 8.33333C5.01393 7.72984 4.94851 7.08396 5.03654 6.44994C5.12456 5.81592 5.36346 5.21229 5.73316 4.68974C6.10285 4.1672 6.59256 3.74101 7.16113 3.44698C7.72955 3.15303 8.36047 2.99975 9.00039 3Z", fill: "currentColor" }),
        React.createElement("path", { d: "M18 13H20C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11H4C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H14C14.7956 13 15.5587 13.3161 16.1213 13.8787C16.6839 14.4413 17 15.2044 17 16C17 16.7956 16.6839 17.5587 16.1213 18.1213C15.5587 18.6839 14.7956 19 14 19H6C5.44772 19 5 19.4477 5 20C5 20.5523 5.44772 21 6 21H14C15.3261 21 16.5979 20.4732 17.5355 19.5355C18.4732 18.5979 19 17.3261 19 16C19 14.9119 18.6453 13.8604 18 13Z", fill: "currentColor" })));
});
StrikeIcon.displayName = "StrikeIcon";

var SubscriptIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.29289 7.29289C3.68342 6.90237 4.31658 6.90237 4.70711 7.29289L12.7071 15.2929C13.0976 15.6834 13.0976 16.3166 12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L3.29289 8.70711C2.90237 8.31658 2.90237 7.68342 3.29289 7.29289Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.7071 7.29289C13.0976 7.68342 13.0976 8.31658 12.7071 8.70711L4.70711 16.7071C4.31658 17.0976 3.68342 17.0976 3.29289 16.7071C2.90237 16.3166 2.90237 15.6834 3.29289 15.2929L11.2929 7.29289C11.6834 6.90237 12.3166 6.90237 12.7071 7.29289Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M17.4079 14.3995C18.0284 14.0487 18.7506 13.9217 19.4536 14.0397C20.1566 14.1578 20.7977 14.5138 21.2696 15.0481L21.2779 15.0574L21.2778 15.0575C21.7439 15.5988 22 16.2903 22 17C22 18.0823 21.3962 18.8401 20.7744 19.3404C20.194 19.8073 19.4858 20.141 18.9828 20.378C18.9638 20.387 18.9451 20.3958 18.9266 20.4045C18.4473 20.6306 18.2804 20.7817 18.1922 20.918C18.1773 20.9412 18.1619 20.9681 18.1467 21H21C21.5523 21 22 21.4477 22 22C22 22.5523 21.5523 23 21 23H17C16.4477 23 16 22.5523 16 22C16 21.1708 16.1176 20.4431 16.5128 19.832C16.9096 19.2184 17.4928 18.8695 18.0734 18.5956C18.6279 18.334 19.138 18.0901 19.5207 17.7821C19.8838 17.49 20 17.2477 20 17C20 16.7718 19.9176 16.5452 19.7663 16.3672C19.5983 16.1792 19.3712 16.0539 19.1224 16.0121C18.8722 15.9701 18.6152 16.015 18.3942 16.1394C18.1794 16.2628 18.0205 16.4549 17.9422 16.675C17.7572 17.1954 17.1854 17.4673 16.665 17.2822C16.1446 17.0972 15.8728 16.5254 16.0578 16.005C16.2993 15.3259 16.7797 14.7584 17.4039 14.4018L17.4079 14.3995L17.4079 14.3995Z", fill: "currentColor" })));
});
SubscriptIcon.displayName = "SubscriptIcon";

var SuperscriptIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12.7071 7.29289C13.0976 7.68342 13.0976 8.31658 12.7071 8.70711L4.70711 16.7071C4.31658 17.0976 3.68342 17.0976 3.29289 16.7071C2.90237 16.3166 2.90237 15.6834 3.29289 15.2929L11.2929 7.29289C11.6834 6.90237 12.3166 6.90237 12.7071 7.29289Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.29289 7.29289C3.68342 6.90237 4.31658 6.90237 4.70711 7.29289L12.7071 15.2929C13.0976 15.6834 13.0976 16.3166 12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L3.29289 8.70711C2.90237 8.31658 2.90237 7.68342 3.29289 7.29289Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M17.405 1.40657C18.0246 1.05456 18.7463 0.92634 19.4492 1.04344C20.1521 1.16054 20.7933 1.51583 21.2652 2.0497L21.2697 2.05469L21.2696 2.05471C21.7431 2.5975 22 3.28922 22 4.00203C22 5.08579 21.3952 5.84326 20.7727 6.34289C20.1966 6.80531 19.4941 7.13675 18.9941 7.37261C18.9714 7.38332 18.9491 7.39383 18.9273 7.40415C18.4487 7.63034 18.2814 7.78152 18.1927 7.91844C18.1778 7.94155 18.1625 7.96834 18.1473 8.00003H21C21.5523 8.00003 22 8.44774 22 9.00003C22 9.55231 21.5523 10 21 10H17C16.4477 10 16 9.55231 16 9.00003C16 8.17007 16.1183 7.44255 16.5138 6.83161C16.9107 6.21854 17.4934 5.86971 18.0728 5.59591C18.6281 5.33347 19.1376 5.09075 19.5208 4.78316C19.8838 4.49179 20 4.25026 20 4.00203C20 3.77192 19.9178 3.54865 19.7646 3.37182C19.5968 3.18324 19.3696 3.05774 19.1205 3.01625C18.8705 2.97459 18.6137 3.02017 18.3933 3.14533C18.1762 3.26898 18.0191 3.45826 17.9406 3.67557C17.7531 4.19504 17.18 4.46414 16.6605 4.27662C16.141 4.0891 15.8719 3.51596 16.0594 2.99649C16.303 2.3219 16.7817 1.76125 17.4045 1.40689L17.405 1.40657Z", fill: "currentColor" })));
});
SuperscriptIcon.displayName = "SuperscriptIcon";

var Code2Icon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M15.4545 4.2983C15.6192 3.77115 15.3254 3.21028 14.7983 3.04554C14.2712 2.88081 13.7103 3.1746 13.5455 3.70175L8.54554 19.7017C8.38081 20.2289 8.6746 20.7898 9.20175 20.9545C9.72889 21.1192 10.2898 20.8254 10.4545 20.2983L15.4545 4.2983Z", fill: "currentColor" }),
        React.createElement("path", { d: "M6.70711 7.29289C7.09763 7.68342 7.09763 8.31658 6.70711 8.70711L3.41421 12L6.70711 15.2929C7.09763 15.6834 7.09763 16.3166 6.70711 16.7071C6.31658 17.0976 5.68342 17.0976 5.29289 16.7071L1.29289 12.7071C0.902369 12.3166 0.902369 11.6834 1.29289 11.2929L5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.70711 7.29289Z", fill: "currentColor" }),
        React.createElement("path", { d: "M17.2929 7.29289C17.6834 6.90237 18.3166 6.90237 18.7071 7.29289L22.7071 11.2929C23.0976 11.6834 23.0976 12.3166 22.7071 12.7071L18.7071 16.7071C18.3166 17.0976 17.6834 17.0976 17.2929 16.7071C16.9024 16.3166 16.9024 15.6834 17.2929 15.2929L20.5858 12L17.2929 8.70711C16.9024 8.31658 16.9024 7.68342 17.2929 7.29289Z", fill: "currentColor" })));
});
Code2Icon.displayName = "Code2Icon";

var AlignLeftIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 12C2 11.4477 2.44772 11 3 11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H3C2.44772 13 2 12.5523 2 12Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 18C2 17.4477 2.44772 17 3 17H17C17.5523 17 18 17.4477 18 18C18 18.5523 17.5523 19 17 19H3C2.44772 19 2 18.5523 2 18Z", fill: "currentColor" })));
});
AlignLeftIcon.displayName = "AlignLeftIcon";

var AlignCenterIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4 18C4 17.4477 4.44772 17 5 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18Z", fill: "currentColor" })));
});
AlignCenterIcon.displayName = "AlignCenterIcon";

var AlignRightIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 12C8 11.4477 8.44772 11 9 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H9C8.44772 13 8 12.5523 8 12Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6 18C6 17.4477 6.44772 17 7 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H7C6.44772 19 6 18.5523 6 18Z", fill: "currentColor" })));
});
AlignRightIcon.displayName = "AlignRightIcon";

var ListIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 6C7 5.44772 7.44772 5 8 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H8C7.44772 7 7 6.55228 7 6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 12C7 11.4477 7.44772 11 8 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H8C7.44772 13 7 12.5523 7 12Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 18C7 17.4477 7.44772 17 8 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H8C7.44772 19 7 18.5523 7 18Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 6C2 5.44772 2.44772 5 3 5H3.01C3.56228 5 4.01 5.44772 4.01 6C4.01 6.55228 3.56228 7 3.01 7H3C2.44772 7 2 6.55228 2 6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 12C2 11.4477 2.44772 11 3 11H3.01C3.56228 11 4.01 11.4477 4.01 12C4.01 12.5523 3.56228 13 3.01 13H3C2.44772 13 2 12.5523 2 12Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 18C2 17.4477 2.44772 17 3 17H3.01C3.56228 17 4.01 17.4477 4.01 18C4.01 18.5523 3.56228 19 3.01 19H3C2.44772 19 2 18.5523 2 18Z", fill: "currentColor" })));
});
ListIcon.displayName = "ListIcon";

var ListOrderedIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9 6C9 5.44772 9.44772 5 10 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H10C9.44772 7 9 6.55228 9 6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9 12C9 11.4477 9.44772 11 10 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H10C9.44772 13 9 12.5523 9 12Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9 18C9 17.4477 9.44772 17 10 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H10C9.44772 19 9 18.5523 9 18Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3 6C3 5.44772 3.44772 5 4 5H5C5.55228 5 6 5.44772 6 6V10C6 10.5523 5.55228 11 5 11C4.44772 11 4 10.5523 4 10V7C3.44772 7 3 6.55228 3 6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3 10C3 9.44772 3.44772 9 4 9H6C6.55228 9 7 9.44772 7 10C7 10.5523 6.55228 11 6 11H4C3.44772 11 3 10.5523 3 10Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.82219 13.0431C6.54543 13.4047 6.99997 14.1319 6.99997 15C6.99997 15.5763 6.71806 16.0426 6.48747 16.35C6.31395 16.5814 6.1052 16.8044 5.91309 17H5.99997C6.55226 17 6.99997 17.4477 6.99997 18C6.99997 18.5523 6.55226 19 5.99997 19H3.99997C3.44769 19 2.99997 18.5523 2.99997 18C2.99997 17.4237 3.28189 16.9575 3.51247 16.65C3.74323 16.3424 4.03626 16.0494 4.26965 15.8161C4.27745 15.8083 4.2852 15.8006 4.29287 15.7929C4.55594 15.5298 4.75095 15.3321 4.88748 15.15C4.96287 15.0495 4.99021 14.9922 4.99911 14.9714C4.99535 14.9112 4.9803 14.882 4.9739 14.8715C4.96613 14.8588 4.95382 14.845 4.92776 14.8319C4.87723 14.8067 4.71156 14.7623 4.44719 14.8944C3.95321 15.1414 3.35254 14.9412 3.10555 14.4472C2.85856 13.9533 3.05878 13.3526 3.55276 13.1056C4.28839 12.7378 5.12272 12.6934 5.82219 13.0431Z", fill: "currentColor" })));
});
ListOrderedIcon.displayName = "ListOrderedIcon";

function ChevronRightIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "m8.25 4.5 7.5 7.5-7.5 7.5"
  }));
}
const ForwardRef = /*#__PURE__*/ React.forwardRef(ChevronRightIcon);
var ChevronRightIcon$1 = ForwardRef;

var BlockquoteIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 6C8 5.44772 8.44772 5 9 5H16C16.5523 5 17 5.44772 17 6C17 6.55228 16.5523 7 16 7H9C8.44772 7 8 6.55228 8 6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4 3C4.55228 3 5 3.44772 5 4L5 20C5 20.5523 4.55229 21 4 21C3.44772 21 3 20.5523 3 20L3 4C3 3.44772 3.44772 3 4 3Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 12C8 11.4477 8.44772 11 9 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H9C8.44772 13 8 12.5523 8 12Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 18C8 17.4477 8.44772 17 9 17H16C16.5523 17 17 17.4477 17 18C17 18.5523 16.5523 19 16 19H9C8.44772 19 8 18.5523 8 18Z", fill: "currentColor" })));
});
BlockquoteIcon.displayName = "BlockquoteIcon";

// ===============================================================================================
// Format menu bar for Tiptap used for formatting text used in the File Menubar
// ===============================================================================================
// Format menu component
function FormatMenu(_a) {
    var editor = _a.editor;
    // State for the format menu
    var _b = useState(false), open = _b[0], setOpen = _b[1];
    var _c = useState(false), textStyleOpen = _c[0], setTextStyleOpen = _c[1];
    var _d = useState(false), formatsOpen = _d[0], setFormatsOpen = _d[1];
    var _e = useState(false), fontSizeOpen = _e[0], setFontSizeOpen = _e[1];
    var _f = useState(false), alignOpen = _f[0], setAlignOpen = _f[1];
    var _g = useState(false), listsOpen = _g[0], setListsOpen = _g[1];
    var _h = useState(false), colorsOpen = _h[0], setColorsOpen = _h[1];
    // Font sizes
    var fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    // Return the format menu component
    return (React__default.createElement("div", { className: "relative", onMouseLeave: function () { return setOpen(false); } },
        React__default.createElement("button", { className: "text-gray-600 hover:text-gray-900 text-xs sm:text-sm", onClick: function () { return setOpen(!open); } }, "Format"),
        open && (React__default.createElement("div", { className: "absolute z-50 mt-1 bg-white border rounded shadow min-w-[220px] py-1" },
            React__default.createElement("div", { className: "relative", onMouseEnter: function () { return setTextStyleOpen(true); }, onMouseLeave: function () { return setTextStyleOpen(false); } },
                React__default.createElement("button", { className: "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100" },
                    React__default.createElement("span", null, "Text style"),
                    React__default.createElement(ChevronRightIcon$1, { className: "w-4 h-4 inline" })),
                textStyleOpen && (React__default.createElement("div", { className: "absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[240px] " },
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md", onClick: function () { return editor.chain().focus().toggleBold().run(); } },
                        React__default.createElement(BoldIcon, { className: "w-4 h-4 inline text-gray-800" }),
                        " Bold"),
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md", onClick: function () { return editor.chain().focus().toggleItalic().run(); } },
                        React__default.createElement(ItalicIcon, { className: "w-4 h-4 inline text-gray-800" }),
                        " Italic"),
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md", onClick: function () { return editor.chain().focus().toggleUnderline().run(); } },
                        React__default.createElement(UnderlineIcon, { className: "w-4 h-4 inline text-gray-800" }),
                        " Underline"),
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md", onClick: function () { return editor.chain().focus().toggleStrike().run(); } },
                        React__default.createElement(StrikeIcon, { className: "w-4 h-4 inline text-gray-800" }),
                        " Strikethrough"),
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md", onClick: function () { return editor.chain().focus().toggleSuperscript().run(); } },
                        React__default.createElement(SuperscriptIcon, { className: "w-4 h-4 inline text-gray-800" }),
                        " Superscript"),
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md", onClick: function () { return editor.chain().focus().toggleSubscript().run(); } },
                        React__default.createElement(SubscriptIcon, { className: "w-4 h-4 inline text-gray-800" }),
                        " Subscript"),
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md", onClick: function () { return editor.chain().focus().toggleCode().run(); } },
                        React__default.createElement(Code2Icon, { className: "w-4 h-4 inline text-gray-800" }),
                        " Code")))),
            React__default.createElement("div", { className: "relative", onMouseEnter: function () { return setFormatsOpen(true); }, onMouseLeave: function () { return setFormatsOpen(false); } },
                React__default.createElement("button", { className: "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100" },
                    React__default.createElement("span", null, "Formats"),
                    React__default.createElement(ChevronRightIcon$1, { className: "w-4 h-4 inline" })),
                formatsOpen && (React__default.createElement("div", { className: "absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[200px]" },
                    [1, 2, 3, 4, 5, 6].map(function (level) { return (React__default.createElement("button", { key: level, className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm rounded-md", onClick: function () { return editor.chain().focus().toggleHeading({ level: level }).run(); } },
                        "Heading ",
                        level)); }),
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm rounded-md", onClick: function () { return editor.chain().focus().setParagraph().run(); } }, "Paragraph")))),
            React__default.createElement("div", { className: "relative", onMouseEnter: function () { return setFontSizeOpen(true); }, onMouseLeave: function () { return setFontSizeOpen(false); } },
                React__default.createElement("button", { className: "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100" },
                    React__default.createElement("span", null, "Font size"),
                    React__default.createElement(ChevronRightIcon$1, { className: "w-4 h-4 inline" })),
                fontSizeOpen && (React__default.createElement("div", { className: "absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[160px] max-h-64 overflow-auto" }, fontSizes.map(function (s) { return (React__default.createElement("button", { key: s, className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm rounded-md", onClick: function () { return editor.chain().focus().setFontSize("".concat(s, "px")).run(); } },
                    s,
                    "px")); })))),
            React__default.createElement("div", { className: "relative", onMouseEnter: function () { return setAlignOpen(true); }, onMouseLeave: function () { return setAlignOpen(false); } },
                React__default.createElement("button", { className: "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100" },
                    React__default.createElement("span", null, "Align"),
                    React__default.createElement(ChevronRightIcon$1, { className: "w-4 h-4 inline" })),
                alignOpen && (React__default.createElement("div", { className: "absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[180px]" },
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md", onClick: function () {
                            if (editor.isActive('image'))
                                editor.chain().focus().updateAttributes('image', { align: 'left' }).run();
                            else if (editor.isActive('youtube'))
                                editor.chain().focus().updateAttributes('youtube', { align: 'left' }).run();
                            else
                                editor.chain().focus().setTextAlign('left').run();
                        } },
                        React__default.createElement(AlignLeftIcon, { className: "w-4 h-4 inline" }),
                        " Left"),
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md", onClick: function () {
                            if (editor.isActive('image'))
                                editor.chain().focus().updateAttributes('image', { align: 'center' }).run();
                            else if (editor.isActive('youtube'))
                                editor.chain().focus().updateAttributes('youtube', { align: 'center' }).run();
                            else
                                editor.chain().focus().setTextAlign('center').run();
                        } },
                        React__default.createElement(AlignCenterIcon, { className: "w-4 h-4 inline" }),
                        " Center"),
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md", onClick: function () {
                            if (editor.isActive('image'))
                                editor.chain().focus().updateAttributes('image', { align: 'right' }).run();
                            else if (editor.isActive('youtube'))
                                editor.chain().focus().updateAttributes('youtube', { align: 'right' }).run();
                            else
                                editor.chain().focus().setTextAlign('right').run();
                        } },
                        React__default.createElement(AlignRightIcon, { className: "w-4 h-4 inline" }),
                        " Right")))),
            React__default.createElement("div", { className: "relative", onMouseEnter: function () { return setListsOpen(true); }, onMouseLeave: function () { return setListsOpen(false); } },
                React__default.createElement("button", { className: "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100" },
                    React__default.createElement("span", null, "Lists"),
                    React__default.createElement(ChevronRightIcon$1, { className: "w-4 h-4 inline" })),
                listsOpen && (React__default.createElement("div", { className: "absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[180px]" },
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm rounded-md flex items-center gap-2", onClick: function () { return editor.chain().focus().toggleBulletList().run(); } },
                        React__default.createElement(ListIcon, { className: "w-4 h-4 inline" }),
                        " Bulleted"),
                    React__default.createElement("button", { className: "block w-full text-left px-2 py-1.5 hover:bg-gray-100 text-sm rounded-md flex items-center gap-2", onClick: function () { return editor.chain().focus().toggleOrderedList().run(); } },
                        React__default.createElement(ListOrderedIcon, { className: "w-4 h-4 inline" }),
                        " Numbered")))),
            React__default.createElement("div", { className: "relative", onMouseEnter: function () { return setColorsOpen(true); }, onMouseLeave: function () { return setColorsOpen(false); } },
                React__default.createElement("button", { className: "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100" },
                    React__default.createElement("span", null, "Colors"),
                    React__default.createElement(ChevronRightIcon$1, { className: "w-4 h-4 inline" })),
                colorsOpen && (React__default.createElement("div", { className: "absolute left-full top-0 ml-1 bg-white border rounded shadow p-2 z-50 min-w-[220px]" },
                    React__default.createElement("div", { className: "px-2 py-1 text-xs text-gray-500 flex items-center gap-2" }, "Text"),
                    React__default.createElement("input", { "aria-label": "text color", type: "color", className: "ml-2 mb-2 h-8 w-8 cursor-pointer", onChange: function (e) { return editor.chain().focus().setColor(e.target.value).run(); } }),
                    React__default.createElement("div", { className: "px-2 py-1 text-xs text-gray-500" }, "Background"),
                    React__default.createElement("input", { "aria-label": "background color", type: "color", className: "ml-2 h-8 w-8 cursor-pointer", onChange: function (e) { return editor.chain().focus().setHighlight({ color: e.target.value }).run(); } })))),
            React__default.createElement("button", { className: "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100", onClick: function () { return editor.chain().focus().toggleBlockquote().run(); } },
                React__default.createElement("span", null, "Blockquote"),
                React__default.createElement(BlockquoteIcon, { className: "w-4 h-4 inline" }))))));
}

// ===============================================================================================
// File menu bar for Tiptap used for file operations
// ===============================================================================================
// File menu bar component
function FileMenuBar(_a) {
    var editor = _a.editor, onOpenFindReplace = _a.onOpenFindReplace;
    var _b = useState(false), fileOpen = _b[0], setFileOpen = _b[1];
    var _c = useState(false), editOpen = _c[0], setEditOpen = _c[1];
    var _d = useState(false), insertOpen = _d[0], setInsertOpen = _d[1];
    var _e = useState(false), isYoutubeModalOpen = _e[0], setIsYoutubeModalOpen = _e[1];
    var _f = useState(false), setIsImageModalOpen = _f[1];
    var _g = useState(false), isTableModalOpen = _g[0], setIsTableModalOpen = _g[1];
    var _h = useState(false), isLinkModalOpen = _h[0], setIsLinkModalOpen = _h[1];
    var fileRef = useRef(null);
    var editRef = useRef(null);
    var insertRef = useRef(null);
    // Close dropdowns when clicking outside
    useEffect(function () {
        var handleClickOutside = function (event) {
            if (fileRef.current && !fileRef.current.contains(event.target)) {
                setFileOpen(false);
            }
            if (editRef.current && !editRef.current.contains(event.target)) {
                setEditOpen(false);
            }
            if (insertRef.current && !insertRef.current.contains(event.target)) {
                setInsertOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // Handle youtube submit
    var handleYoutubeSubmit = function (_a) {
        var url = _a.url, width = _a.width, height = _a.height;
        editor.chain().focus().insertContent({
            type: 'youtube',
            attrs: { src: url, width: parseInt(width), height: parseInt(height) }
        }).run();
    };
    // Handle table submit
    var handleTableSubmit = function (_a) {
        var rows = _a.rows, cols = _a.cols;
        editor.chain().focus().insertTable({ rows: parseInt(rows), cols: parseInt(cols), withHeaderRow: true }).run();
    };
    // Return the file menu bar component
    return (React__default.createElement("div", { className: "flex items-center gap-3 px-2 sm:px-4 py-1 ml-2" },
        React__default.createElement("div", { className: "relative", ref: fileRef },
            React__default.createElement("button", { className: "text-gray-600 hover:text-gray-900 text-xs sm:text-sm", onClick: function () { return setFileOpen(!fileOpen); } }, "File"),
            fileOpen && (React__default.createElement("div", { className: "absolute z-50 mt-1 bg-white border rounded shadow min-w-[180px]" },
                React__default.createElement("button", { className: "w-full text-left px-3 py-2 hover:bg-gray-100 text-sm", onClick: function () { editor.commands.clearContent(true); setFileOpen(false); } }, "New")))),
        React__default.createElement("div", { className: "relative", ref: editRef },
            React__default.createElement("button", { className: "text-gray-600 hover:text-gray-900 text-xs sm:text-sm", onClick: function () { return setEditOpen(!editOpen); } }, "Edit"),
            editOpen && (React__default.createElement("div", { className: "absolute z-50 mt-1 bg-white border rounded shadow min-w-[220px] p-1" },
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { return editor.chain().focus().undo().run(); } }, "Undo"),
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { return editor.chain().focus().redo().run(); } }, "Redo"),
                React__default.createElement("div", { className: "h-px bg-gray-200 my-1" }),
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { return document.execCommand('cut'); } }, "Cut"),
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { return document.execCommand('copy'); } }, "Copy"),
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { return document.execCommand('paste'); } }, "Paste"),
                React__default.createElement("div", { className: "h-px bg-gray-200 my-1" }),
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { onOpenFindReplace(); setEditOpen(false); } }, "Find & Replace")))),
        React__default.createElement("div", { className: "relative", ref: insertRef },
            React__default.createElement("button", { className: "text-gray-600 hover:text-gray-900 text-xs sm:text-sm", onClick: function () { return setInsertOpen(!insertOpen); } }, "Insert"),
            insertOpen && (React__default.createElement("div", { className: "absolute z-50 mt-1 bg-white border rounded shadow min-w-[220px] p-1" },
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { return setIsImageModalOpen(true); } }, "Image"),
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { return setIsLinkModalOpen(true); } }, "Link"),
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { return setIsYoutubeModalOpen(true); } }, "Video"),
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { return setIsTableModalOpen(true); } }, "Table"),
                React__default.createElement("button", { className: "w-full text-left px-3 py-1 hover:bg-gray-100 text-sm", onClick: function () { return editor.chain().focus().setHorizontalRule().run(); } }, "Horizontal Line")))),
        React__default.createElement(FormatMenu, { editor: editor }),
        React__default.createElement(YoutubeModal, { isOpen: isYoutubeModalOpen, closeModal: function () { return setIsYoutubeModalOpen(false); }, onSubmit: handleYoutubeSubmit }),
        React__default.createElement(TableModal, { isOpen: isTableModalOpen, closeModal: function () { return setIsTableModalOpen(false); }, onSubmit: handleTableSubmit }),
        React__default.createElement(LinkModal, { isOpen: isLinkModalOpen, closeModal: function () { return setIsLinkModalOpen(false); }, onSubmit: function (_a) {
                var url = _a.url, text = _a.text;
                if (!editor.state.selection.empty)
                    editor.chain().focus().setLink({ href: url }).run();
                else
                    editor.chain().focus().insertContent([{ type: 'text', text: text || url, marks: [{ type: 'link', attrs: { href: url } }] }]).run();
            } })));
}

// src/text-align.ts
var TextAlign = Extension.create({
  name: "textAlign",
  addOptions() {
    return {
      types: [],
      alignments: ["left", "center", "right", "justify"],
      defaultAlignment: null
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element) => {
              const alignment = element.style.textAlign;
              return this.options.alignments.includes(alignment) ? alignment : this.options.defaultAlignment;
            },
            renderHTML: (attributes) => {
              if (!attributes.textAlign) {
                return {};
              }
              return { style: `text-align: ${attributes.textAlign}` };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setTextAlign: (alignment) => ({ commands }) => {
        if (!this.options.alignments.includes(alignment)) {
          return false;
        }
        return this.options.types.map((type) => commands.updateAttributes(type, { textAlign: alignment })).every((response) => response);
      },
      unsetTextAlign: () => ({ commands }) => {
        return this.options.types.map((type) => commands.resetAttributes(type, "textAlign")).every((response) => response);
      },
      toggleTextAlign: (alignment) => ({ editor, commands }) => {
        if (!this.options.alignments.includes(alignment)) {
          return false;
        }
        if (editor.isActive({ textAlign: alignment })) {
          return commands.unsetTextAlign();
        }
        return commands.setTextAlign(alignment);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-l": () => this.editor.commands.setTextAlign("left"),
      "Mod-Shift-e": () => this.editor.commands.setTextAlign("center"),
      "Mod-Shift-r": () => this.editor.commands.setTextAlign("right"),
      "Mod-Shift-j": () => this.editor.commands.setTextAlign("justify")
    };
  }
});

// src/index.ts
var index_default$6 = TextAlign;

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var ListItemName = "listItem";
var TextStyleName = "textStyle";
var bulletListInputRegex = /^\s*([-+*])\s$/;
var BulletList = Node.create({
  name: "bulletList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {},
      keepMarks: false,
      keepAttributes: false
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML() {
    return [{ tag: "ul" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["ul", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      toggleBulletList: () => ({ commands, chain }) => {
        if (this.options.keepAttributes) {
          return chain().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(ListItemName, this.editor.getAttributes(TextStyleName)).run();
        }
        return commands.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    let inputRule = wrappingInputRule({
      find: bulletListInputRegex,
      type: this.type
    });
    if (this.options.keepMarks || this.options.keepAttributes) {
      inputRule = wrappingInputRule({
        find: bulletListInputRegex,
        type: this.type,
        keepMarks: this.options.keepMarks,
        keepAttributes: this.options.keepAttributes,
        getAttributes: () => {
          return this.editor.getAttributes(TextStyleName);
        },
        editor: this.editor
      });
    }
    return [inputRule];
  }
});
var ListItem = Node.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {},
      bulletListTypeName: "bulletList",
      orderedListTypeName: "orderedList"
    };
  },
  content: "paragraph block*",
  defining: true,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["li", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
});

// src/keymap/listHelpers/index.ts
var listHelpers_exports = {};
__export(listHelpers_exports, {
  findListItemPos: () => findListItemPos,
  getNextListDepth: () => getNextListDepth,
  handleBackspace: () => handleBackspace,
  handleDelete: () => handleDelete,
  hasListBefore: () => hasListBefore,
  hasListItemAfter: () => hasListItemAfter,
  hasListItemBefore: () => hasListItemBefore,
  listItemHasSubList: () => listItemHasSubList,
  nextListIsDeeper: () => nextListIsDeeper,
  nextListIsHigher: () => nextListIsHigher
});
var findListItemPos = (typeOrName, state) => {
  const { $from } = state.selection;
  const nodeType = getNodeType(typeOrName, state.schema);
  let currentNode = null;
  let currentDepth = $from.depth;
  let currentPos = $from.pos;
  let targetDepth = null;
  while (currentDepth > 0 && targetDepth === null) {
    currentNode = $from.node(currentDepth);
    if (currentNode.type === nodeType) {
      targetDepth = currentDepth;
    } else {
      currentDepth -= 1;
      currentPos -= 1;
    }
  }
  if (targetDepth === null) {
    return null;
  }
  return { $pos: state.doc.resolve(currentPos), depth: targetDepth };
};
var getNextListDepth = (typeOrName, state) => {
  const listItemPos = findListItemPos(typeOrName, state);
  if (!listItemPos) {
    return false;
  }
  const [, depth] = getNodeAtPosition(state, typeOrName, listItemPos.$pos.pos + 4);
  return depth;
};

// src/keymap/listHelpers/hasListBefore.ts
var hasListBefore = (editorState, name, parentListTypes) => {
  const { $anchor } = editorState.selection;
  const previousNodePos = Math.max(0, $anchor.pos - 2);
  const previousNode = editorState.doc.resolve(previousNodePos).node();
  if (!previousNode || !parentListTypes.includes(previousNode.type.name)) {
    return false;
  }
  return true;
};

// src/keymap/listHelpers/hasListItemBefore.ts
var hasListItemBefore = (typeOrName, state) => {
  var _a;
  const { $anchor } = state.selection;
  const $targetPos = state.doc.resolve($anchor.pos - 2);
  if ($targetPos.index() === 0) {
    return false;
  }
  if (((_a = $targetPos.nodeBefore) == null ? void 0 : _a.type.name) !== typeOrName) {
    return false;
  }
  return true;
};
var listItemHasSubList = (typeOrName, state, node) => {
  if (!node) {
    return false;
  }
  const nodeType = getNodeType(typeOrName, state.schema);
  let hasSubList = false;
  node.descendants((child) => {
    if (child.type === nodeType) {
      hasSubList = true;
    }
  });
  return hasSubList;
};

// src/keymap/listHelpers/handleBackspace.ts
var handleBackspace = (editor, name, parentListTypes) => {
  if (editor.commands.undoInputRule()) {
    return true;
  }
  if (editor.state.selection.from !== editor.state.selection.to) {
    return false;
  }
  if (!isNodeActive(editor.state, name) && hasListBefore(editor.state, name, parentListTypes)) {
    const { $anchor } = editor.state.selection;
    const $listPos = editor.state.doc.resolve($anchor.before() - 1);
    const listDescendants = [];
    $listPos.node().descendants((node, pos) => {
      if (node.type.name === name) {
        listDescendants.push({ node, pos });
      }
    });
    const lastItem = listDescendants.at(-1);
    if (!lastItem) {
      return false;
    }
    const $lastItemPos = editor.state.doc.resolve($listPos.start() + lastItem.pos + 1);
    return editor.chain().cut({ from: $anchor.start() - 1, to: $anchor.end() + 1 }, $lastItemPos.end()).joinForward().run();
  }
  if (!isNodeActive(editor.state, name)) {
    return false;
  }
  if (!isAtStartOfNode(editor.state)) {
    return false;
  }
  const listItemPos = findListItemPos(name, editor.state);
  if (!listItemPos) {
    return false;
  }
  const $prev = editor.state.doc.resolve(listItemPos.$pos.pos - 2);
  const prevNode = $prev.node(listItemPos.depth);
  const previousListItemHasSubList = listItemHasSubList(name, editor.state, prevNode);
  if (hasListItemBefore(name, editor.state) && !previousListItemHasSubList) {
    return editor.commands.joinItemBackward();
  }
  return editor.chain().liftListItem(name).run();
};

// src/keymap/listHelpers/nextListIsDeeper.ts
var nextListIsDeeper = (typeOrName, state) => {
  const listDepth = getNextListDepth(typeOrName, state);
  const listItemPos = findListItemPos(typeOrName, state);
  if (!listItemPos || !listDepth) {
    return false;
  }
  if (listDepth > listItemPos.depth) {
    return true;
  }
  return false;
};

// src/keymap/listHelpers/nextListIsHigher.ts
var nextListIsHigher = (typeOrName, state) => {
  const listDepth = getNextListDepth(typeOrName, state);
  const listItemPos = findListItemPos(typeOrName, state);
  if (!listItemPos || !listDepth) {
    return false;
  }
  if (listDepth < listItemPos.depth) {
    return true;
  }
  return false;
};

// src/keymap/listHelpers/handleDelete.ts
var handleDelete = (editor, name) => {
  if (!isNodeActive(editor.state, name)) {
    return false;
  }
  if (!isAtEndOfNode(editor.state, name)) {
    return false;
  }
  const { selection } = editor.state;
  const { $from, $to } = selection;
  if (!selection.empty && $from.sameParent($to)) {
    return false;
  }
  if (nextListIsDeeper(name, editor.state)) {
    return editor.chain().focus(editor.state.selection.from + 4).lift(name).joinBackward().run();
  }
  if (nextListIsHigher(name, editor.state)) {
    return editor.chain().joinForward().joinBackward().run();
  }
  return editor.commands.joinItemForward();
};

// src/keymap/listHelpers/hasListItemAfter.ts
var hasListItemAfter = (typeOrName, state) => {
  var _a;
  const { $anchor } = state.selection;
  const $targetPos = state.doc.resolve($anchor.pos - $anchor.parentOffset - 2);
  if ($targetPos.index() === $targetPos.parent.childCount - 1) {
    return false;
  }
  if (((_a = $targetPos.nodeAfter) == null ? void 0 : _a.type.name) !== typeOrName) {
    return false;
  }
  return true;
};

// src/keymap/list-keymap.ts
var ListKeymap = Extension.create({
  name: "listKeymap",
  addOptions() {
    return {
      listTypes: [
        {
          itemName: "listItem",
          wrapperNames: ["bulletList", "orderedList"]
        },
        {
          itemName: "taskItem",
          wrapperNames: ["taskList"]
        }
      ]
    };
  },
  addKeyboardShortcuts() {
    return {
      Delete: ({ editor }) => {
        let handled = false;
        this.options.listTypes.forEach(({ itemName }) => {
          if (editor.state.schema.nodes[itemName] === void 0) {
            return;
          }
          if (handleDelete(editor, itemName)) {
            handled = true;
          }
        });
        return handled;
      },
      "Mod-Delete": ({ editor }) => {
        let handled = false;
        this.options.listTypes.forEach(({ itemName }) => {
          if (editor.state.schema.nodes[itemName] === void 0) {
            return;
          }
          if (handleDelete(editor, itemName)) {
            handled = true;
          }
        });
        return handled;
      },
      Backspace: ({ editor }) => {
        let handled = false;
        this.options.listTypes.forEach(({ itemName, wrapperNames }) => {
          if (editor.state.schema.nodes[itemName] === void 0) {
            return;
          }
          if (handleBackspace(editor, itemName, wrapperNames)) {
            handled = true;
          }
        });
        return handled;
      },
      "Mod-Backspace": ({ editor }) => {
        let handled = false;
        this.options.listTypes.forEach(({ itemName, wrapperNames }) => {
          if (editor.state.schema.nodes[itemName] === void 0) {
            return;
          }
          if (handleBackspace(editor, itemName, wrapperNames)) {
            handled = true;
          }
        });
        return handled;
      }
    };
  }
});
var ListItemName2 = "listItem";
var TextStyleName2 = "textStyle";
var orderedListInputRegex = /^(\d+)\.\s$/;
var OrderedList = Node.create({
  name: "orderedList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {},
      keepMarks: false,
      keepAttributes: false
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  addAttributes() {
    return {
      start: {
        default: 1,
        parseHTML: (element) => {
          return element.hasAttribute("start") ? parseInt(element.getAttribute("start") || "", 10) : 1;
        }
      },
      type: {
        default: null,
        parseHTML: (element) => element.getAttribute("type")
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "ol"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const { start, ...attributesWithoutStart } = HTMLAttributes;
    return start === 1 ? ["ol", mergeAttributes(this.options.HTMLAttributes, attributesWithoutStart), 0] : ["ol", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      toggleOrderedList: () => ({ commands, chain }) => {
        if (this.options.keepAttributes) {
          return chain().toggleList(this.name, this.options.itemTypeName, this.options.keepMarks).updateAttributes(ListItemName2, this.editor.getAttributes(TextStyleName2)).run();
        }
        return commands.toggleList(this.name, this.options.itemTypeName, this.options.keepMarks);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    let inputRule = wrappingInputRule({
      find: orderedListInputRegex,
      type: this.type,
      getAttributes: (match) => ({ start: +match[1] }),
      joinPredicate: (match, node) => node.childCount + node.attrs.start === +match[1]
    });
    if (this.options.keepMarks || this.options.keepAttributes) {
      inputRule = wrappingInputRule({
        find: orderedListInputRegex,
        type: this.type,
        keepMarks: this.options.keepMarks,
        keepAttributes: this.options.keepAttributes,
        getAttributes: (match) => ({ start: +match[1], ...this.editor.getAttributes(TextStyleName2) }),
        joinPredicate: (match, node) => node.childCount + node.attrs.start === +match[1],
        editor: this.editor
      });
    }
    return [inputRule];
  }
});
var inputRegex$2 = /^\s*(\[([( |x])?\])\s$/;
var TaskItem = Node.create({
  name: "taskItem",
  addOptions() {
    return {
      nested: false,
      HTMLAttributes: {},
      taskListTypeName: "taskList",
      a11y: void 0
    };
  },
  content() {
    return this.options.nested ? "paragraph block*" : "paragraph+";
  },
  defining: true,
  addAttributes() {
    return {
      checked: {
        default: false,
        keepOnSplit: false,
        parseHTML: (element) => {
          const dataChecked = element.getAttribute("data-checked");
          return dataChecked === "" || dataChecked === "true";
        },
        renderHTML: (attributes) => ({
          "data-checked": attributes.checked
        })
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: `li[data-type="${this.name}"]`,
        priority: 51
      }
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "li",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name
      }),
      [
        "label",
        [
          "input",
          {
            type: "checkbox",
            checked: node.attrs.checked ? "checked" : null
          }
        ],
        ["span"]
      ],
      ["div", 0]
    ];
  },
  addKeyboardShortcuts() {
    const shortcuts = {
      Enter: () => this.editor.commands.splitListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
    if (!this.options.nested) {
      return shortcuts;
    }
    return {
      ...shortcuts,
      Tab: () => this.editor.commands.sinkListItem(this.name)
    };
  },
  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const listItem = document.createElement("li");
      const checkboxWrapper = document.createElement("label");
      const checkboxStyler = document.createElement("span");
      const checkbox = document.createElement("input");
      const content = document.createElement("div");
      const updateA11Y = (currentNode) => {
        var _a, _b;
        checkbox.ariaLabel = ((_b = (_a = this.options.a11y) == null ? void 0 : _a.checkboxLabel) == null ? void 0 : _b.call(_a, currentNode, checkbox.checked)) || `Task item checkbox for ${currentNode.textContent || "empty task item"}`;
      };
      updateA11Y(node);
      checkboxWrapper.contentEditable = "false";
      checkbox.type = "checkbox";
      checkbox.addEventListener("mousedown", (event) => event.preventDefault());
      checkbox.addEventListener("change", (event) => {
        if (!editor.isEditable && !this.options.onReadOnlyChecked) {
          checkbox.checked = !checkbox.checked;
          return;
        }
        const { checked } = event.target;
        if (editor.isEditable && typeof getPos === "function") {
          editor.chain().focus(void 0, { scrollIntoView: false }).command(({ tr }) => {
            const position = getPos();
            if (typeof position !== "number") {
              return false;
            }
            const currentNode = tr.doc.nodeAt(position);
            tr.setNodeMarkup(position, void 0, {
              ...currentNode == null ? void 0 : currentNode.attrs,
              checked
            });
            return true;
          }).run();
        }
        if (!editor.isEditable && this.options.onReadOnlyChecked) {
          if (!this.options.onReadOnlyChecked(node, checked)) {
            checkbox.checked = !checkbox.checked;
          }
        }
      });
      Object.entries(this.options.HTMLAttributes).forEach(([key, value]) => {
        listItem.setAttribute(key, value);
      });
      listItem.dataset.checked = node.attrs.checked;
      checkbox.checked = node.attrs.checked;
      checkboxWrapper.append(checkbox, checkboxStyler);
      listItem.append(checkboxWrapper, content);
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        listItem.setAttribute(key, value);
      });
      return {
        dom: listItem,
        contentDOM: content,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false;
          }
          listItem.dataset.checked = updatedNode.attrs.checked;
          checkbox.checked = updatedNode.attrs.checked;
          updateA11Y(updatedNode);
          return true;
        }
      };
    };
  },
  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex$2,
        type: this.type,
        getAttributes: (match) => ({
          checked: match[match.length - 1] === "x"
        })
      })
    ];
  }
});
var TaskList = Node.create({
  name: "taskList",
  addOptions() {
    return {
      itemTypeName: "taskItem",
      HTMLAttributes: {}
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 51
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["ul", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { "data-type": this.name }), 0];
  },
  addCommands() {
    return {
      toggleTaskList: () => ({ commands }) => {
        return commands.toggleList(this.name, this.options.itemTypeName);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-9": () => this.editor.commands.toggleTaskList()
    };
  }
});

// src/kit/index.ts
Extension.create({
  name: "listKit",
  addExtensions() {
    const extensions = [];
    if (this.options.bulletList !== false) {
      extensions.push(BulletList.configure(this.options.bulletList));
    }
    if (this.options.listItem !== false) {
      extensions.push(ListItem.configure(this.options.listItem));
    }
    if (this.options.listKeymap !== false) {
      extensions.push(ListKeymap.configure(this.options.listKeymap));
    }
    if (this.options.orderedList !== false) {
      extensions.push(OrderedList.configure(this.options.orderedList));
    }
    if (this.options.taskItem !== false) {
      extensions.push(TaskItem.configure(this.options.taskItem));
    }
    if (this.options.taskList !== false) {
      extensions.push(TaskList.configure(this.options.taskList));
    }
    return extensions;
  }
});

// src/subscript.ts
var Subscript = Mark.create({
  name: "subscript",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "sub"
      },
      {
        style: "vertical-align",
        getAttrs(value) {
          if (value !== "sub") {
            return false;
          }
          return null;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["sub", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setSubscript: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleSubscript: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetSubscript: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-,": () => this.editor.commands.toggleSubscript()
    };
  }
});

// src/superscript.ts
var Superscript = Mark.create({
  name: "superscript",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "sup"
      },
      {
        style: "vertical-align",
        getAttrs(value) {
          if (value !== "super") {
            return false;
          }
          return null;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["sup", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setSuperscript: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleSuperscript: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetSuperscript: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-.": () => this.editor.commands.toggleSuperscript()
    };
  }
});

// src/text-style/index.ts
var mergeNestedSpanStyles = (element) => {
  if (!element.children.length) {
    return;
  }
  const childSpans = element.querySelectorAll("span");
  if (!childSpans) {
    return;
  }
  childSpans.forEach((childSpan) => {
    var _a, _b;
    const childStyle = childSpan.getAttribute("style");
    const closestParentSpanStyleOfChild = (_b = (_a = childSpan.parentElement) == null ? void 0 : _a.closest("span")) == null ? void 0 : _b.getAttribute("style");
    childSpan.setAttribute("style", `${closestParentSpanStyleOfChild};${childStyle}`);
  });
};
var TextStyle = Mark.create({
  name: "textStyle",
  priority: 101,
  addOptions() {
    return {
      HTMLAttributes: {},
      mergeNestedSpanStyles: true
    };
  },
  parseHTML() {
    return [
      {
        tag: "span",
        consuming: false,
        getAttrs: (element) => {
          const hasStyles = element.hasAttribute("style");
          if (!hasStyles) {
            return false;
          }
          if (this.options.mergeNestedSpanStyles) {
            mergeNestedSpanStyles(element);
          }
          return {};
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      toggleTextStyle: (attributes) => ({ commands }) => {
        return commands.toggleMark(this.name, attributes);
      },
      removeEmptyTextStyle: () => ({ tr }) => {
        const { selection } = tr;
        tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
          if (node.isTextblock) {
            return true;
          }
          if (!node.marks.filter((mark) => mark.type === this.type).some((mark) => Object.values(mark.attrs).some((value) => !!value))) {
            tr.removeMark(pos, pos + node.nodeSize, this.type);
          }
        });
        return true;
      }
    };
  }
});
var BackgroundColor = Extension.create({
  name: "backgroundColor",
  addOptions() {
    return {
      types: ["textStyle"]
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) => {
              var _a;
              return (_a = element.style.backgroundColor) == null ? void 0 : _a.replace(/['"]+/g, "");
            },
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {};
              }
              return {
                style: `background-color: ${attributes.backgroundColor}`
              };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setBackgroundColor: (backgroundColor) => ({ chain }) => {
        return chain().setMark("textStyle", { backgroundColor }).run();
      },
      unsetBackgroundColor: () => ({ chain }) => {
        return chain().setMark("textStyle", { backgroundColor: null }).removeEmptyTextStyle().run();
      }
    };
  }
});
var Color = Extension.create({
  name: "color",
  addOptions() {
    return {
      types: ["textStyle"]
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            default: null,
            parseHTML: (element) => {
              var _a;
              return (_a = element.style.color) == null ? void 0 : _a.replace(/['"]+/g, "");
            },
            renderHTML: (attributes) => {
              if (!attributes.color) {
                return {};
              }
              return {
                style: `color: ${attributes.color}`
              };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setColor: (color) => ({ chain }) => {
        return chain().setMark("textStyle", { color }).run();
      },
      unsetColor: () => ({ chain }) => {
        return chain().setMark("textStyle", { color: null }).removeEmptyTextStyle().run();
      }
    };
  }
});
var FontFamily = Extension.create({
  name: "fontFamily",
  addOptions() {
    return {
      types: ["textStyle"]
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => element.style.fontFamily,
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) {
                return {};
              }
              return {
                style: `font-family: ${attributes.fontFamily}`
              };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setFontFamily: (fontFamily) => ({ chain }) => {
        return chain().setMark("textStyle", { fontFamily }).run();
      },
      unsetFontFamily: () => ({ chain }) => {
        return chain().setMark("textStyle", { fontFamily: null }).removeEmptyTextStyle().run();
      }
    };
  }
});
var FontSize$1 = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"]
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`
              };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize) => ({ chain }) => {
        return chain().setMark("textStyle", { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
      }
    };
  }
});
var LineHeight = Extension.create({
  name: "lineHeight",
  addOptions() {
    return {
      types: ["textStyle"]
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`
              };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight) => ({ chain }) => {
        return chain().setMark("textStyle", { lineHeight }).run();
      },
      unsetLineHeight: () => ({ chain }) => {
        return chain().setMark("textStyle", { lineHeight: null }).removeEmptyTextStyle().run();
      }
    };
  }
});
var TextStyleKit = Extension.create({
  name: "textStyleKit",
  addExtensions() {
    const extensions = [];
    if (this.options.backgroundColor !== false) {
      extensions.push(BackgroundColor.configure(this.options.backgroundColor));
    }
    if (this.options.color !== false) {
      extensions.push(Color.configure(this.options.color));
    }
    if (this.options.fontFamily !== false) {
      extensions.push(FontFamily.configure(this.options.fontFamily));
    }
    if (this.options.fontSize !== false) {
      extensions.push(FontSize$1.configure(this.options.fontSize));
    }
    if (this.options.lineHeight !== false) {
      extensions.push(LineHeight.configure(this.options.lineHeight));
    }
    if (this.options.textStyle !== false) {
      extensions.push(TextStyle.configure(this.options.textStyle));
    }
    return extensions;
  }
});

// src/highlight.ts
var inputRegex$1 = /(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))$/;
var pasteRegex = /(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))/g;
var Highlight = Mark.create({
  name: "highlight",
  addOptions() {
    return {
      multicolor: false,
      HTMLAttributes: {}
    };
  },
  addAttributes() {
    if (!this.options.multicolor) {
      return {};
    }
    return {
      color: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-color") || element.style.backgroundColor,
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {};
          }
          return {
            "data-color": attributes.color,
            style: `background-color: ${attributes.color}; color: inherit`
          };
        }
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "mark"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["mark", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setHighlight: (attributes) => ({ commands }) => {
        return commands.setMark(this.name, attributes);
      },
      toggleHighlight: (attributes) => ({ commands }) => {
        return commands.toggleMark(this.name, attributes);
      },
      unsetHighlight: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-h": () => this.editor.commands.toggleHighlight()
    };
  },
  addInputRules() {
    return [
      markInputRule({
        find: inputRegex$1,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type
      })
    ];
  }
});

// src/index.ts
var index_default$5 = Highlight;

// src/horizontal-rule.ts
var HorizontalRule = Node.create({
  name: "horizontalRule",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  parseHTML() {
    return [{ tag: "hr" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["hr", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain, state }) => {
        if (!canInsertNode(state, state.schema.nodes[this.name])) {
          return false;
        }
        const { selection } = state;
        const { $to: $originTo } = selection;
        const currentChain = chain();
        if (isNodeSelection(selection)) {
          currentChain.insertContentAt($originTo.pos, {
            type: this.name
          });
        } else {
          currentChain.insertContent({ type: this.name });
        }
        return currentChain.command(({ tr, dispatch }) => {
          var _a;
          if (dispatch) {
            const { $to } = tr.selection;
            const posAfter = $to.end();
            if ($to.nodeAfter) {
              if ($to.nodeAfter.isTextblock) {
                tr.setSelection(TextSelection$1.create(tr.doc, $to.pos + 1));
              } else if ($to.nodeAfter.isBlock) {
                tr.setSelection(NodeSelection$1.create(tr.doc, $to.pos));
              } else {
                tr.setSelection(TextSelection$1.create(tr.doc, $to.pos));
              }
            } else {
              const node = (_a = $to.parent.type.contentMatch.defaultType) == null ? void 0 : _a.create();
              if (node) {
                tr.insert(posAfter, node);
                tr.setSelection(TextSelection$1.create(tr.doc, posAfter + 1));
              }
            }
            tr.scrollIntoView();
          }
          return true;
        }).run();
      }
    };
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
});

// src/index.ts
var index_default$4 = HorizontalRule;

// src/underline.ts
var Underline = Mark.create({
  name: "underline",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "u"
      },
      {
        style: "text-decoration",
        consuming: false,
        getAttrs: (style) => style.includes("underline") ? {} : false
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["u", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setUnderline: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleUnderline: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetUnderline: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-u": () => this.editor.commands.toggleUnderline(),
      "Mod-U": () => this.editor.commands.toggleUnderline()
    };
  }
});

// src/index.ts
var index_default$3 = Underline;

// THIS FILE IS AUTOMATICALLY GENERATED DO NOT EDIT DIRECTLY
// See update-tlds.js for encoding/decoding format
// https://data.iana.org/TLD/tlds-alpha-by-domain.txt
const encodedTlds = 'aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3nlop4pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2o0dyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rckmsd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0stone5umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2olterskluwer11odside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2';
// Internationalized domain names containing non-ASCII
const encodedUtlds = 'ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2';

/**
 * Finite State Machine generation utilities
 */

/**
 * @template T
 * @typedef {{ [group: string]: T[] }} Collections
 */

/**
 * @typedef {{ [group: string]: true }} Flags
 */

// Keys in scanner Collections instances
const numeric = 'numeric';
const ascii = 'ascii';
const alpha = 'alpha';
const asciinumeric = 'asciinumeric';
const alphanumeric = 'alphanumeric';
const domain = 'domain';
const emoji = 'emoji';
const scheme = 'scheme';
const slashscheme = 'slashscheme';
const whitespace = 'whitespace';

/**
 * @template T
 * @param {string} name
 * @param {Collections<T>} groups to register in
 * @returns {T[]} Current list of tokens in the given collection
 */
function registerGroup(name, groups) {
  if (!(name in groups)) {
    groups[name] = [];
  }
  return groups[name];
}

/**
 * @template T
 * @param {T} t token to add
 * @param {Collections<T>} groups
 * @param {Flags} flags
 */
function addToGroups(t, flags, groups) {
  if (flags[numeric]) {
    flags[asciinumeric] = true;
    flags[alphanumeric] = true;
  }
  if (flags[ascii]) {
    flags[asciinumeric] = true;
    flags[alpha] = true;
  }
  if (flags[asciinumeric]) {
    flags[alphanumeric] = true;
  }
  if (flags[alpha]) {
    flags[alphanumeric] = true;
  }
  if (flags[alphanumeric]) {
    flags[domain] = true;
  }
  if (flags[emoji]) {
    flags[domain] = true;
  }
  for (const k in flags) {
    const group = registerGroup(k, groups);
    if (group.indexOf(t) < 0) {
      group.push(t);
    }
  }
}

/**
 * @template T
 * @param {T} t token to check
 * @param {Collections<T>} groups
 * @returns {Flags} group flags that contain this token
 */
function flagsForToken(t, groups) {
  const result = {};
  for (const c in groups) {
    if (groups[c].indexOf(t) >= 0) {
      result[c] = true;
    }
  }
  return result;
}

/**
 * @template T
 * @typedef {null | T } Transition
 */

/**
 * Define a basic state machine state. j is the list of character transitions,
 * jr is the list of regex-match transitions, jd is the default state to
 * transition to t is the accepting token type, if any. If this is the terminal
 * state, then it does not emit a token.
 *
 * The template type T represents the type of the token this state accepts. This
 * should be a string (such as of the token exports in `text.js`) or a
 * MultiToken subclass (from `multi.js`)
 *
 * @template T
 * @param {T} [token] Token that this state emits
 */
function State(token = null) {
  // this.n = null; // DEBUG: State name
  /** @type {{ [input: string]: State<T> }} j */
  this.j = {}; // IMPLEMENTATION 1
  // this.j = []; // IMPLEMENTATION 2
  /** @type {[RegExp, State<T>][]} jr */
  this.jr = [];
  /** @type {?State<T>} jd */
  this.jd = null;
  /** @type {?T} t */
  this.t = token;
}

/**
 * Scanner token groups
 * @type Collections<string>
 */
State.groups = {};
State.prototype = {
  accepts() {
    return !!this.t;
  },
  /**
   * Follow an existing transition from the given input to the next state.
   * Does not mutate.
   * @param {string} input character or token type to transition on
   * @returns {?State<T>} the next state, if any
   */
  go(input) {
    const state = this;
    const nextState = state.j[input];
    if (nextState) {
      return nextState;
    }
    for (let i = 0; i < state.jr.length; i++) {
      const regex = state.jr[i][0];
      const nextState = state.jr[i][1]; // note: might be empty to prevent default jump
      if (nextState && regex.test(input)) {
        return nextState;
      }
    }
    // Nowhere left to jump! Return default, if any
    return state.jd;
  },
  /**
   * Whether the state has a transition for the given input. Set the second
   * argument to true to only look for an exact match (and not a default or
   * regular-expression-based transition)
   * @param {string} input
   * @param {boolean} exactOnly
   */
  has(input, exactOnly = false) {
    return exactOnly ? input in this.j : !!this.go(input);
  },
  /**
   * Short for "transition all"; create a transition from the array of items
   * in the given list to the same final resulting state.
   * @param {string | string[]} inputs Group of inputs to transition on
   * @param {Transition<T> | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   */
  ta(inputs, next, flags, groups) {
    for (let i = 0; i < inputs.length; i++) {
      this.tt(inputs[i], next, flags, groups);
    }
  },
  /**
   * Short for "take regexp transition"; defines a transition for this state
   * when it encounters a token which matches the given regular expression
   * @param {RegExp} regexp Regular expression transition (populate first)
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  tr(regexp, next, flags, groups) {
    groups = groups || State.groups;
    let nextState;
    if (next && next.j) {
      nextState = next;
    } else {
      // Token with maybe token groups
      nextState = new State(next);
      if (flags && groups) {
        addToGroups(next, flags, groups);
      }
    }
    this.jr.push([regexp, nextState]);
    return nextState;
  },
  /**
   * Short for "take transitions", will take as many sequential transitions as
   * the length of the given input and returns the
   * resulting final state.
   * @param {string | string[]} input
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of token groups
   * @returns {State<T>} taken after the given input
   */
  ts(input, next, flags, groups) {
    let state = this;
    const len = input.length;
    if (!len) {
      return state;
    }
    for (let i = 0; i < len - 1; i++) {
      state = state.tt(input[i]);
    }
    return state.tt(input[len - 1], next, flags, groups);
  },
  /**
   * Short for "take transition", this is a method for building/working with
   * state machines.
   *
   * If a state already exists for the given input, returns it.
   *
   * If a token is specified, that state will emit that token when reached by
   * the linkify engine.
   *
   * If no state exists, it will be initialized with some default transitions
   * that resemble existing default transitions.
   *
   * If a state is given for the second argument, that state will be
   * transitioned to on the given input regardless of what that input
   * previously did.
   *
   * Specify a token group flags to define groups that this token belongs to.
   * The token will be added to corresponding entires in the given groups
   * object.
   *
   * @param {string} input character, token type to transition on
   * @param {T | State<T>} [next] Transition options
   * @param {Flags} [flags] Collections flags to add token to
   * @param {Collections<T>} [groups] Master list of groups
   * @returns {State<T>} taken after the given input
   */
  tt(input, next, flags, groups) {
    groups = groups || State.groups;
    const state = this;

    // Check if existing state given, just a basic transition
    if (next && next.j) {
      state.j[input] = next;
      return next;
    }
    const t = next;

    // Take the transition with the usual default mechanisms and use that as
    // a template for creating the next state
    let nextState,
      templateState = state.go(input);
    if (templateState) {
      nextState = new State();
      Object.assign(nextState.j, templateState.j);
      nextState.jr.push.apply(nextState.jr, templateState.jr);
      nextState.jd = templateState.jd;
      nextState.t = templateState.t;
    } else {
      nextState = new State();
    }
    if (t) {
      // Ensure newly token is in the same groups as the old token
      if (groups) {
        if (nextState.t && typeof nextState.t === 'string') {
          const allFlags = Object.assign(flagsForToken(nextState.t, groups), flags);
          addToGroups(t, allFlags, groups);
        } else if (flags) {
          addToGroups(t, flags, groups);
        }
      }
      nextState.t = t; // overwrite anything that was previously there
    }
    state.j[input] = nextState;
    return nextState;
  }
};

// Helper functions to improve minification (not exported outside linkifyjs module)

/**
 * @template T
 * @param {State<T>} state
 * @param {string | string[]} input
 * @param {Flags} [flags]
 * @param {Collections<T>} [groups]
 */
const ta = (state, input, next, flags, groups) => state.ta(input, next, flags, groups);

/**
 * @template T
 * @param {State<T>} state
 * @param {RegExp} regexp
 * @param {T | State<T>} [next]
 * @param {Flags} [flags]
 * @param {Collections<T>} [groups]
 */
const tr = (state, regexp, next, flags, groups) => state.tr(regexp, next, flags, groups);

/**
 * @template T
 * @param {State<T>} state
 * @param {string | string[]} input
 * @param {T | State<T>} [next]
 * @param {Flags} [flags]
 * @param {Collections<T>} [groups]
 */
const ts = (state, input, next, flags, groups) => state.ts(input, next, flags, groups);

/**
 * @template T
 * @param {State<T>} state
 * @param {string} input
 * @param {T | State<T>} [next]
 * @param {Collections<T>} [groups]
 * @param {Flags} [flags]
 */
const tt = (state, input, next, flags, groups) => state.tt(input, next, flags, groups);

/******************************************************************************
Text Tokens
Identifiers for token outputs from the regexp scanner
******************************************************************************/

// A valid web domain token
const WORD = 'WORD'; // only contains a-z
const UWORD = 'UWORD'; // contains letters other than a-z, used for IDN
const ASCIINUMERICAL = 'ASCIINUMERICAL'; // contains a-z, 0-9
const ALPHANUMERICAL = 'ALPHANUMERICAL'; // contains numbers and letters other than a-z, used for IDN

// Special case of word
const LOCALHOST = 'LOCALHOST';

// Valid top-level domain, special case of WORD (see tlds.js)
const TLD = 'TLD';

// Valid IDN TLD, special case of UWORD (see tlds.js)
const UTLD = 'UTLD';

// The scheme portion of a web URI protocol. Supported types include: `mailto`,
// `file`, and user-defined custom protocols. Limited to schemes that contain
// only letters
const SCHEME = 'SCHEME';

// Similar to SCHEME, except makes distinction for schemes that must always be
// followed by `://`, not just `:`. Supported types include `http`, `https`,
// `ftp`, `ftps`
const SLASH_SCHEME = 'SLASH_SCHEME';

// Any sequence of digits 0-9
const NUM = 'NUM';

// Any number of consecutive whitespace characters that are not newline
const WS = 'WS';

// New line (unix style)
const NL = 'NL'; // \n

// Opening/closing bracket classes
// TODO: Rename OPEN -> LEFT and CLOSE -> RIGHT in v5 to fit with Unicode names
// Also rename angle brackes to LESSTHAN and GREATER THAN
const OPENBRACE = 'OPENBRACE'; // {
const CLOSEBRACE = 'CLOSEBRACE'; // }
const OPENBRACKET = 'OPENBRACKET'; // [
const CLOSEBRACKET = 'CLOSEBRACKET'; // ]
const OPENPAREN = 'OPENPAREN'; // (
const CLOSEPAREN = 'CLOSEPAREN'; // )
const OPENANGLEBRACKET = 'OPENANGLEBRACKET'; // <
const CLOSEANGLEBRACKET = 'CLOSEANGLEBRACKET'; // >
const FULLWIDTHLEFTPAREN = 'FULLWIDTHLEFTPAREN'; // （
const FULLWIDTHRIGHTPAREN = 'FULLWIDTHRIGHTPAREN'; // ）
const LEFTCORNERBRACKET = 'LEFTCORNERBRACKET'; // 「
const RIGHTCORNERBRACKET = 'RIGHTCORNERBRACKET'; // 」
const LEFTWHITECORNERBRACKET = 'LEFTWHITECORNERBRACKET'; // 『
const RIGHTWHITECORNERBRACKET = 'RIGHTWHITECORNERBRACKET'; // 』
const FULLWIDTHLESSTHAN = 'FULLWIDTHLESSTHAN'; // ＜
const FULLWIDTHGREATERTHAN = 'FULLWIDTHGREATERTHAN'; // ＞

// Various symbols
const AMPERSAND = 'AMPERSAND'; // &
const APOSTROPHE = 'APOSTROPHE'; // '
const ASTERISK = 'ASTERISK'; // *
const AT = 'AT'; // @
const BACKSLASH = 'BACKSLASH'; // \
const BACKTICK = 'BACKTICK'; // `
const CARET = 'CARET'; // ^
const COLON = 'COLON'; // :
const COMMA = 'COMMA'; // ,
const DOLLAR = 'DOLLAR'; // $
const DOT = 'DOT'; // .
const EQUALS = 'EQUALS'; // =
const EXCLAMATION = 'EXCLAMATION'; // !
const HYPHEN = 'HYPHEN'; // -
const PERCENT = 'PERCENT'; // %
const PIPE = 'PIPE'; // |
const PLUS = 'PLUS'; // +
const POUND = 'POUND'; // #
const QUERY = 'QUERY'; // ?
const QUOTE = 'QUOTE'; // "
const FULLWIDTHMIDDLEDOT = 'FULLWIDTHMIDDLEDOT'; // ・

const SEMI = 'SEMI'; // ;
const SLASH = 'SLASH'; // /
const TILDE = 'TILDE'; // ~
const UNDERSCORE = 'UNDERSCORE'; // _

// Emoji symbol
const EMOJI$1 = 'EMOJI';

// Default token - anything that is not one of the above
const SYM = 'SYM';

var tk = /*#__PURE__*/Object.freeze({
	__proto__: null,
	ALPHANUMERICAL: ALPHANUMERICAL,
	AMPERSAND: AMPERSAND,
	APOSTROPHE: APOSTROPHE,
	ASCIINUMERICAL: ASCIINUMERICAL,
	ASTERISK: ASTERISK,
	AT: AT,
	BACKSLASH: BACKSLASH,
	BACKTICK: BACKTICK,
	CARET: CARET,
	CLOSEANGLEBRACKET: CLOSEANGLEBRACKET,
	CLOSEBRACE: CLOSEBRACE,
	CLOSEBRACKET: CLOSEBRACKET,
	CLOSEPAREN: CLOSEPAREN,
	COLON: COLON,
	COMMA: COMMA,
	DOLLAR: DOLLAR,
	DOT: DOT,
	EMOJI: EMOJI$1,
	EQUALS: EQUALS,
	EXCLAMATION: EXCLAMATION,
	FULLWIDTHGREATERTHAN: FULLWIDTHGREATERTHAN,
	FULLWIDTHLEFTPAREN: FULLWIDTHLEFTPAREN,
	FULLWIDTHLESSTHAN: FULLWIDTHLESSTHAN,
	FULLWIDTHMIDDLEDOT: FULLWIDTHMIDDLEDOT,
	FULLWIDTHRIGHTPAREN: FULLWIDTHRIGHTPAREN,
	HYPHEN: HYPHEN,
	LEFTCORNERBRACKET: LEFTCORNERBRACKET,
	LEFTWHITECORNERBRACKET: LEFTWHITECORNERBRACKET,
	LOCALHOST: LOCALHOST,
	NL: NL,
	NUM: NUM,
	OPENANGLEBRACKET: OPENANGLEBRACKET,
	OPENBRACE: OPENBRACE,
	OPENBRACKET: OPENBRACKET,
	OPENPAREN: OPENPAREN,
	PERCENT: PERCENT,
	PIPE: PIPE,
	PLUS: PLUS,
	POUND: POUND,
	QUERY: QUERY,
	QUOTE: QUOTE,
	RIGHTCORNERBRACKET: RIGHTCORNERBRACKET,
	RIGHTWHITECORNERBRACKET: RIGHTWHITECORNERBRACKET,
	SCHEME: SCHEME,
	SEMI: SEMI,
	SLASH: SLASH,
	SLASH_SCHEME: SLASH_SCHEME,
	SYM: SYM,
	TILDE: TILDE,
	TLD: TLD,
	UNDERSCORE: UNDERSCORE,
	UTLD: UTLD,
	UWORD: UWORD,
	WORD: WORD,
	WS: WS
});

// Note that these two Unicode ones expand into a really big one with Babel
const ASCII_LETTER = /[a-z]/;
const LETTER = /\p{L}/u; // Any Unicode character with letter data type
const EMOJI = /\p{Emoji}/u; // Any Unicode emoji character
const DIGIT = /\d/;
const SPACE = /\s/;

/**
	The scanner provides an interface that takes a string of text as input, and
	outputs an array of tokens instances that can be used for easy URL parsing.
*/

const CR = '\r'; // carriage-return character
const LF = '\n'; // line-feed character
const EMOJI_VARIATION = '\ufe0f'; // Variation selector, follows heart and others
const EMOJI_JOINER = '\u200d'; // zero-width joiner
const OBJECT_REPLACEMENT = '\ufffc'; // whitespace placeholder that sometimes appears in rich text editors

let tlds = null,
  utlds = null; // don't change so only have to be computed once

/**
 * Scanner output token:
 * - `t` is the token name (e.g., 'NUM', 'EMOJI', 'TLD')
 * - `v` is the value of the token (e.g., '123', '❤️', 'com')
 * - `s` is the start index of the token in the original string
 * - `e` is the end index of the token in the original string
 * @typedef {{t: string, v: string, s: number, e: number}} Token
 */

/**
 * @template T
 * @typedef {{ [collection: string]: T[] }} Collections
 */

/**
 * Initialize the scanner character-based state machine for the given start
 * state
 * @param {[string, boolean][]} customSchemes List of custom schemes, where each
 * item is a length-2 tuple with the first element set to the string scheme, and
 * the second element set to `true` if the `://` after the scheme is optional
 */
function init$2(customSchemes = []) {
  // Frequently used states (name argument removed during minification)
  /** @type Collections<string> */
  const groups = {}; // of tokens
  State.groups = groups;
  /** @type State<string> */
  const Start = new State();
  if (tlds == null) {
    tlds = decodeTlds(encodedTlds);
  }
  if (utlds == null) {
    utlds = decodeTlds(encodedUtlds);
  }

  // States for special URL symbols that accept immediately after start
  tt(Start, "'", APOSTROPHE);
  tt(Start, '{', OPENBRACE);
  tt(Start, '}', CLOSEBRACE);
  tt(Start, '[', OPENBRACKET);
  tt(Start, ']', CLOSEBRACKET);
  tt(Start, '(', OPENPAREN);
  tt(Start, ')', CLOSEPAREN);
  tt(Start, '<', OPENANGLEBRACKET);
  tt(Start, '>', CLOSEANGLEBRACKET);
  tt(Start, '（', FULLWIDTHLEFTPAREN);
  tt(Start, '）', FULLWIDTHRIGHTPAREN);
  tt(Start, '「', LEFTCORNERBRACKET);
  tt(Start, '」', RIGHTCORNERBRACKET);
  tt(Start, '『', LEFTWHITECORNERBRACKET);
  tt(Start, '』', RIGHTWHITECORNERBRACKET);
  tt(Start, '＜', FULLWIDTHLESSTHAN);
  tt(Start, '＞', FULLWIDTHGREATERTHAN);
  tt(Start, '&', AMPERSAND);
  tt(Start, '*', ASTERISK);
  tt(Start, '@', AT);
  tt(Start, '`', BACKTICK);
  tt(Start, '^', CARET);
  tt(Start, ':', COLON);
  tt(Start, ',', COMMA);
  tt(Start, '$', DOLLAR);
  tt(Start, '.', DOT);
  tt(Start, '=', EQUALS);
  tt(Start, '!', EXCLAMATION);
  tt(Start, '-', HYPHEN);
  tt(Start, '%', PERCENT);
  tt(Start, '|', PIPE);
  tt(Start, '+', PLUS);
  tt(Start, '#', POUND);
  tt(Start, '?', QUERY);
  tt(Start, '"', QUOTE);
  tt(Start, '/', SLASH);
  tt(Start, ';', SEMI);
  tt(Start, '~', TILDE);
  tt(Start, '_', UNDERSCORE);
  tt(Start, '\\', BACKSLASH);
  tt(Start, '・', FULLWIDTHMIDDLEDOT);
  const Num = tr(Start, DIGIT, NUM, {
    [numeric]: true
  });
  tr(Num, DIGIT, Num);
  const Asciinumeric = tr(Num, ASCII_LETTER, ASCIINUMERICAL, {
    [asciinumeric]: true
  });
  const Alphanumeric = tr(Num, LETTER, ALPHANUMERICAL, {
    [alphanumeric]: true
  });

  // State which emits a word token
  const Word = tr(Start, ASCII_LETTER, WORD, {
    [ascii]: true
  });
  tr(Word, DIGIT, Asciinumeric);
  tr(Word, ASCII_LETTER, Word);
  tr(Asciinumeric, DIGIT, Asciinumeric);
  tr(Asciinumeric, ASCII_LETTER, Asciinumeric);

  // Same as previous, but specific to non-fsm.ascii alphabet words
  const UWord = tr(Start, LETTER, UWORD, {
    [alpha]: true
  });
  tr(UWord, ASCII_LETTER); // Non-accepting
  tr(UWord, DIGIT, Alphanumeric);
  tr(UWord, LETTER, UWord);
  tr(Alphanumeric, DIGIT, Alphanumeric);
  tr(Alphanumeric, ASCII_LETTER); // Non-accepting
  tr(Alphanumeric, LETTER, Alphanumeric); // Non-accepting

  // Whitespace jumps
  // Tokens of only non-newline whitespace are arbitrarily long
  // If any whitespace except newline, more whitespace!
  const Nl = tt(Start, LF, NL, {
    [whitespace]: true
  });
  const Cr = tt(Start, CR, WS, {
    [whitespace]: true
  });
  const Ws = tr(Start, SPACE, WS, {
    [whitespace]: true
  });
  tt(Start, OBJECT_REPLACEMENT, Ws);
  tt(Cr, LF, Nl); // \r\n
  tt(Cr, OBJECT_REPLACEMENT, Ws);
  tr(Cr, SPACE, Ws);
  tt(Ws, CR); // non-accepting state to avoid mixing whitespaces
  tt(Ws, LF); // non-accepting state to avoid mixing whitespaces
  tr(Ws, SPACE, Ws);
  tt(Ws, OBJECT_REPLACEMENT, Ws);

  // Emoji tokens. They are not grouped by the scanner except in cases where a
  // zero-width joiner is present
  const Emoji = tr(Start, EMOJI, EMOJI$1, {
    [emoji]: true
  });
  tt(Emoji, '#'); // no transition, emoji regex seems to match #
  tr(Emoji, EMOJI, Emoji);
  tt(Emoji, EMOJI_VARIATION, Emoji);
  // tt(Start, EMOJI_VARIATION, Emoji); // This one is sketchy

  const EmojiJoiner = tt(Emoji, EMOJI_JOINER);
  tt(EmojiJoiner, '#');
  tr(EmojiJoiner, EMOJI, Emoji);
  // tt(EmojiJoiner, EMOJI_VARIATION, Emoji); // also sketchy

  // Generates states for top-level domains
  // Note that this is most accurate when tlds are in alphabetical order
  const wordjr = [[ASCII_LETTER, Word], [DIGIT, Asciinumeric]];
  const uwordjr = [[ASCII_LETTER, null], [LETTER, UWord], [DIGIT, Alphanumeric]];
  for (let i = 0; i < tlds.length; i++) {
    fastts(Start, tlds[i], TLD, WORD, wordjr);
  }
  for (let i = 0; i < utlds.length; i++) {
    fastts(Start, utlds[i], UTLD, UWORD, uwordjr);
  }
  addToGroups(TLD, {
    tld: true,
    ascii: true
  }, groups);
  addToGroups(UTLD, {
    utld: true,
    alpha: true
  }, groups);

  // Collect the states generated by different protocols. NOTE: If any new TLDs
  // get added that are also protocols, set the token to be the same as the
  // protocol to ensure parsing works as expected.
  fastts(Start, 'file', SCHEME, WORD, wordjr);
  fastts(Start, 'mailto', SCHEME, WORD, wordjr);
  fastts(Start, 'http', SLASH_SCHEME, WORD, wordjr);
  fastts(Start, 'https', SLASH_SCHEME, WORD, wordjr);
  fastts(Start, 'ftp', SLASH_SCHEME, WORD, wordjr);
  fastts(Start, 'ftps', SLASH_SCHEME, WORD, wordjr);
  addToGroups(SCHEME, {
    scheme: true,
    ascii: true
  }, groups);
  addToGroups(SLASH_SCHEME, {
    slashscheme: true,
    ascii: true
  }, groups);

  // Register custom schemes. Assumes each scheme is asciinumeric with hyphens
  customSchemes = customSchemes.sort((a, b) => a[0] > b[0] ? 1 : -1);
  for (let i = 0; i < customSchemes.length; i++) {
    const sch = customSchemes[i][0];
    const optionalSlashSlash = customSchemes[i][1];
    const flags = optionalSlashSlash ? {
      [scheme]: true
    } : {
      [slashscheme]: true
    };
    if (sch.indexOf('-') >= 0) {
      flags[domain] = true;
    } else if (!ASCII_LETTER.test(sch)) {
      flags[numeric] = true; // numbers only
    } else if (DIGIT.test(sch)) {
      flags[asciinumeric] = true;
    } else {
      flags[ascii] = true;
    }
    ts(Start, sch, sch, flags);
  }

  // Localhost token
  ts(Start, 'localhost', LOCALHOST, {
    ascii: true
  });

  // Set default transition for start state (some symbol)
  Start.jd = new State(SYM);
  return {
    start: Start,
    tokens: Object.assign({
      groups
    }, tk)
  };
}

/**
	Given a string, returns an array of TOKEN instances representing the
	composition of that string.

	@method run
	@param {State<string>} start scanner starting state
	@param {string} str input string to scan
	@return {Token[]} list of tokens, each with a type and value
*/
function run$1(start, str) {
  // State machine is not case sensitive, so input is tokenized in lowercased
  // form (still returns regular case). Uses selective `toLowerCase` because
  // lowercasing the entire string causes the length and character position to
  // vary in some non-English strings with V8-based runtimes.
  const iterable = stringToArray(str.replace(/[A-Z]/g, c => c.toLowerCase()));
  const charCount = iterable.length; // <= len if there are emojis, etc
  const tokens = []; // return value

  // cursor through the string itself, accounting for characters that have
  // width with length 2 such as emojis
  let cursor = 0;

  // Cursor through the array-representation of the string
  let charCursor = 0;

  // Tokenize the string
  while (charCursor < charCount) {
    let state = start;
    let nextState = null;
    let tokenLength = 0;
    let latestAccepting = null;
    let sinceAccepts = -1;
    let charsSinceAccepts = -1;
    while (charCursor < charCount && (nextState = state.go(iterable[charCursor]))) {
      state = nextState;

      // Keep track of the latest accepting state
      if (state.accepts()) {
        sinceAccepts = 0;
        charsSinceAccepts = 0;
        latestAccepting = state;
      } else if (sinceAccepts >= 0) {
        sinceAccepts += iterable[charCursor].length;
        charsSinceAccepts++;
      }
      tokenLength += iterable[charCursor].length;
      cursor += iterable[charCursor].length;
      charCursor++;
    }

    // Roll back to the latest accepting state
    cursor -= sinceAccepts;
    charCursor -= charsSinceAccepts;
    tokenLength -= sinceAccepts;

    // No more jumps, just make a new token from the last accepting one
    tokens.push({
      t: latestAccepting.t,
      // token type/name
      v: str.slice(cursor - tokenLength, cursor),
      // string value
      s: cursor - tokenLength,
      // start index
      e: cursor // end index (excluding)
    });
  }
  return tokens;
}

/**
 * Convert a String to an Array of characters, taking into account that some
 * characters like emojis take up two string indexes.
 *
 * Adapted from core-js (MIT license)
 * https://github.com/zloirock/core-js/blob/2d69cf5f99ab3ea3463c395df81e5a15b68f49d9/packages/core-js/internals/string-multibyte.js
 *
 * @function stringToArray
 * @param {string} str
 * @returns {string[]}
 */
function stringToArray(str) {
  const result = [];
  const len = str.length;
  let index = 0;
  while (index < len) {
    let first = str.charCodeAt(index);
    let second;
    let char = first < 0xd800 || first > 0xdbff || index + 1 === len || (second = str.charCodeAt(index + 1)) < 0xdc00 || second > 0xdfff ? str[index] // single character
    : str.slice(index, index + 2); // two-index characters
    result.push(char);
    index += char.length;
  }
  return result;
}

/**
 * Fast version of ts function for when transition defaults are well known
 * @param {State<string>} state
 * @param {string} input
 * @param {string} t
 * @param {string} defaultt
 * @param {[RegExp, State<string>][]} jr
 * @returns {State<string>}
 */
function fastts(state, input, t, defaultt, jr) {
  let next;
  const len = input.length;
  for (let i = 0; i < len - 1; i++) {
    const char = input[i];
    if (state.j[char]) {
      next = state.j[char];
    } else {
      next = new State(defaultt);
      next.jr = jr.slice();
      state.j[char] = next;
    }
    state = next;
  }
  next = new State(t);
  next.jr = jr.slice();
  state.j[input[len - 1]] = next;
  return next;
}

/**
 * Converts a string of Top-Level Domain names encoded in update-tlds.js back
 * into a list of strings.
 * @param {str} encoded encoded TLDs string
 * @returns {str[]} original TLDs list
 */
function decodeTlds(encoded) {
  const words = [];
  const stack = [];
  let i = 0;
  let digits = '0123456789';
  while (i < encoded.length) {
    let popDigitCount = 0;
    while (digits.indexOf(encoded[i + popDigitCount]) >= 0) {
      popDigitCount++; // encountered some digits, have to pop to go one level up trie
    }
    if (popDigitCount > 0) {
      words.push(stack.join('')); // whatever preceded the pop digits must be a word
      for (let popCount = parseInt(encoded.substring(i, i + popDigitCount), 10); popCount > 0; popCount--) {
        stack.pop();
      }
      i += popDigitCount;
    } else {
      stack.push(encoded[i]); // drop down a level into the trie
      i++;
    }
  }
  return words;
}

/**
 * An object where each key is a valid DOM Event Name such as `click` or `focus`
 * and each value is an event handler function.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Element#events
 * @typedef {?{ [event: string]: Function }} EventListeners
 */

/**
 * All formatted properties required to render a link, including `tagName`,
 * `attributes`, `content` and `eventListeners`.
 * @typedef {{ tagName: any, attributes: {[attr: string]: any}, content: string,
 * eventListeners: EventListeners }} IntermediateRepresentation
 */

/**
 * Specify either an object described by the template type `O` or a function.
 *
 * The function takes a string value (usually the link's href attribute), the
 * link type (`'url'`, `'hashtag`', etc.) and an internal token representation
 * of the link. It should return an object of the template type `O`
 * @template O
 * @typedef {O | ((value: string, type: string, token: MultiToken) => O)} OptObj
 */

/**
 * Specify either a function described by template type `F` or an object.
 *
 * Each key in the object should be a link type (`'url'`, `'hashtag`', etc.). Each
 * value should be a function with template type `F` that is called when the
 * corresponding link type is encountered.
 * @template F
 * @typedef {F | { [type: string]: F}} OptFn
 */

/**
 * Specify either a value with template type `V`, a function that returns `V` or
 * an object where each value resolves to `V`.
 *
 * The function takes a string value (usually the link's href attribute), the
 * link type (`'url'`, `'hashtag`', etc.) and an internal token representation
 * of the link. It should return an object of the template type `V`
 *
 * For the object, each key should be a link type (`'url'`, `'hashtag`', etc.).
 * Each value should either have type `V` or a function that returns V. This
 * function similarly takes a string value and a token.
 *
 * Example valid types for `Opt<string>`:
 *
 * ```js
 * 'hello'
 * (value, type, token) => 'world'
 * { url: 'hello', email: (value, token) => 'world'}
 * ```
 * @template V
 * @typedef {V | ((value: string, type: string, token: MultiToken) => V) | { [type: string]: V | ((value: string, token: MultiToken) => V) }} Opt
 */

/**
 * See available options: https://linkify.js.org/docs/options.html
 * @typedef {{
 * 	defaultProtocol?: string,
 *  events?: OptObj<EventListeners>,
 * 	format?: Opt<string>,
 * 	formatHref?: Opt<string>,
 * 	nl2br?: boolean,
 * 	tagName?: Opt<any>,
 * 	target?: Opt<string>,
 * 	rel?: Opt<string>,
 * 	validate?: Opt<boolean>,
 * 	truncate?: Opt<number>,
 * 	className?: Opt<string>,
 * 	attributes?: OptObj<({ [attr: string]: any })>,
 *  ignoreTags?: string[],
 * 	render?: OptFn<((ir: IntermediateRepresentation) => any)>
 * }} Opts
 */

/**
 * @type Required<Opts>
 */
const defaults = {
  defaultProtocol: 'http',
  events: null,
  format: noop,
  formatHref: noop,
  nl2br: false,
  tagName: 'a',
  target: null,
  rel: null,
  validate: true,
  truncate: Infinity,
  className: null,
  attributes: null,
  ignoreTags: [],
  render: null
};

/**
 * Utility class for linkify interfaces to apply specified
 * {@link Opts formatting and rendering options}.
 *
 * @param {Opts | Options} [opts] Option value overrides.
 * @param {(ir: IntermediateRepresentation) => any} [defaultRender] (For
 *   internal use) default render function that determines how to generate an
 *   HTML element based on a link token's derived tagName, attributes and HTML.
 *   Similar to render option
 */
function Options(opts, defaultRender = null) {
  let o = Object.assign({}, defaults);
  if (opts) {
    o = Object.assign(o, opts instanceof Options ? opts.o : opts);
  }

  // Ensure all ignored tags are uppercase
  const ignoredTags = o.ignoreTags;
  const uppercaseIgnoredTags = [];
  for (let i = 0; i < ignoredTags.length; i++) {
    uppercaseIgnoredTags.push(ignoredTags[i].toUpperCase());
  }
  /** @protected */
  this.o = o;
  if (defaultRender) {
    this.defaultRender = defaultRender;
  }
  this.ignoreTags = uppercaseIgnoredTags;
}
Options.prototype = {
  o: defaults,
  /**
   * @type string[]
   */
  ignoreTags: [],
  /**
   * @param {IntermediateRepresentation} ir
   * @returns {any}
   */
  defaultRender(ir) {
    return ir;
  },
  /**
   * Returns true or false based on whether a token should be displayed as a
   * link based on the user options.
   * @param {MultiToken} token
   * @returns {boolean}
   */
  check(token) {
    return this.get('validate', token.toString(), token);
  },
  // Private methods

  /**
   * Resolve an option's value based on the value of the option and the given
   * params. If operator and token are specified and the target option is
   * callable, automatically calls the function with the given argument.
   * @template {keyof Opts} K
   * @param {K} key Name of option to use
   * @param {string} [operator] will be passed to the target option if it's a
   * function. If not specified, RAW function value gets returned
   * @param {MultiToken} [token] The token from linkify.tokenize
   * @returns {Opts[K] | any}
   */
  get(key, operator, token) {
    const isCallable = operator != null;
    let option = this.o[key];
    if (!option) {
      return option;
    }
    if (typeof option === 'object') {
      option = token.t in option ? option[token.t] : defaults[key];
      if (typeof option === 'function' && isCallable) {
        option = option(operator, token);
      }
    } else if (typeof option === 'function' && isCallable) {
      option = option(operator, token.t, token);
    }
    return option;
  },
  /**
   * @template {keyof Opts} L
   * @param {L} key Name of options object to use
   * @param {string} [operator]
   * @param {MultiToken} [token]
   * @returns {Opts[L] | any}
   */
  getObj(key, operator, token) {
    let obj = this.o[key];
    if (typeof obj === 'function' && operator != null) {
      obj = obj(operator, token.t, token);
    }
    return obj;
  },
  /**
   * Convert the given token to a rendered element that may be added to the
   * calling-interface's DOM
   * @param {MultiToken} token Token to render to an HTML element
   * @returns {any} Render result; e.g., HTML string, DOM element, React
   *   Component, etc.
   */
  render(token) {
    const ir = token.render(this); // intermediate representation
    const renderFn = this.get('render', null, token) || this.defaultRender;
    return renderFn(ir, token.t, token);
  }
};
function noop(val) {
  return val;
}

/******************************************************************************
	Multi-Tokens
	Tokens composed of arrays of TextTokens
******************************************************************************/

/**
 * @param {string} value
 * @param {Token[]} tokens
 */
function MultiToken(value, tokens) {
  this.t = 'token';
  this.v = value;
  this.tk = tokens;
}

/**
 * Abstract class used for manufacturing tokens of text tokens. That is rather
 * than the value for a token being a small string of text, it's value an array
 * of text tokens.
 *
 * Used for grouping together URLs, emails, hashtags, and other potential
 * creations.
 * @class MultiToken
 * @property {string} t
 * @property {string} v
 * @property {Token[]} tk
 * @abstract
 */
MultiToken.prototype = {
  isLink: false,
  /**
   * Return the string this token represents.
   * @return {string}
   */
  toString() {
    return this.v;
  },
  /**
   * What should the value for this token be in the `href` HTML attribute?
   * Returns the `.toString` value by default.
   * @param {string} [scheme]
   * @return {string}
   */
  toHref(scheme) {
    return this.toString();
  },
  /**
   * @param {Options} options Formatting options
   * @returns {string}
   */
  toFormattedString(options) {
    const val = this.toString();
    const truncate = options.get('truncate', val, this);
    const formatted = options.get('format', val, this);
    return truncate && formatted.length > truncate ? formatted.substring(0, truncate) + '…' : formatted;
  },
  /**
   *
   * @param {Options} options
   * @returns {string}
   */
  toFormattedHref(options) {
    return options.get('formatHref', this.toHref(options.get('defaultProtocol')), this);
  },
  /**
   * The start index of this token in the original input string
   * @returns {number}
   */
  startIndex() {
    return this.tk[0].s;
  },
  /**
   * The end index of this token in the original input string (up to this
   * index but not including it)
   * @returns {number}
   */
  endIndex() {
    return this.tk[this.tk.length - 1].e;
  },
  /**
  	Returns an object  of relevant values for this token, which includes keys
  	* type - Kind of token ('url', 'email', etc.)
  	* value - Original text
  	* href - The value that should be added to the anchor tag's href
  		attribute
  		@method toObject
  	@param {string} [protocol] `'http'` by default
  */
  toObject(protocol = defaults.defaultProtocol) {
    return {
      type: this.t,
      value: this.toString(),
      isLink: this.isLink,
      href: this.toHref(protocol),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   *
   * @param {Options} options Formatting option
   */
  toFormattedObject(options) {
    return {
      type: this.t,
      value: this.toFormattedString(options),
      isLink: this.isLink,
      href: this.toFormattedHref(options),
      start: this.startIndex(),
      end: this.endIndex()
    };
  },
  /**
   * Whether this token should be rendered as a link according to the given options
   * @param {Options} options
   * @returns {boolean}
   */
  validate(options) {
    return options.get('validate', this.toString(), this);
  },
  /**
   * Return an object that represents how this link should be rendered.
   * @param {Options} options Formattinng options
   */
  render(options) {
    const token = this;
    const href = this.toHref(options.get('defaultProtocol'));
    const formattedHref = options.get('formatHref', href, this);
    const tagName = options.get('tagName', href, token);
    const content = this.toFormattedString(options);
    const attributes = {};
    const className = options.get('className', href, token);
    const target = options.get('target', href, token);
    const rel = options.get('rel', href, token);
    const attrs = options.getObj('attributes', href, token);
    const eventListeners = options.getObj('events', href, token);
    attributes.href = formattedHref;
    if (className) {
      attributes.class = className;
    }
    if (target) {
      attributes.target = target;
    }
    if (rel) {
      attributes.rel = rel;
    }
    if (attrs) {
      Object.assign(attributes, attrs);
    }
    return {
      tagName,
      attributes,
      content,
      eventListeners
    };
  }
};

/**
 * Create a new token that can be emitted by the parser state machine
 * @param {string} type readable type of the token
 * @param {object} props properties to assign or override, including isLink = true or false
 * @returns {new (value: string, tokens: Token[]) => MultiToken} new token class
 */
function createTokenClass(type, props) {
  class Token extends MultiToken {
    constructor(value, tokens) {
      super(value, tokens);
      this.t = type;
    }
  }
  for (const p in props) {
    Token.prototype[p] = props[p];
  }
  Token.t = type;
  return Token;
}

/**
	Represents a list of tokens making up a valid email address
*/
const Email = createTokenClass('email', {
  isLink: true,
  toHref() {
    return 'mailto:' + this.toString();
  }
});

/**
	Represents some plain text
*/
const Text = createTokenClass('text');

/**
	Multi-linebreak token - represents a line break
	@class Nl
*/
const Nl = createTokenClass('nl');

/**
	Represents a list of text tokens making up a valid URL
	@class Url
*/
const Url = createTokenClass('url', {
  isLink: true,
  /**
  	Lowercases relevant parts of the domain and adds the protocol if
  	required. Note that this will not escape unsafe HTML characters in the
  	URL.
  		@param {string} [scheme] default scheme (e.g., 'https')
  	@return {string} the full href
  */
  toHref(scheme = defaults.defaultProtocol) {
    // Check if already has a prefix scheme
    return this.hasProtocol() ? this.v : `${scheme}://${this.v}`;
  },
  /**
   * Check whether this URL token has a protocol
   * @return {boolean}
   */
  hasProtocol() {
    const tokens = this.tk;
    return tokens.length >= 2 && tokens[0].t !== LOCALHOST && tokens[1].t === COLON;
  }
});

/**
	Not exactly parser, more like the second-stage scanner (although we can
	theoretically hotswap the code here with a real parser in the future... but
	for a little URL-finding utility abstract syntax trees may be a little
	overkill).

	URL format: http://en.wikipedia.org/wiki/URI_scheme
	Email format: http://en.wikipedia.org/wiki/EmailAddress (links to RFC in
	reference)

	@module linkify
	@submodule parser
	@main run
*/

const makeState = arg => new State(arg);

/**
 * Generate the parser multi token-based state machine
 * @param {{ groups: Collections<string> }} tokens
 */
function init$1({
  groups
}) {
  // Types of characters the URL can definitely end in
  const qsAccepting = groups.domain.concat([AMPERSAND, ASTERISK, AT, BACKSLASH, BACKTICK, CARET, DOLLAR, EQUALS, HYPHEN, NUM, PERCENT, PIPE, PLUS, POUND, SLASH, SYM, TILDE, UNDERSCORE]);

  // Types of tokens that can follow a URL and be part of the query string
  // but cannot be the very last characters
  // Characters that cannot appear in the URL at all should be excluded
  const qsNonAccepting = [APOSTROPHE, COLON, COMMA, DOT, EXCLAMATION, PERCENT, QUERY, QUOTE, SEMI, OPENANGLEBRACKET, CLOSEANGLEBRACKET, OPENBRACE, CLOSEBRACE, CLOSEBRACKET, OPENBRACKET, OPENPAREN, CLOSEPAREN, FULLWIDTHLEFTPAREN, FULLWIDTHRIGHTPAREN, LEFTCORNERBRACKET, RIGHTCORNERBRACKET, LEFTWHITECORNERBRACKET, RIGHTWHITECORNERBRACKET, FULLWIDTHLESSTHAN, FULLWIDTHGREATERTHAN];

  // For addresses without the mailto prefix
  // Tokens allowed in the localpart of the email
  const localpartAccepting = [AMPERSAND, APOSTROPHE, ASTERISK, BACKSLASH, BACKTICK, CARET, DOLLAR, EQUALS, HYPHEN, OPENBRACE, CLOSEBRACE, PERCENT, PIPE, PLUS, POUND, QUERY, SLASH, SYM, TILDE, UNDERSCORE];

  // The universal starting state.
  /**
   * @type State<Token>
   */
  const Start = makeState();
  const Localpart = tt(Start, TILDE); // Local part of the email address
  ta(Localpart, localpartAccepting, Localpart);
  ta(Localpart, groups.domain, Localpart);
  const Domain = makeState(),
    Scheme = makeState(),
    SlashScheme = makeState();
  ta(Start, groups.domain, Domain); // parsed string ends with a potential domain name (A)
  ta(Start, groups.scheme, Scheme); // e.g., 'mailto'
  ta(Start, groups.slashscheme, SlashScheme); // e.g., 'http'

  ta(Domain, localpartAccepting, Localpart);
  ta(Domain, groups.domain, Domain);
  const LocalpartAt = tt(Domain, AT); // Local part of the email address plus @

  tt(Localpart, AT, LocalpartAt); // close to an email address now

  // Local part of an email address can be e.g. 'http' or 'mailto'
  tt(Scheme, AT, LocalpartAt);
  tt(SlashScheme, AT, LocalpartAt);
  const LocalpartDot = tt(Localpart, DOT); // Local part of the email address plus '.' (localpart cannot end in .)
  ta(LocalpartDot, localpartAccepting, Localpart);
  ta(LocalpartDot, groups.domain, Localpart);
  const EmailDomain = makeState();
  ta(LocalpartAt, groups.domain, EmailDomain); // parsed string starts with local email info + @ with a potential domain name
  ta(EmailDomain, groups.domain, EmailDomain);
  const EmailDomainDot = tt(EmailDomain, DOT); // domain followed by DOT
  ta(EmailDomainDot, groups.domain, EmailDomain);
  const Email$1 = makeState(Email); // Possible email address (could have more tlds)
  ta(EmailDomainDot, groups.tld, Email$1);
  ta(EmailDomainDot, groups.utld, Email$1);
  tt(LocalpartAt, LOCALHOST, Email$1);

  // Hyphen can jump back to a domain name
  const EmailDomainHyphen = tt(EmailDomain, HYPHEN); // parsed string starts with local email info + @ with a potential domain name
  tt(EmailDomainHyphen, HYPHEN, EmailDomainHyphen);
  ta(EmailDomainHyphen, groups.domain, EmailDomain);
  ta(Email$1, groups.domain, EmailDomain);
  tt(Email$1, DOT, EmailDomainDot);
  tt(Email$1, HYPHEN, EmailDomainHyphen);

  // Final possible email states
  const EmailColon = tt(Email$1, COLON); // URL followed by colon (potential port number here)
  /*const EmailColonPort = */
  ta(EmailColon, groups.numeric, Email); // URL followed by colon and port number

  // Account for dots and hyphens. Hyphens are usually parts of domain names
  // (but not TLDs)
  const DomainHyphen = tt(Domain, HYPHEN); // domain followed by hyphen
  const DomainDot = tt(Domain, DOT); // domain followed by DOT
  tt(DomainHyphen, HYPHEN, DomainHyphen);
  ta(DomainHyphen, groups.domain, Domain);
  ta(DomainDot, localpartAccepting, Localpart);
  ta(DomainDot, groups.domain, Domain);
  const DomainDotTld = makeState(Url); // Simplest possible URL with no query string
  ta(DomainDot, groups.tld, DomainDotTld);
  ta(DomainDot, groups.utld, DomainDotTld);
  ta(DomainDotTld, groups.domain, Domain);
  ta(DomainDotTld, localpartAccepting, Localpart);
  tt(DomainDotTld, DOT, DomainDot);
  tt(DomainDotTld, HYPHEN, DomainHyphen);
  tt(DomainDotTld, AT, LocalpartAt);
  const DomainDotTldColon = tt(DomainDotTld, COLON); // URL followed by colon (potential port number here)
  const DomainDotTldColonPort = makeState(Url); // TLD followed by a port number
  ta(DomainDotTldColon, groups.numeric, DomainDotTldColonPort);

  // Long URL with optional port and maybe query string
  const Url$1 = makeState(Url);

  // URL with extra symbols at the end, followed by an opening bracket
  const UrlNonaccept = makeState(); // URL followed by some symbols (will not be part of the final URL)

  // Query strings
  ta(Url$1, qsAccepting, Url$1);
  ta(Url$1, qsNonAccepting, UrlNonaccept);
  ta(UrlNonaccept, qsAccepting, Url$1);
  ta(UrlNonaccept, qsNonAccepting, UrlNonaccept);

  // Become real URLs after `SLASH` or `COLON NUM SLASH`
  // Here works with or without scheme:// prefix
  tt(DomainDotTld, SLASH, Url$1);
  tt(DomainDotTldColonPort, SLASH, Url$1);

  // Note that domains that begin with schemes are treated slighly differently
  const SchemeColon = tt(Scheme, COLON); // e.g., 'mailto:'
  const SlashSchemeColon = tt(SlashScheme, COLON); // e.g., 'http:'
  const SlashSchemeColonSlash = tt(SlashSchemeColon, SLASH); // e.g., 'http:/'

  const UriPrefix = tt(SlashSchemeColonSlash, SLASH); // e.g., 'http://'

  // Scheme states can transition to domain states
  ta(Scheme, groups.domain, Domain);
  tt(Scheme, DOT, DomainDot);
  tt(Scheme, HYPHEN, DomainHyphen);
  ta(SlashScheme, groups.domain, Domain);
  tt(SlashScheme, DOT, DomainDot);
  tt(SlashScheme, HYPHEN, DomainHyphen);

  // Force URL with scheme prefix followed by anything sane
  ta(SchemeColon, groups.domain, Url$1);
  tt(SchemeColon, SLASH, Url$1);
  tt(SchemeColon, QUERY, Url$1);
  ta(UriPrefix, groups.domain, Url$1);
  ta(UriPrefix, qsAccepting, Url$1);
  tt(UriPrefix, SLASH, Url$1);
  const bracketPairs = [[OPENBRACE, CLOSEBRACE],
  // {}
  [OPENBRACKET, CLOSEBRACKET],
  // []
  [OPENPAREN, CLOSEPAREN],
  // ()
  [OPENANGLEBRACKET, CLOSEANGLEBRACKET],
  // <>
  [FULLWIDTHLEFTPAREN, FULLWIDTHRIGHTPAREN],
  // （）
  [LEFTCORNERBRACKET, RIGHTCORNERBRACKET],
  // 「」
  [LEFTWHITECORNERBRACKET, RIGHTWHITECORNERBRACKET],
  // 『』
  [FULLWIDTHLESSTHAN, FULLWIDTHGREATERTHAN] // ＜＞
  ];
  for (let i = 0; i < bracketPairs.length; i++) {
    const [OPEN, CLOSE] = bracketPairs[i];
    const UrlOpen = tt(Url$1, OPEN); // URL followed by open bracket

    // Continue not accepting for open brackets
    tt(UrlNonaccept, OPEN, UrlOpen);

    // Closing bracket component. This character WILL be included in the URL
    tt(UrlOpen, CLOSE, Url$1);

    // URL that beings with an opening bracket, followed by a symbols.
    // Note that the final state can still be `UrlOpen` (if the URL has a
    // single opening bracket for some reason).
    const UrlOpenQ = makeState(Url);
    ta(UrlOpen, qsAccepting, UrlOpenQ);
    const UrlOpenSyms = makeState(); // UrlOpen followed by some symbols it cannot end it
    ta(UrlOpen, qsNonAccepting);

    // URL that begins with an opening bracket, followed by some symbols
    ta(UrlOpenQ, qsAccepting, UrlOpenQ);
    ta(UrlOpenQ, qsNonAccepting, UrlOpenSyms);
    ta(UrlOpenSyms, qsAccepting, UrlOpenQ);
    ta(UrlOpenSyms, qsNonAccepting, UrlOpenSyms);

    // Close brace/bracket to become regular URL
    tt(UrlOpenQ, CLOSE, Url$1);
    tt(UrlOpenSyms, CLOSE, Url$1);
  }
  tt(Start, LOCALHOST, DomainDotTld); // localhost is a valid URL state
  tt(Start, NL, Nl); // single new line

  return {
    start: Start,
    tokens: tk
  };
}

/**
 * Run the parser state machine on a list of scanned string-based tokens to
 * create a list of multi tokens, each of which represents a URL, email address,
 * plain text, etc.
 *
 * @param {State<MultiToken>} start parser start state
 * @param {string} input the original input used to generate the given tokens
 * @param {Token[]} tokens list of scanned tokens
 * @returns {MultiToken[]}
 */
function run(start, input, tokens) {
  let len = tokens.length;
  let cursor = 0;
  let multis = [];
  let textTokens = [];
  while (cursor < len) {
    let state = start;
    let secondState = null;
    let nextState = null;
    let multiLength = 0;
    let latestAccepting = null;
    let sinceAccepts = -1;
    while (cursor < len && !(secondState = state.go(tokens[cursor].t))) {
      // Starting tokens with nowhere to jump to.
      // Consider these to be just plain text
      textTokens.push(tokens[cursor++]);
    }
    while (cursor < len && (nextState = secondState || state.go(tokens[cursor].t))) {
      // Get the next state
      secondState = null;
      state = nextState;

      // Keep track of the latest accepting state
      if (state.accepts()) {
        sinceAccepts = 0;
        latestAccepting = state;
      } else if (sinceAccepts >= 0) {
        sinceAccepts++;
      }
      cursor++;
      multiLength++;
    }
    if (sinceAccepts < 0) {
      // No accepting state was found, part of a regular text token add
      // the first text token to the text tokens array and try again from
      // the next
      cursor -= multiLength;
      if (cursor < len) {
        textTokens.push(tokens[cursor]);
        cursor++;
      }
    } else {
      // Accepting state!
      // First close off the textTokens (if available)
      if (textTokens.length > 0) {
        multis.push(initMultiToken(Text, input, textTokens));
        textTokens = [];
      }

      // Roll back to the latest accepting state
      cursor -= sinceAccepts;
      multiLength -= sinceAccepts;

      // Create a new multitoken
      const Multi = latestAccepting.t;
      const subtokens = tokens.slice(cursor - multiLength, cursor);
      multis.push(initMultiToken(Multi, input, subtokens));
    }
  }

  // Finally close off the textTokens (if available)
  if (textTokens.length > 0) {
    multis.push(initMultiToken(Text, input, textTokens));
  }
  return multis;
}

/**
 * Utility function for instantiating a new multitoken with all the relevant
 * fields during parsing.
 * @param {new (value: string, tokens: Token[]) => MultiToken} Multi class to instantiate
 * @param {string} input original input string
 * @param {Token[]} tokens consecutive tokens scanned from input string
 * @returns {MultiToken}
 */
function initMultiToken(Multi, input, tokens) {
  const startIdx = tokens[0].s;
  const endIdx = tokens[tokens.length - 1].e;
  const value = input.slice(startIdx, endIdx);
  return new Multi(value, tokens);
}

const warn = typeof console !== 'undefined' && console && console.warn || (() => {});
const warnAdvice = 'until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.';

// Side-effect initialization state
const INIT = {
  scanner: null,
  parser: null,
  tokenQueue: [],
  pluginQueue: [],
  customSchemes: [],
  initialized: false
};

/**
 * @typedef {{
 * 	start: State<string>,
 * 	tokens: { groups: Collections<string> } & typeof tk
 * }} ScannerInit
 */

/**
 * @typedef {{
 * 	start: State<MultiToken>,
 * 	tokens: typeof multi
 * }} ParserInit
 */

/**
 * @typedef {(arg: { scanner: ScannerInit }) => void} TokenPlugin
 */

/**
 * @typedef {(arg: { scanner: ScannerInit, parser: ParserInit }) => void} Plugin
 */

/**
 * De-register all plugins and reset the internal state-machine. Used for
 * testing; not required in practice.
 * @private
 */
function reset() {
  State.groups = {};
  INIT.scanner = null;
  INIT.parser = null;
  INIT.tokenQueue = [];
  INIT.pluginQueue = [];
  INIT.customSchemes = [];
  INIT.initialized = false;
  return INIT;
}

/**
 * Detect URLs with the following additional protocol. Anything with format
 * "protocol://..." will be considered a link. If `optionalSlashSlash` is set to
 * `true`, anything with format "protocol:..." will be considered a link.
 * @param {string} scheme
 * @param {boolean} [optionalSlashSlash]
 */
function registerCustomProtocol(scheme, optionalSlashSlash = false) {
  if (INIT.initialized) {
    warn(`linkifyjs: already initialized - will not register custom scheme "${scheme}" ${warnAdvice}`);
  }
  if (!/^[0-9a-z]+(-[0-9a-z]+)*$/.test(scheme)) {
    throw new Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);
  }
  INIT.customSchemes.push([scheme, optionalSlashSlash]);
}

/**
 * Initialize the linkify state machine. Called automatically the first time
 * linkify is called on a string, but may be called manually as well.
 */
function init() {
  // Initialize scanner state machine and plugins
  INIT.scanner = init$2(INIT.customSchemes);
  for (let i = 0; i < INIT.tokenQueue.length; i++) {
    INIT.tokenQueue[i][1]({
      scanner: INIT.scanner
    });
  }

  // Initialize parser state machine and plugins
  INIT.parser = init$1(INIT.scanner.tokens);
  for (let i = 0; i < INIT.pluginQueue.length; i++) {
    INIT.pluginQueue[i][1]({
      scanner: INIT.scanner,
      parser: INIT.parser
    });
  }
  INIT.initialized = true;
  return INIT;
}

/**
 * Parse a string into tokens that represent linkable and non-linkable sub-components
 * @param {string} str
 * @return {MultiToken[]} tokens
 */
function tokenize(str) {
  if (!INIT.initialized) {
    init();
  }
  return run(INIT.parser.start, str, run$1(INIT.scanner.start, str));
}
tokenize.scan = run$1; // for testing

/**
 * Find a list of linkable items in the given string.
 * @param {string} str string to find links in
 * @param {string | Opts} [type] either formatting options or specific type of
 * links to find, e.g., 'url' or 'email'
 * @param {Opts} [opts] formatting options for final output. Cannot be specified
 * if opts already provided in `type` argument
 */
function find(str, type = null, opts = null) {
  if (type && typeof type === 'object') {
    if (opts) {
      throw Error(`linkifyjs: Invalid link type ${type}; must be a string`);
    }
    opts = type;
    type = null;
  }
  const options = new Options(opts);
  const tokens = tokenize(str);
  const filtered = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.isLink && (!type || token.t === type) && options.check(token)) {
      filtered.push(token.toFormattedObject(options));
    }
  }
  return filtered;
}

// src/link.ts

// src/helpers/whitespace.ts
var UNICODE_WHITESPACE_PATTERN = "[\0- \xA0\u1680\u180E\u2000-\u2029\u205F\u3000]";
var UNICODE_WHITESPACE_REGEX = new RegExp(UNICODE_WHITESPACE_PATTERN);
var UNICODE_WHITESPACE_REGEX_END = new RegExp(`${UNICODE_WHITESPACE_PATTERN}$`);
var UNICODE_WHITESPACE_REGEX_GLOBAL = new RegExp(UNICODE_WHITESPACE_PATTERN, "g");

// src/helpers/autolink.ts
function isValidLinkStructure(tokens) {
  if (tokens.length === 1) {
    return tokens[0].isLink;
  }
  if (tokens.length === 3 && tokens[1].isLink) {
    return ["()", "[]"].includes(tokens[0].value + tokens[2].value);
  }
  return false;
}
function autolink(options) {
  return new Plugin({
    key: new PluginKey("autolink"),
    appendTransaction: (transactions, oldState, newState) => {
      const docChanges = transactions.some((transaction) => transaction.docChanged) && !oldState.doc.eq(newState.doc);
      const preventAutolink = transactions.some((transaction) => transaction.getMeta("preventAutolink"));
      if (!docChanges || preventAutolink) {
        return;
      }
      const { tr } = newState;
      const transform = combineTransactionSteps(oldState.doc, [...transactions]);
      const changes = getChangedRanges(transform);
      changes.forEach(({ newRange }) => {
        const nodesInChangedRanges = findChildrenInRange(newState.doc, newRange, (node) => node.isTextblock);
        let textBlock;
        let textBeforeWhitespace;
        if (nodesInChangedRanges.length > 1) {
          textBlock = nodesInChangedRanges[0];
          textBeforeWhitespace = newState.doc.textBetween(
            textBlock.pos,
            textBlock.pos + textBlock.node.nodeSize,
            void 0,
            " "
          );
        } else if (nodesInChangedRanges.length) {
          const endText = newState.doc.textBetween(newRange.from, newRange.to, " ", " ");
          if (!UNICODE_WHITESPACE_REGEX_END.test(endText)) {
            return;
          }
          textBlock = nodesInChangedRanges[0];
          textBeforeWhitespace = newState.doc.textBetween(textBlock.pos, newRange.to, void 0, " ");
        }
        if (textBlock && textBeforeWhitespace) {
          const wordsBeforeWhitespace = textBeforeWhitespace.split(UNICODE_WHITESPACE_REGEX).filter(Boolean);
          if (wordsBeforeWhitespace.length <= 0) {
            return false;
          }
          const lastWordBeforeSpace = wordsBeforeWhitespace[wordsBeforeWhitespace.length - 1];
          const lastWordAndBlockOffset = textBlock.pos + textBeforeWhitespace.lastIndexOf(lastWordBeforeSpace);
          if (!lastWordBeforeSpace) {
            return false;
          }
          const linksBeforeSpace = tokenize(lastWordBeforeSpace).map((t) => t.toObject(options.defaultProtocol));
          if (!isValidLinkStructure(linksBeforeSpace)) {
            return false;
          }
          linksBeforeSpace.filter((link) => link.isLink).map((link) => ({
            ...link,
            from: lastWordAndBlockOffset + link.start + 1,
            to: lastWordAndBlockOffset + link.end + 1
          })).filter((link) => {
            if (!newState.schema.marks.code) {
              return true;
            }
            return !newState.doc.rangeHasMark(link.from, link.to, newState.schema.marks.code);
          }).filter((link) => options.validate(link.value)).filter((link) => options.shouldAutoLink(link.value)).forEach((link) => {
            if (getMarksBetween(link.from, link.to, newState.doc).some((item) => item.mark.type === options.type)) {
              return;
            }
            tr.addMark(
              link.from,
              link.to,
              options.type.create({
                href: link.href
              })
            );
          });
        }
      });
      if (!tr.steps.length) {
        return;
      }
      return tr;
    }
  });
}
function clickHandler(options) {
  return new Plugin({
    key: new PluginKey("handleClickLink"),
    props: {
      handleClick: (view, pos, event) => {
        var _a, _b;
        if (event.button !== 0) {
          return false;
        }
        if (!view.editable) {
          return false;
        }
        let link = null;
        if (event.target instanceof HTMLAnchorElement) {
          link = event.target;
        } else {
          let a = event.target;
          const els = [];
          while (a.nodeName !== "DIV") {
            els.push(a);
            a = a.parentNode;
          }
          link = els.find((value) => value.nodeName === "A");
        }
        if (!link) {
          return false;
        }
        const attrs = getAttributes(view.state, options.type.name);
        const href = (_a = link == null ? void 0 : link.href) != null ? _a : attrs.href;
        const target = (_b = link == null ? void 0 : link.target) != null ? _b : attrs.target;
        if (options.enableClickSelection) {
          options.editor.commands.extendMarkRange(options.type.name);
        }
        if (link && href) {
          window.open(href, target);
          return true;
        }
        return false;
      }
    }
  });
}
function pasteHandler(options) {
  return new Plugin({
    key: new PluginKey("handlePasteLink"),
    props: {
      handlePaste: (view, event, slice) => {
        const { state } = view;
        const { selection } = state;
        const { empty } = selection;
        if (empty) {
          return false;
        }
        let textContent = "";
        slice.content.forEach((node) => {
          textContent += node.textContent;
        });
        const link = find(textContent, { defaultProtocol: options.defaultProtocol }).find(
          (item) => item.isLink && item.value === textContent
        );
        if (!textContent || !link) {
          return false;
        }
        return options.editor.commands.setMark(options.type, {
          href: link.href
        });
      }
    }
  });
}
function isAllowedUri(uri, protocols) {
  const allowedProtocols = ["http", "https", "ftp", "ftps", "mailto", "tel", "callto", "sms", "cid", "xmpp"];
  if (protocols) {
    protocols.forEach((protocol) => {
      const nextProtocol = typeof protocol === "string" ? protocol : protocol.scheme;
      if (nextProtocol) {
        allowedProtocols.push(nextProtocol);
      }
    });
  }
  return !uri || uri.replace(UNICODE_WHITESPACE_REGEX_GLOBAL, "").match(
    new RegExp(
      // eslint-disable-next-line no-useless-escape
      `^(?:(?:${allowedProtocols.join("|")}):|[^a-z]|[a-z0-9+.-]+(?:[^a-z+.-:]|$))`,
      "i"
    )
  );
}
var Link = Mark.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: false,
  exitable: true,
  onCreate() {
    if (this.options.validate && !this.options.shouldAutoLink) {
      this.options.shouldAutoLink = this.options.validate;
      console.warn("The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.");
    }
    this.options.protocols.forEach((protocol) => {
      if (typeof protocol === "string") {
        registerCustomProtocol(protocol);
        return;
      }
      registerCustomProtocol(protocol.scheme, protocol.optionalSlashes);
    });
  },
  onDestroy() {
    reset();
  },
  inclusive() {
    return this.options.autolink;
  },
  addOptions() {
    return {
      openOnClick: true,
      enableClickSelection: false,
      linkOnPaste: true,
      autolink: true,
      protocols: [],
      defaultProtocol: "http",
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
        class: null
      },
      isAllowedUri: (url, ctx) => !!isAllowedUri(url, ctx.protocols),
      validate: (url) => !!url,
      shouldAutoLink: (url) => !!url
    };
  },
  addAttributes() {
    return {
      href: {
        default: null,
        parseHTML(element) {
          return element.getAttribute("href");
        }
      },
      target: {
        default: this.options.HTMLAttributes.target
      },
      rel: {
        default: this.options.HTMLAttributes.rel
      },
      class: {
        default: this.options.HTMLAttributes.class
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "a[href]",
        getAttrs: (dom) => {
          const href = dom.getAttribute("href");
          if (!href || !this.options.isAllowedUri(href, {
            defaultValidate: (url) => !!isAllowedUri(url, this.options.protocols),
            protocols: this.options.protocols,
            defaultProtocol: this.options.defaultProtocol
          })) {
            return false;
          }
          return null;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    if (!this.options.isAllowedUri(HTMLAttributes.href, {
      defaultValidate: (href) => !!isAllowedUri(href, this.options.protocols),
      protocols: this.options.protocols,
      defaultProtocol: this.options.defaultProtocol
    })) {
      return ["a", mergeAttributes(this.options.HTMLAttributes, { ...HTMLAttributes, href: "" }), 0];
    }
    return ["a", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setLink: (attributes) => ({ chain }) => {
        const { href } = attributes;
        if (!this.options.isAllowedUri(href, {
          defaultValidate: (url) => !!isAllowedUri(url, this.options.protocols),
          protocols: this.options.protocols,
          defaultProtocol: this.options.defaultProtocol
        })) {
          return false;
        }
        return chain().setMark(this.name, attributes).setMeta("preventAutolink", true).run();
      },
      toggleLink: (attributes) => ({ chain }) => {
        const { href } = attributes || {};
        if (href && !this.options.isAllowedUri(href, {
          defaultValidate: (url) => !!isAllowedUri(url, this.options.protocols),
          protocols: this.options.protocols,
          defaultProtocol: this.options.defaultProtocol
        })) {
          return false;
        }
        return chain().toggleMark(this.name, attributes, { extendEmptyMarkRange: true }).setMeta("preventAutolink", true).run();
      },
      unsetLink: () => ({ chain }) => {
        return chain().unsetMark(this.name, { extendEmptyMarkRange: true }).setMeta("preventAutolink", true).run();
      }
    };
  },
  addPasteRules() {
    return [
      markPasteRule({
        find: (text) => {
          const foundLinks = [];
          if (text) {
            const { protocols, defaultProtocol } = this.options;
            const links = find(text).filter(
              (item) => item.isLink && this.options.isAllowedUri(item.value, {
                defaultValidate: (href) => !!isAllowedUri(href, protocols),
                protocols,
                defaultProtocol
              })
            );
            if (links.length) {
              links.forEach(
                (link) => foundLinks.push({
                  text: link.value,
                  data: {
                    href: link.href
                  },
                  index: link.start
                })
              );
            }
          }
          return foundLinks;
        },
        type: this.type,
        getAttributes: (match) => {
          var _a;
          return {
            href: (_a = match.data) == null ? void 0 : _a.href
          };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    const plugins = [];
    const { protocols, defaultProtocol } = this.options;
    if (this.options.autolink) {
      plugins.push(
        autolink({
          type: this.type,
          defaultProtocol: this.options.defaultProtocol,
          validate: (url) => this.options.isAllowedUri(url, {
            defaultValidate: (href) => !!isAllowedUri(href, protocols),
            protocols,
            defaultProtocol
          }),
          shouldAutoLink: this.options.shouldAutoLink
        })
      );
    }
    if (this.options.openOnClick === true) {
      plugins.push(
        clickHandler({
          type: this.type,
          editor: this.editor,
          enableClickSelection: this.options.enableClickSelection
        })
      );
    }
    if (this.options.linkOnPaste) {
      plugins.push(
        pasteHandler({
          editor: this.editor,
          defaultProtocol: this.options.defaultProtocol,
          type: this.type
        })
      );
    }
    return plugins;
  }
});

// src/index.ts
var index_default$2 = Link;

// src/cell/table-cell.ts
var TableCell = Node.create({
  name: "tableCell",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  addAttributes() {
    return {
      colspan: {
        default: 1
      },
      rowspan: {
        default: 1
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth ? colwidth.split(",").map((width) => parseInt(width, 10)) : null;
          return value;
        }
      }
    };
  },
  tableRole: "cell",
  isolating: true,
  parseHTML() {
    return [{ tag: "td" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["td", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});
var TableHeader = Node.create({
  name: "tableHeader",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  addAttributes() {
    return {
      colspan: {
        default: 1
      },
      rowspan: {
        default: 1
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth ? colwidth.split(",").map((width) => parseInt(width, 10)) : null;
          return value;
        }
      }
    };
  },
  tableRole: "header_cell",
  isolating: true,
  parseHTML() {
    return [{ tag: "th" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["th", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});
var TableRow = Node.create({
  name: "tableRow",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "(tableCell | tableHeader)*",
  tableRole: "row",
  parseHTML() {
    return [{ tag: "tr" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["tr", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});

// src/table/utilities/colStyle.ts
function getColStyleDeclaration(minWidth, width) {
  if (width) {
    return ["width", `${Math.max(width, minWidth)}px`];
  }
  return ["min-width", `${minWidth}px`];
}

// src/table/TableView.ts
function updateColumns(node, colgroup, table, cellMinWidth, overrideCol, overrideValue) {
  var _a;
  let totalWidth = 0;
  let fixedWidth = true;
  let nextDOM = colgroup.firstChild;
  const row = node.firstChild;
  if (row !== null) {
    for (let i = 0, col = 0; i < row.childCount; i += 1) {
      const { colspan, colwidth } = row.child(i).attrs;
      for (let j = 0; j < colspan; j += 1, col += 1) {
        const hasWidth = overrideCol === col ? overrideValue : colwidth && colwidth[j];
        const cssWidth = hasWidth ? `${hasWidth}px` : "";
        totalWidth += hasWidth || cellMinWidth;
        if (!hasWidth) {
          fixedWidth = false;
        }
        if (!nextDOM) {
          const colElement = document.createElement("col");
          const [propertyKey, propertyValue] = getColStyleDeclaration(cellMinWidth, hasWidth);
          colElement.style.setProperty(propertyKey, propertyValue);
          colgroup.appendChild(colElement);
        } else {
          if (nextDOM.style.width !== cssWidth) {
            const [propertyKey, propertyValue] = getColStyleDeclaration(cellMinWidth, hasWidth);
            nextDOM.style.setProperty(propertyKey, propertyValue);
          }
          nextDOM = nextDOM.nextSibling;
        }
      }
    }
  }
  while (nextDOM) {
    const after = nextDOM.nextSibling;
    (_a = nextDOM.parentNode) == null ? void 0 : _a.removeChild(nextDOM);
    nextDOM = after;
  }
  if (fixedWidth) {
    table.style.width = `${totalWidth}px`;
    table.style.minWidth = "";
  } else {
    table.style.width = "";
    table.style.minWidth = `${totalWidth}px`;
  }
}
var TableView = class {
  constructor(node, cellMinWidth) {
    this.node = node;
    this.cellMinWidth = cellMinWidth;
    this.dom = document.createElement("div");
    this.dom.className = "tableWrapper";
    this.table = this.dom.appendChild(document.createElement("table"));
    this.colgroup = this.table.appendChild(document.createElement("colgroup"));
    updateColumns(node, this.colgroup, this.table, cellMinWidth);
    this.contentDOM = this.table.appendChild(document.createElement("tbody"));
  }
  update(node) {
    if (node.type !== this.node.type) {
      return false;
    }
    this.node = node;
    updateColumns(node, this.colgroup, this.table, this.cellMinWidth);
    return true;
  }
  ignoreMutation(mutation) {
    return mutation.type === "attributes" && (mutation.target === this.table || this.colgroup.contains(mutation.target));
  }
};

// src/table/utilities/createColGroup.ts
function createColGroup(node, cellMinWidth, overrideCol, overrideValue) {
  let totalWidth = 0;
  let fixedWidth = true;
  const cols = [];
  const row = node.firstChild;
  if (!row) {
    return {};
  }
  for (let i = 0, col = 0; i < row.childCount; i += 1) {
    const { colspan, colwidth } = row.child(i).attrs;
    for (let j = 0; j < colspan; j += 1, col += 1) {
      const hasWidth = overrideCol === col ? overrideValue : colwidth && colwidth[j];
      totalWidth += hasWidth || cellMinWidth;
      if (!hasWidth) {
        fixedWidth = false;
      }
      const [property, value] = getColStyleDeclaration(cellMinWidth, hasWidth);
      cols.push(["col", { style: `${property}: ${value}` }]);
    }
  }
  const tableWidth = fixedWidth ? `${totalWidth}px` : "";
  const tableMinWidth = fixedWidth ? "" : `${totalWidth}px`;
  const colgroup = ["colgroup", {}, ...cols];
  return { colgroup, tableWidth, tableMinWidth };
}

// src/table/utilities/createCell.ts
function createCell(cellType, cellContent) {
  if (cellContent) {
    return cellType.createChecked(null, cellContent);
  }
  return cellType.createAndFill();
}

// src/table/utilities/getTableNodeTypes.ts
function getTableNodeTypes(schema) {
  if (schema.cached.tableNodeTypes) {
    return schema.cached.tableNodeTypes;
  }
  const roles = {};
  Object.keys(schema.nodes).forEach((type) => {
    const nodeType = schema.nodes[type];
    if (nodeType.spec.tableRole) {
      roles[nodeType.spec.tableRole] = nodeType;
    }
  });
  schema.cached.tableNodeTypes = roles;
  return roles;
}

// src/table/utilities/createTable.ts
function createTable(schema, rowsCount, colsCount, withHeaderRow, cellContent) {
  const types = getTableNodeTypes(schema);
  const headerCells = [];
  const cells = [];
  for (let index = 0; index < colsCount; index += 1) {
    const cell = createCell(types.cell, cellContent);
    if (cell) {
      cells.push(cell);
    }
    if (withHeaderRow) {
      const headerCell = createCell(types.header_cell, cellContent);
      if (headerCell) {
        headerCells.push(headerCell);
      }
    }
  }
  const rows = [];
  for (let index = 0; index < rowsCount; index += 1) {
    rows.push(types.row.createChecked(null, withHeaderRow && index === 0 ? headerCells : cells));
  }
  return types.table.createChecked(null, rows);
}
function isCellSelection(value) {
  return value instanceof CellSelection;
}

// src/table/utilities/deleteTableWhenAllCellsSelected.ts
var deleteTableWhenAllCellsSelected = ({ editor }) => {
  const { selection } = editor.state;
  if (!isCellSelection(selection)) {
    return false;
  }
  let cellCount = 0;
  const table = findParentNodeClosestToPos(selection.ranges[0].$from, (node) => {
    return node.type.name === "table";
  });
  table == null ? void 0 : table.node.descendants((node) => {
    if (node.type.name === "table") {
      return false;
    }
    if (["tableCell", "tableHeader"].includes(node.type.name)) {
      cellCount += 1;
    }
  });
  const allCellsSelected = cellCount === selection.ranges.length;
  if (!allCellsSelected) {
    return false;
  }
  editor.commands.deleteTable();
  return true;
};

// src/table/table.ts
var Table = Node.create({
  name: "table",
  // @ts-ignore
  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: false,
      handleWidth: 5,
      cellMinWidth: 25,
      // TODO: fix
      View: TableView,
      lastColumnResizable: true,
      allowTableNodeSelection: false
    };
  },
  content: "tableRow+",
  tableRole: "table",
  isolating: true,
  group: "block",
  parseHTML() {
    return [{ tag: "table" }];
  },
  renderHTML({ node, HTMLAttributes }) {
    const { colgroup, tableWidth, tableMinWidth } = createColGroup(node, this.options.cellMinWidth);
    const table = [
      "table",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: tableWidth ? `width: ${tableWidth}` : `min-width: ${tableMinWidth}`
      }),
      colgroup,
      ["tbody", 0]
    ];
    return table;
  },
  addCommands() {
    return {
      insertTable: ({ rows = 3, cols = 3, withHeaderRow = true } = {}) => ({ tr, dispatch, editor }) => {
        const node = createTable(editor.schema, rows, cols, withHeaderRow);
        if (dispatch) {
          const offset = tr.selection.from + 1;
          tr.replaceSelectionWith(node).scrollIntoView().setSelection(TextSelection$1.near(tr.doc.resolve(offset)));
        }
        return true;
      },
      addColumnBefore: () => ({ state, dispatch }) => {
        return addColumnBefore(state, dispatch);
      },
      addColumnAfter: () => ({ state, dispatch }) => {
        return addColumnAfter(state, dispatch);
      },
      deleteColumn: () => ({ state, dispatch }) => {
        return deleteColumn(state, dispatch);
      },
      addRowBefore: () => ({ state, dispatch }) => {
        return addRowBefore(state, dispatch);
      },
      addRowAfter: () => ({ state, dispatch }) => {
        return addRowAfter(state, dispatch);
      },
      deleteRow: () => ({ state, dispatch }) => {
        return deleteRow(state, dispatch);
      },
      deleteTable: () => ({ state, dispatch }) => {
        return deleteTable(state, dispatch);
      },
      mergeCells: () => ({ state, dispatch }) => {
        return mergeCells(state, dispatch);
      },
      splitCell: () => ({ state, dispatch }) => {
        return splitCell(state, dispatch);
      },
      toggleHeaderColumn: () => ({ state, dispatch }) => {
        return toggleHeader("column")(state, dispatch);
      },
      toggleHeaderRow: () => ({ state, dispatch }) => {
        return toggleHeader("row")(state, dispatch);
      },
      toggleHeaderCell: () => ({ state, dispatch }) => {
        return toggleHeaderCell(state, dispatch);
      },
      mergeOrSplit: () => ({ state, dispatch }) => {
        if (mergeCells(state, dispatch)) {
          return true;
        }
        return splitCell(state, dispatch);
      },
      setCellAttribute: (name, value) => ({ state, dispatch }) => {
        return setCellAttr(name, value)(state, dispatch);
      },
      goToNextCell: () => ({ state, dispatch }) => {
        return goToNextCell(1)(state, dispatch);
      },
      goToPreviousCell: () => ({ state, dispatch }) => {
        return goToNextCell(-1)(state, dispatch);
      },
      fixTables: () => ({ state, dispatch }) => {
        if (dispatch) {
          fixTables(state);
        }
        return true;
      },
      setCellSelection: (position) => ({ tr, dispatch }) => {
        if (dispatch) {
          const selection = CellSelection.create(tr.doc, position.anchorCell, position.headCell);
          tr.setSelection(selection);
        }
        return true;
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.commands.goToNextCell()) {
          return true;
        }
        if (!this.editor.can().addRowAfter()) {
          return false;
        }
        return this.editor.chain().addRowAfter().goToNextCell().run();
      },
      "Shift-Tab": () => this.editor.commands.goToPreviousCell(),
      Backspace: deleteTableWhenAllCellsSelected,
      "Mod-Backspace": deleteTableWhenAllCellsSelected,
      Delete: deleteTableWhenAllCellsSelected,
      "Mod-Delete": deleteTableWhenAllCellsSelected
    };
  },
  addProseMirrorPlugins() {
    const isResizable = this.options.resizable && this.editor.isEditable;
    return [
      ...isResizable ? [
        columnResizing({
          handleWidth: this.options.handleWidth,
          cellMinWidth: this.options.cellMinWidth,
          defaultCellMinWidth: this.options.cellMinWidth,
          View: this.options.View,
          lastColumnResizable: this.options.lastColumnResizable
        })
      ] : [],
      tableEditing({
        allowTableNodeSelection: this.options.allowTableNodeSelection
      })
    ];
  },
  extendNodeSchema(extension) {
    const context = {
      name: extension.name,
      options: extension.options,
      storage: extension.storage
    };
    return {
      tableRole: callOrReturn(getExtensionField(extension, "tableRole", context))
    };
  }
});

// src/kit/index.ts
Extension.create({
  name: "tableKit",
  addExtensions() {
    const extensions = [];
    if (this.options.table !== false) {
      extensions.push(Table.configure(this.options.table));
    }
    if (this.options.tableCell !== false) {
      extensions.push(TableCell.configure(this.options.tableCell));
    }
    if (this.options.tableHeader !== false) {
      extensions.push(TableHeader.configure(this.options.tableHeader));
    }
    if (this.options.tableRow !== false) {
      extensions.push(TableRow.configure(this.options.tableRow));
    }
    return extensions;
  }
});

// src/youtube.ts

// src/utils.ts
var YOUTUBE_REGEX = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu\.be|youtube-nocookie\.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/;
var YOUTUBE_REGEX_GLOBAL = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu\.be|youtube-nocookie\.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/g;
var isValidYoutubeUrl = (url) => {
  return url.match(YOUTUBE_REGEX);
};
var getYoutubeEmbedUrl = (nocookie, isPlaylist) => {
  if (isPlaylist) {
    return "https://www.youtube-nocookie.com/embed/videoseries?list=";
  }
  return nocookie ? "https://www.youtube-nocookie.com/embed/" : "https://www.youtube.com/embed/";
};
var getEmbedUrlFromYoutubeUrl = (options) => {
  const {
    url,
    allowFullscreen,
    autoplay,
    ccLanguage,
    ccLoadPolicy,
    controls,
    disableKBcontrols,
    enableIFrameApi,
    endTime,
    interfaceLanguage,
    ivLoadPolicy,
    loop,
    modestBranding,
    nocookie,
    origin,
    playlist,
    progressBarColor,
    startAt,
    rel
  } = options;
  if (!isValidYoutubeUrl(url)) {
    return null;
  }
  if (url.includes("/embed/")) {
    return url;
  }
  if (url.includes("youtu.be")) {
    const id = url.split("/").pop();
    if (!id) {
      return null;
    }
    return `${getYoutubeEmbedUrl(nocookie)}${id}`;
  }
  const videoIdRegex = /(?:(v|list)=|shorts\/)([-\w]+)/gm;
  const matches = videoIdRegex.exec(url);
  if (!matches || !matches[2]) {
    return null;
  }
  let outputUrl = `${getYoutubeEmbedUrl(nocookie, matches[1] === "list")}${matches[2]}`;
  const params = [];
  if (allowFullscreen === false) {
    params.push("fs=0");
  }
  if (autoplay) {
    params.push("autoplay=1");
  }
  if (ccLanguage) {
    params.push(`cc_lang_pref=${ccLanguage}`);
  }
  if (ccLoadPolicy) {
    params.push("cc_load_policy=1");
  }
  if (!controls) {
    params.push("controls=0");
  }
  if (disableKBcontrols) {
    params.push("disablekb=1");
  }
  if (enableIFrameApi) {
    params.push("enablejsapi=1");
  }
  if (endTime) {
    params.push(`end=${endTime}`);
  }
  if (interfaceLanguage) {
    params.push(`hl=${interfaceLanguage}`);
  }
  if (ivLoadPolicy) {
    params.push(`iv_load_policy=${ivLoadPolicy}`);
  }
  if (loop) {
    params.push("loop=1");
  }
  if (modestBranding) {
    params.push("modestbranding=1");
  }
  if (origin) {
    params.push(`origin=${origin}`);
  }
  if (playlist) {
    params.push(`playlist=${playlist}`);
  }
  if (startAt) {
    params.push(`start=${startAt}`);
  }
  if (progressBarColor) {
    params.push(`color=${progressBarColor}`);
  }
  if (rel !== void 0) {
    params.push(`rel=${rel}`);
  }
  if (params.length) {
    outputUrl += `${matches[1] === "v" ? "?" : "&"}${params.join("&")}`;
  }
  return outputUrl;
};

// src/youtube.ts
var Youtube = Node.create({
  name: "youtube",
  addOptions() {
    return {
      addPasteHandler: true,
      allowFullscreen: true,
      autoplay: false,
      ccLanguage: void 0,
      ccLoadPolicy: void 0,
      controls: true,
      disableKBcontrols: false,
      enableIFrameApi: false,
      endTime: 0,
      height: 480,
      interfaceLanguage: void 0,
      ivLoadPolicy: 0,
      loop: false,
      modestBranding: false,
      HTMLAttributes: {},
      inline: false,
      nocookie: false,
      origin: "",
      playlist: "",
      progressBarColor: void 0,
      width: 640,
      rel: 1
    };
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? "inline" : "block";
  },
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null
      },
      start: {
        default: 0
      },
      width: {
        default: this.options.width
      },
      height: {
        default: this.options.height
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-youtube-video] iframe"
      }
    ];
  },
  addCommands() {
    return {
      setYoutubeVideo: (options) => ({ commands }) => {
        if (!isValidYoutubeUrl(options.src)) {
          return false;
        }
        return commands.insertContent({
          type: this.name,
          attrs: options
        });
      }
    };
  },
  addPasteRules() {
    if (!this.options.addPasteHandler) {
      return [];
    }
    return [
      nodePasteRule({
        find: YOUTUBE_REGEX_GLOBAL,
        type: this.type,
        getAttributes: (match) => {
          return { src: match.input };
        }
      })
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const embedUrl = getEmbedUrlFromYoutubeUrl({
      url: HTMLAttributes.src,
      allowFullscreen: this.options.allowFullscreen,
      autoplay: this.options.autoplay,
      ccLanguage: this.options.ccLanguage,
      ccLoadPolicy: this.options.ccLoadPolicy,
      controls: this.options.controls,
      disableKBcontrols: this.options.disableKBcontrols,
      enableIFrameApi: this.options.enableIFrameApi,
      endTime: this.options.endTime,
      interfaceLanguage: this.options.interfaceLanguage,
      ivLoadPolicy: this.options.ivLoadPolicy,
      loop: this.options.loop,
      modestBranding: this.options.modestBranding,
      nocookie: this.options.nocookie,
      origin: this.options.origin,
      playlist: this.options.playlist,
      progressBarColor: this.options.progressBarColor,
      startAt: HTMLAttributes.start || 0,
      rel: this.options.rel
    });
    HTMLAttributes.src = embedUrl;
    return [
      "div",
      { "data-youtube-video": "" },
      [
        "iframe",
        mergeAttributes(
          this.options.HTMLAttributes,
          {
            width: this.options.width,
            height: this.options.height,
            allowfullscreen: this.options.allowFullscreen,
            autoplay: this.options.autoplay,
            ccLanguage: this.options.ccLanguage,
            ccLoadPolicy: this.options.ccLoadPolicy,
            disableKBcontrols: this.options.disableKBcontrols,
            enableIFrameApi: this.options.enableIFrameApi,
            endTime: this.options.endTime,
            interfaceLanguage: this.options.interfaceLanguage,
            ivLoadPolicy: this.options.ivLoadPolicy,
            loop: this.options.loop,
            modestBranding: this.options.modestBranding,
            origin: this.options.origin,
            playlist: this.options.playlist,
            progressBarColor: this.options.progressBarColor,
            rel: this.options.rel
          },
          HTMLAttributes
        )
      ]
    ];
  }
});

// src/index.ts
var index_default$1 = Youtube;

function YouTubeNodeView(_a) {
    var node = _a.node, updateAttributes = _a.updateAttributes, selected = _a.selected;
    var _b = useState(false), isResizing = _b[0], setIsResizing = _b[1];
    var _c = useState({
        width: node.attrs.width || 640,
        height: node.attrs.height || 480
    }), dimensions = _c[0], setDimensions = _c[1];
    var nodeRef = useRef(null);
    var startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
    var handleMouseDown = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        startPosRef.current = {
            x: e.clientX,
            y: e.clientY,
            width: dimensions.width,
            height: dimensions.height
        };
    };
    useEffect(function () {
        if (!isResizing)
            return;
        var handleMouseMove = function (e) {
            var deltaX = e.clientX - startPosRef.current.x;
            var deltaY = e.clientY - startPosRef.current.y;
            var newWidth = Math.max(320, startPosRef.current.width + deltaX);
            var newHeight = Math.max(180, startPosRef.current.height + deltaY);
            setDimensions({ width: newWidth, height: newHeight });
        };
        var handleMouseUp = function () {
            setIsResizing(false);
            updateAttributes({
                width: dimensions.width,
                height: dimensions.height
            });
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return function () {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, dimensions, updateAttributes]);
    return (React__default.createElement(NodeViewWrapper, { className: "youtube-wrapper" },
        React__default.createElement("div", { ref: nodeRef, className: "youtube-video ".concat(selected ? 'ProseMirror-selectednode' : ''), "data-align": node.attrs.align || 'left', style: {
                width: "".concat(dimensions.width, "px"),
                height: "".concat(dimensions.height, "px"),
                position: 'relative',
                display: 'block',
                margin: node.attrs.align === 'center' ? '1rem auto' :
                    node.attrs.align === 'right' ? '1rem 0 1rem auto' :
                        '1rem auto 1rem 0'
            } },
            React__default.createElement("iframe", { src: node.attrs.src, width: "100%", height: "100%", style: { position: 'absolute', top: 0, left: 0, borderRadius: '8px' }, frameBorder: "0", allowFullScreen: true, allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" }),
            React__default.createElement("div", { className: "resize-handle", style: {
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '10px',
                    height: '10px',
                    cursor: 'se-resize',
                    background: 'linear-gradient(135deg, transparent 50%, #9ca3af 50%)',
                    opacity: selected ? 1 : 0,
                    transition: 'opacity 0.2s'
                }, onMouseDown: handleMouseDown }))));
}

var YoutubeAlign = index_default$1.extend({
    addAttributes: function () {
        var _a;
        return __assign(__assign({}, (_a = this.parent) === null || _a === void 0 ? void 0 : _a.call(this)), { align: {
                default: 'left',
                parseHTML: function (element) { return element.getAttribute('data-align'); },
                renderHTML: function (attributes) {
                    if (!attributes.align)
                        return {};
                    return { 'data-align': attributes.align };
                },
            }, width: {
                default: 640,
                parseHTML: function (element) {
                    var width = element.getAttribute('width');
                    return width ? parseInt(width) : 640;
                },
                renderHTML: function (attributes) {
                    return { width: attributes.width.toString() };
                },
            }, height: {
                default: 480,
                parseHTML: function (element) {
                    var height = element.getAttribute('height');
                    return height ? parseInt(height) : 480;
                },
                renderHTML: function (attributes) {
                    return { height: attributes.height.toString() };
                },
            } });
    },
    renderHTML: function (_a) {
        var HTMLAttributes = _a.HTMLAttributes;
        var width = HTMLAttributes.width, height = HTMLAttributes.height, align = HTMLAttributes.align, rest = __rest(HTMLAttributes, ["width", "height", "align"]);
        return [
            'div',
            mergeAttributes({ class: 'youtube-video', 'data-align': align || 'left' }, rest),
            [
                'iframe',
                mergeAttributes({
                    width: width || '640',
                    height: height || '480',
                    frameborder: '0',
                    allowfullscreen: 'true',
                    src: HTMLAttributes.src,
                }),
            ],
        ];
    },
    addNodeView: function () {
        return ReactNodeViewRenderer(YouTubeNodeView);
    }
});

// src/font-size.ts
var FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"]
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`
              };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize) => ({ chain }) => {
        return chain().setMark("textStyle", { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run();
      }
    };
  }
});

var EditorContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  .ProseMirror {\n    outline: none;\n    padding: 1rem;\n    @media (max-width: 640px) {\n      padding: 0.5rem;\n      font-size: 14px;\n    }\n  }\n\n  .ProseMirror p {\n    margin: 0;\n    line-height: 1.5;\n  }\n\n  .ProseMirror a{\n    color: #007bff;\n    text-decoration: underline;\n    cursor: pointer;\n    &:hover{\n      color: #0056b3;\n    }\n  }\n\n  /* Image styles - using tiptap-extension-resize-image */\n  .ProseMirror img {\n    max-width: 100%;\n    height: auto;\n    border-radius: 4px;\n    transition: all 0.2s ease;\n    display: block;\n    margin: 1rem auto;\n  }\n\n  .ProseMirror img.resizable-image {\n    cursor: pointer;\n    border: 2px solid transparent;\n    \n    &:hover {\n      border-color: #e5e7eb;\n    }\n    \n    &.ProseMirror-selectednode {\n      border-color: #3b82f6;\n      outline: none;\n    }\n  }\n\n  /* Image alignment in editor */\n  .ProseMirror img[data-align='left'] {\n    margin-right: auto;\n    margin-left: 0;\n  }\n\n  .ProseMirror img[data-align='center'] {\n    margin-left: auto;\n    margin-right: auto;\n  }\n\n  .ProseMirror img[data-align='right'] {\n    margin-left: auto;\n    margin-right: 0;\n  }\n\n  /* List styles */\n  .ProseMirror ul {\n    list-style-type: disc;\n    padding-left: 1.5em;\n    margin: 0.5em 0;\n    \n    @media (max-width: 640px) {\n      padding-left: 1em;\n      margin: 0.25em 0;\n    }\n  }\n\n  .ProseMirror ol {\n    list-style-type: decimal;\n    padding-left: 1.5em;\n    margin: 0.5em 0;\n    \n    @media (max-width: 640px) {\n      padding-left: 1em;\n      margin: 0.25em 0;\n    }\n  }\n\n  .ProseMirror li {\n    margin: 0.2em 0;\n  }\n\n  .ProseMirror li p {\n    margin: 0;\n  }\n\n  /* Heading styles */\n  .ProseMirror h1 {\n    font-size: 2em;\n    font-weight: bold;\n    margin: 0.67em 0;\n    \n    @media (max-width: 640px) {\n      font-size: 1.5em;\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror h2 {\n    font-size: 1.5em;\n    font-weight: bold;\n    margin: 0.75em 0;\n    \n    @media (max-width: 640px) {\n      font-size: 1.25em;\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror h3 {\n    font-size: 1.17em;\n    font-weight: bold;\n    margin: 0.83em 0;\n    \n    @media (max-width: 640px) {\n      font-size: 1.1em;\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror h4 {\n    font-size: 1em;\n    font-weight: bold;\n    margin: 1.12em 0;\n    \n    @media (max-width: 640px) {\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror h5 {\n    font-size: 0.83em;\n    font-weight: bold;\n    margin: 1.5em 0;\n    \n    @media (max-width: 640px) {\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror h6 {\n    font-size: 0.75em;\n    font-weight: bold;\n    margin: 1.67em 0;\n    \n    @media (max-width: 640px) {\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror blockquote {\n    border-left: 4px solid #e5e7eb;\n    margin: 1em 0;\n    padding-left: 1em;\n    color: #6b7280;\n    \n    @media (max-width: 640px) {\n      margin: 0.5em 0;\n      padding-left: 0.5em;\n    }\n  }\n\n  .ProseMirror pre {\n    background-color: #f9fafb;\n    border-radius: 6px;\n    padding: 0.75em 1em;\n    margin: 1em 0;\n    overflow-x: auto;\n    \n    @media (max-width: 640px) {\n      padding: 0.5em 0.75em;\n      margin: 0.5em 0;\n      font-size: 12px;\n    }\n  }\n\n  .ProseMirror code {\n    background-color: #f3f4f6;\n    border-radius: 4px;\n    padding: 0.2em 0.4em;\n    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;\n    \n    @media (max-width: 640px) {\n      font-size: 12px;\n    }\n  }\n\n  /* Table styles */\n  table {\n    border-collapse: collapse;\n    margin: 0;\n    overflow: hidden;\n    table-layout: fixed;\n    width: 100%;\n\n    @media (max-width: 640px) {\n      font-size: 12px;\n    }\n\n    td,\n    th {\n      border: 1px solid #e5e7eb;\n      box-sizing: border-box;\n      min-width: 1em;\n      padding: 2px 8px;\n      position: relative;\n      vertical-align: top;\n      height: 24px;\n      line-height: 1.2;\n\n      @media (max-width: 640px) {\n        padding: 1px 4px;\n        height: 20px;\n      }\n\n      > * {\n        margin-bottom: 0;\n      }\n    }\n\n    th {\n      background-color: #f9fafb;\n      font-weight: 600;\n      text-align: left;\n    }\n\n    .selectedCell:after {\n      background: rgba(190, 190, 226, 0.5);\n      content: '';\n      left: 0;\n      right: 0;\n      top: 0;\n      bottom: 0;\n      pointer-events: none;\n      position: absolute;\n      z-index: 2;\n    }\n\n    .column-resize-handle {\n      background-color: #3b82f6;\n      bottom: -2px;\n      pointer-events: none;\n      position: absolute;\n      right: -2px;\n      top: 0;\n      width: 4px;\n      cursor: col-resize;\n    }\n  }\n\n  .tableWrapper {\n    margin: 1rem 0;\n    overflow-x: auto;\n    \n    @media (max-width: 640px) {\n      margin: 0.5rem 0;\n    }\n  }\n\n  .resize-cursor {\n    cursor: ew-resize;\n  }\n\n  /* YouTube Video Resizing Styles */\n  .youtube-video {\n    position: relative;\n    display: block;\n    margin: 1rem auto;\n    resize: both;\n    overflow: hidden;\n    min-width: 320px;\n    min-height: 180px;\n    max-width: 100%;\n    border: 2px solid transparent;\n    transition: border-color 0.2s ease;\n    border-radius: 8px;\n\n    @media (max-width: 640px) {\n      margin: 0.5rem auto;\n      min-width: 280px;\n      min-height: 157px;\n    }\n\n    &[data-align='left'] {\n      margin-right: auto;\n      margin-left: 0;\n    }\n\n    &[data-align='center'] {\n      margin-left: auto;\n      margin-right: auto;\n    }\n\n    &[data-align='right'] {\n      margin-left: auto;\n      margin-right: 0;\n    }\n\n    &:hover {\n      border-color: #e5e7eb;\n    }\n\n    &.ProseMirror-selectednode {\n      outline: 2px solid #3b82f6;\n      outline-offset: 2px;\n    }\n\n    iframe {\n      width: 100%;\n      height: 100%;\n      position: absolute;\n      top: 0;\n      left: 0;\n    }\n\n    &::after {\n      content: '';\n      position: absolute;\n      bottom: 0;\n      right: 0;\n      width: 10px;\n      height: 10px;\n      cursor: se-resize;\n      background: linear-gradient(135deg, transparent 50%, #9ca3af 50%);\n    }\n  }\n"], ["\n  .ProseMirror {\n    outline: none;\n    padding: 1rem;\n    @media (max-width: 640px) {\n      padding: 0.5rem;\n      font-size: 14px;\n    }\n  }\n\n  .ProseMirror p {\n    margin: 0;\n    line-height: 1.5;\n  }\n\n  .ProseMirror a{\n    color: #007bff;\n    text-decoration: underline;\n    cursor: pointer;\n    &:hover{\n      color: #0056b3;\n    }\n  }\n\n  /* Image styles - using tiptap-extension-resize-image */\n  .ProseMirror img {\n    max-width: 100%;\n    height: auto;\n    border-radius: 4px;\n    transition: all 0.2s ease;\n    display: block;\n    margin: 1rem auto;\n  }\n\n  .ProseMirror img.resizable-image {\n    cursor: pointer;\n    border: 2px solid transparent;\n    \n    &:hover {\n      border-color: #e5e7eb;\n    }\n    \n    &.ProseMirror-selectednode {\n      border-color: #3b82f6;\n      outline: none;\n    }\n  }\n\n  /* Image alignment in editor */\n  .ProseMirror img[data-align='left'] {\n    margin-right: auto;\n    margin-left: 0;\n  }\n\n  .ProseMirror img[data-align='center'] {\n    margin-left: auto;\n    margin-right: auto;\n  }\n\n  .ProseMirror img[data-align='right'] {\n    margin-left: auto;\n    margin-right: 0;\n  }\n\n  /* List styles */\n  .ProseMirror ul {\n    list-style-type: disc;\n    padding-left: 1.5em;\n    margin: 0.5em 0;\n    \n    @media (max-width: 640px) {\n      padding-left: 1em;\n      margin: 0.25em 0;\n    }\n  }\n\n  .ProseMirror ol {\n    list-style-type: decimal;\n    padding-left: 1.5em;\n    margin: 0.5em 0;\n    \n    @media (max-width: 640px) {\n      padding-left: 1em;\n      margin: 0.25em 0;\n    }\n  }\n\n  .ProseMirror li {\n    margin: 0.2em 0;\n  }\n\n  .ProseMirror li p {\n    margin: 0;\n  }\n\n  /* Heading styles */\n  .ProseMirror h1 {\n    font-size: 2em;\n    font-weight: bold;\n    margin: 0.67em 0;\n    \n    @media (max-width: 640px) {\n      font-size: 1.5em;\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror h2 {\n    font-size: 1.5em;\n    font-weight: bold;\n    margin: 0.75em 0;\n    \n    @media (max-width: 640px) {\n      font-size: 1.25em;\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror h3 {\n    font-size: 1.17em;\n    font-weight: bold;\n    margin: 0.83em 0;\n    \n    @media (max-width: 640px) {\n      font-size: 1.1em;\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror h4 {\n    font-size: 1em;\n    font-weight: bold;\n    margin: 1.12em 0;\n    \n    @media (max-width: 640px) {\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror h5 {\n    font-size: 0.83em;\n    font-weight: bold;\n    margin: 1.5em 0;\n    \n    @media (max-width: 640px) {\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror h6 {\n    font-size: 0.75em;\n    font-weight: bold;\n    margin: 1.67em 0;\n    \n    @media (max-width: 640px) {\n      margin: 0.5em 0;\n    }\n  }\n\n  .ProseMirror blockquote {\n    border-left: 4px solid #e5e7eb;\n    margin: 1em 0;\n    padding-left: 1em;\n    color: #6b7280;\n    \n    @media (max-width: 640px) {\n      margin: 0.5em 0;\n      padding-left: 0.5em;\n    }\n  }\n\n  .ProseMirror pre {\n    background-color: #f9fafb;\n    border-radius: 6px;\n    padding: 0.75em 1em;\n    margin: 1em 0;\n    overflow-x: auto;\n    \n    @media (max-width: 640px) {\n      padding: 0.5em 0.75em;\n      margin: 0.5em 0;\n      font-size: 12px;\n    }\n  }\n\n  .ProseMirror code {\n    background-color: #f3f4f6;\n    border-radius: 4px;\n    padding: 0.2em 0.4em;\n    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;\n    \n    @media (max-width: 640px) {\n      font-size: 12px;\n    }\n  }\n\n  /* Table styles */\n  table {\n    border-collapse: collapse;\n    margin: 0;\n    overflow: hidden;\n    table-layout: fixed;\n    width: 100%;\n\n    @media (max-width: 640px) {\n      font-size: 12px;\n    }\n\n    td,\n    th {\n      border: 1px solid #e5e7eb;\n      box-sizing: border-box;\n      min-width: 1em;\n      padding: 2px 8px;\n      position: relative;\n      vertical-align: top;\n      height: 24px;\n      line-height: 1.2;\n\n      @media (max-width: 640px) {\n        padding: 1px 4px;\n        height: 20px;\n      }\n\n      > * {\n        margin-bottom: 0;\n      }\n    }\n\n    th {\n      background-color: #f9fafb;\n      font-weight: 600;\n      text-align: left;\n    }\n\n    .selectedCell:after {\n      background: rgba(190, 190, 226, 0.5);\n      content: '';\n      left: 0;\n      right: 0;\n      top: 0;\n      bottom: 0;\n      pointer-events: none;\n      position: absolute;\n      z-index: 2;\n    }\n\n    .column-resize-handle {\n      background-color: #3b82f6;\n      bottom: -2px;\n      pointer-events: none;\n      position: absolute;\n      right: -2px;\n      top: 0;\n      width: 4px;\n      cursor: col-resize;\n    }\n  }\n\n  .tableWrapper {\n    margin: 1rem 0;\n    overflow-x: auto;\n    \n    @media (max-width: 640px) {\n      margin: 0.5rem 0;\n    }\n  }\n\n  .resize-cursor {\n    cursor: ew-resize;\n  }\n\n  /* YouTube Video Resizing Styles */\n  .youtube-video {\n    position: relative;\n    display: block;\n    margin: 1rem auto;\n    resize: both;\n    overflow: hidden;\n    min-width: 320px;\n    min-height: 180px;\n    max-width: 100%;\n    border: 2px solid transparent;\n    transition: border-color 0.2s ease;\n    border-radius: 8px;\n\n    @media (max-width: 640px) {\n      margin: 0.5rem auto;\n      min-width: 280px;\n      min-height: 157px;\n    }\n\n    &[data-align='left'] {\n      margin-right: auto;\n      margin-left: 0;\n    }\n\n    &[data-align='center'] {\n      margin-left: auto;\n      margin-right: auto;\n    }\n\n    &[data-align='right'] {\n      margin-left: auto;\n      margin-right: 0;\n    }\n\n    &:hover {\n      border-color: #e5e7eb;\n    }\n\n    &.ProseMirror-selectednode {\n      outline: 2px solid #3b82f6;\n      outline-offset: 2px;\n    }\n\n    iframe {\n      width: 100%;\n      height: 100%;\n      position: absolute;\n      top: 0;\n      left: 0;\n    }\n\n    &::after {\n      content: '';\n      position: absolute;\n      bottom: 0;\n      right: 0;\n      width: 10px;\n      height: 10px;\n      cursor: se-resize;\n      background: linear-gradient(135deg, transparent 50%, #9ca3af 50%);\n    }\n  }\n"])));
var templateObject_1;

// src/character-count/character-count.ts
var CharacterCount = Extension.create({
  name: "characterCount",
  addOptions() {
    return {
      limit: null,
      mode: "textSize",
      textCounter: (text) => text.length,
      wordCounter: (text) => text.split(" ").filter((word) => word !== "").length
    };
  },
  addStorage() {
    return {
      characters: () => 0,
      words: () => 0
    };
  },
  onBeforeCreate() {
    this.storage.characters = (options) => {
      const node = (options == null ? void 0 : options.node) || this.editor.state.doc;
      const mode = (options == null ? void 0 : options.mode) || this.options.mode;
      if (mode === "textSize") {
        const text = node.textBetween(0, node.content.size, void 0, " ");
        return this.options.textCounter(text);
      }
      return node.nodeSize;
    };
    this.storage.words = (options) => {
      const node = (options == null ? void 0 : options.node) || this.editor.state.doc;
      const text = node.textBetween(0, node.content.size, " ", " ");
      return this.options.wordCounter(text);
    };
  },
  addProseMirrorPlugins() {
    let initialEvaluationDone = false;
    return [
      new Plugin({
        key: new PluginKey("characterCount"),
        appendTransaction: (transactions, oldState, newState) => {
          if (initialEvaluationDone) {
            return;
          }
          const limit = this.options.limit;
          if (limit === null || limit === void 0 || limit === 0) {
            initialEvaluationDone = true;
            return;
          }
          const initialContentSize = this.storage.characters({ node: newState.doc });
          if (initialContentSize > limit) {
            const over = initialContentSize - limit;
            const from = 0;
            const to = over;
            console.warn(
              `[CharacterCount] Initial content exceeded limit of ${limit} characters. Content was automatically trimmed.`
            );
            const tr = newState.tr.deleteRange(from, to);
            initialEvaluationDone = true;
            return tr;
          }
          initialEvaluationDone = true;
        },
        filterTransaction: (transaction, state) => {
          const limit = this.options.limit;
          if (!transaction.docChanged || limit === 0 || limit === null || limit === void 0) {
            return true;
          }
          const oldSize = this.storage.characters({ node: state.doc });
          const newSize = this.storage.characters({ node: transaction.doc });
          if (newSize <= limit) {
            return true;
          }
          if (oldSize > limit && newSize > limit && newSize <= oldSize) {
            return true;
          }
          if (oldSize > limit && newSize > limit && newSize > oldSize) {
            return false;
          }
          const isPaste = transaction.getMeta("paste");
          if (!isPaste) {
            return false;
          }
          const pos = transaction.selection.$head.pos;
          const over = newSize - limit;
          const from = pos - over;
          const to = pos;
          transaction.deleteRange(from, to);
          const updatedSize = this.storage.characters({ node: transaction.doc });
          if (updatedSize > limit) {
            return false;
          }
          return true;
        }
      })
    ];
  }
});
Extension.create({
  name: "dropCursor",
  addOptions() {
    return {
      color: "currentColor",
      width: 1,
      class: void 0
    };
  },
  addProseMirrorPlugins() {
    return [dropCursor(this.options)];
  }
});
Extension.create({
  name: "focus",
  addOptions() {
    return {
      className: "has-focus",
      mode: "all"
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("focus"),
        props: {
          decorations: ({ doc, selection }) => {
            const { isEditable, isFocused } = this.editor;
            const { anchor } = selection;
            const decorations = [];
            if (!isEditable || !isFocused) {
              return DecorationSet.create(doc, []);
            }
            let maxLevels = 0;
            if (this.options.mode === "deepest") {
              doc.descendants((node, pos) => {
                if (node.isText) {
                  return;
                }
                const isCurrent = anchor >= pos && anchor <= pos + node.nodeSize - 1;
                if (!isCurrent) {
                  return false;
                }
                maxLevels += 1;
              });
            }
            let currentLevel = 0;
            doc.descendants((node, pos) => {
              if (node.isText) {
                return false;
              }
              const isCurrent = anchor >= pos && anchor <= pos + node.nodeSize - 1;
              if (!isCurrent) {
                return false;
              }
              currentLevel += 1;
              const outOfScope = this.options.mode === "deepest" && maxLevels - currentLevel > 0 || this.options.mode === "shallowest" && currentLevel > 1;
              if (outOfScope) {
                return this.options.mode === "deepest";
              }
              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: this.options.className
                })
              );
            });
            return DecorationSet.create(doc, decorations);
          }
        }
      })
    ];
  }
});
Extension.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [gapCursor()];
  },
  extendNodeSchema(extension) {
    var _a;
    const context = {
      name: extension.name,
      options: extension.options,
      storage: extension.storage
    };
    return {
      allowGapCursor: (_a = callOrReturn(getExtensionField(extension, "allowGapCursor", context))) != null ? _a : null
    };
  }
});
Extension.create({
  name: "placeholder",
  addOptions() {
    return {
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
      placeholder: "Write something \u2026",
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
      includeChildren: false
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("placeholder"),
        props: {
          decorations: ({ doc, selection }) => {
            const active = this.editor.isEditable || !this.options.showOnlyWhenEditable;
            const { anchor } = selection;
            const decorations = [];
            if (!active) {
              return null;
            }
            const isEmptyDoc = this.editor.isEmpty;
            doc.descendants((node, pos) => {
              const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
              const isEmpty = !node.isLeaf && isNodeEmpty(node);
              if ((hasAnchor || !this.options.showOnlyCurrent) && isEmpty) {
                const classes = [this.options.emptyNodeClass];
                if (isEmptyDoc) {
                  classes.push(this.options.emptyEditorClass);
                }
                const decoration = Decoration.node(pos, pos + node.nodeSize, {
                  class: classes.join(" "),
                  "data-placeholder": typeof this.options.placeholder === "function" ? this.options.placeholder({
                    editor: this.editor,
                    node,
                    pos,
                    hasAnchor
                  }) : this.options.placeholder
                });
                decorations.push(decoration);
              }
              return this.options.includeChildren;
            });
            return DecorationSet.create(doc, decorations);
          }
        }
      })
    ];
  }
});
Extension.create({
  name: "selection",
  addOptions() {
    return {
      className: "selection"
    };
  },
  addProseMirrorPlugins() {
    const { editor, options } = this;
    return [
      new Plugin({
        key: new PluginKey("selection"),
        props: {
          decorations(state) {
            if (state.selection.empty || editor.isFocused || !editor.isEditable || isNodeSelection(state.selection) || editor.view.dragging) {
              return null;
            }
            return DecorationSet.create(state.doc, [
              Decoration.inline(state.selection.from, state.selection.to, {
                class: options.className
              })
            ]);
          }
        }
      })
    ];
  }
});
function nodeEqualsType({ types, node }) {
  return node && Array.isArray(types) && types.includes(node.type) || (node == null ? void 0 : node.type) === types;
}
Extension.create({
  name: "trailingNode",
  addOptions() {
    return {
      node: "paragraph",
      notAfter: []
    };
  },
  addProseMirrorPlugins() {
    const plugin = new PluginKey(this.name);
    const disabledNodes = Object.entries(this.editor.schema.nodes).map(([, value]) => value).filter((node) => (this.options.notAfter || []).concat(this.options.node).includes(node.name));
    return [
      new Plugin({
        key: plugin,
        appendTransaction: (_, __, state) => {
          const { doc, tr, schema } = state;
          const shouldInsertNodeAtEnd = plugin.getState(state);
          const endPosition = doc.content.size;
          const type = schema.nodes[this.options.node];
          if (!shouldInsertNodeAtEnd) {
            return;
          }
          return tr.insert(endPosition, type.create());
        },
        state: {
          init: (_, state) => {
            const lastNode = state.tr.doc.lastChild;
            return !nodeEqualsType({ node: lastNode, types: disabledNodes });
          },
          apply: (tr, value) => {
            if (!tr.docChanged) {
              return value;
            }
            const lastNode = tr.doc.lastChild;
            return !nodeEqualsType({ node: lastNode, types: disabledNodes });
          }
        }
      })
    ];
  }
});
Extension.create({
  name: "undoRedo",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state, dispatch }) => {
        return undo(state, dispatch);
      },
      redo: () => ({ state, dispatch }) => {
        return redo(state, dispatch);
      }
    };
  },
  addProseMirrorPlugins() {
    return [history(this.options)];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Shift-Mod-z": () => this.editor.commands.redo(),
      "Mod-y": () => this.editor.commands.redo(),
      // Russian keyboard layouts
      "Mod-\u044F": () => this.editor.commands.undo(),
      "Shift-Mod-\u044F": () => this.editor.commands.redo()
    };
  }
});

// src/image.ts
var inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;
var Image = Node.create({
  name: "image",
  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {}
    };
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? "inline" : "block";
  },
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      },
      width: {
        default: null
      },
      height: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: this.options.allowBase64 ? "img[src]" : 'img[src]:not([src^="data:"])'
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  addCommands() {
    return {
      setImage: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options
        });
      }
    };
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title] = match;
          return { src, alt, title };
        }
      })
    ];
  }
});

// src/index.ts
var index_default = Image;

const CONSTANTS = {
    MOBILE_BREAKPOINT: 768,
    ICON_SIZE: '24px',
    CONTROLLER_HEIGHT: '25px',
    DOT_SIZE: {
        MOBILE: 16,
        DESKTOP: 9,
    },
    DOT_POSITION: {
        MOBILE: '-8px',
        DESKTOP: '-4px',
    },
    COLORS: {
        BORDER: '#6C6C6C',
        BACKGROUND: 'rgba(255, 255, 255, 1)',
    },
    ICONS: {
        LEFT: 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_left/default/20px.svg',
        CENTER: 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_center/default/20px.svg',
        RIGHT: 'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_right/default/20px.svg',
    },
};

const utils = {
    isMobile() {
        return document.documentElement.clientWidth < CONSTANTS.MOBILE_BREAKPOINT;
    },
    getDotPosition() {
        return utils.isMobile() ? CONSTANTS.DOT_POSITION.MOBILE : CONSTANTS.DOT_POSITION.DESKTOP;
    },
    getDotSize() {
        return utils.isMobile() ? CONSTANTS.DOT_SIZE.MOBILE : CONSTANTS.DOT_SIZE.DESKTOP;
    },
    clearContainerBorder(container) {
        const containerStyle = container.getAttribute('style');
        const newStyle = containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle.replace('border: 1px dashed #6C6C6C;', '').replace('border: 1px dashed rgb(108, 108, 108)', '');
        container.setAttribute('style', newStyle);
    },
    removeResizeElements(container) {
        if (container.childElementCount > 3) {
            for (let i = 0; i < 5; i++) {
                container.removeChild(container.lastChild);
            }
        }
    },
};

class StyleManager {
    static getContainerStyle(inline, width) {
        const baseStyle = `width: ${width || '100%'}; height: auto; cursor: pointer;`;
        const inlineStyle = inline ? 'display: inline-block;' : '';
        return `${baseStyle} ${inlineStyle}`;
    }
    static getWrapperStyle(inline) {
        return inline ? 'display: inline-block; float: left; padding-right: 8px;' : 'display: flex';
    }
    static getPositionControllerStyle(inline) {
        const width = inline ? '66px' : '100px';
        return `
      position: absolute; 
      top: 0%; 
      left: 50%; 
      width: ${width}; 
      height: ${CONSTANTS.CONTROLLER_HEIGHT}; 
      z-index: 999; 
      background-color: ${CONSTANTS.COLORS.BACKGROUND}; 
      border-radius: 3px; 
      border: 1px solid ${CONSTANTS.COLORS.BORDER}; 
      cursor: pointer; 
      transform: translate(-50%, -50%); 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 0 6px;
    `
            .replace(/\s+/g, ' ')
            .trim();
    }
    static getDotStyle(index) {
        const dotPosition = utils.getDotPosition();
        const dotSize = utils.getDotSize();
        const positions = [
            `top: ${dotPosition}; left: ${dotPosition}; cursor: nwse-resize;`,
            `top: ${dotPosition}; right: ${dotPosition}; cursor: nesw-resize;`,
            `bottom: ${dotPosition}; left: ${dotPosition}; cursor: nesw-resize;`,
            `bottom: ${dotPosition}; right: ${dotPosition}; cursor: nwse-resize;`,
        ];
        return `
      position: absolute; 
      width: ${dotSize}px; 
      height: ${dotSize}px; 
      border: 1.5px solid ${CONSTANTS.COLORS.BORDER}; 
      border-radius: 50%; 
      ${positions[index]}
    `
            .replace(/\s+/g, ' ')
            .trim();
    }
}

class AttributeParser {
    static parseImageAttributes(nodeAttrs, imgElement) {
        Object.entries(nodeAttrs).forEach(([key, value]) => {
            if (value === undefined || value === null || key === 'wrapperStyle')
                return;
            if (key === 'containerStyle') {
                const width = value.match(/width:\s*([0-9.]+)px/);
                if (width) {
                    imgElement.setAttribute('width', width[1]);
                }
                return;
            }
            imgElement.setAttribute(key, value);
        });
    }
    static extractWidthFromStyle(style) {
        const width = style.match(/width:\s*([0-9.]+)px/);
        return width ? width[1] : null;
    }
}

class PositionController {
    constructor(elements, inline, dispatchNodeView) {
        this.elements = elements;
        this.inline = inline;
        this.dispatchNodeView = dispatchNodeView;
    }
    createControllerIcon(src) {
        const controller = document.createElement('img');
        controller.setAttribute('src', src);
        controller.setAttribute('style', `width: ${CONSTANTS.ICON_SIZE}; height: ${CONSTANTS.ICON_SIZE}; cursor: pointer;`);
        controller.addEventListener('mouseover', (e) => {
            e.target.style.opacity = '0.6';
        });
        controller.addEventListener('mouseout', (e) => {
            e.target.style.opacity = '1';
        });
        return controller;
    }
    handleLeftClick() {
        if (!this.inline) {
            this.elements.container.setAttribute('style', `${this.elements.container.style.cssText} margin: 0 auto 0 0;`);
        }
        else {
            const style = 'display: inline-block; float: left; padding-right: 8px;';
            this.elements.wrapper.setAttribute('style', style);
            this.elements.container.setAttribute('style', style);
        }
        this.dispatchNodeView();
    }
    handleCenterClick() {
        this.elements.container.setAttribute('style', `${this.elements.container.style.cssText} margin: 0 auto;`);
        this.dispatchNodeView();
    }
    handleRightClick() {
        if (!this.inline) {
            this.elements.container.setAttribute('style', `${this.elements.container.style.cssText} margin: 0 0 0 auto;`);
        }
        else {
            const style = 'display: inline-block; float: right; padding-left: 8px;';
            this.elements.wrapper.setAttribute('style', style);
            this.elements.container.setAttribute('style', style);
        }
        this.dispatchNodeView();
    }
    createPositionControls() {
        const controller = document.createElement('div');
        controller.setAttribute('style', StyleManager.getPositionControllerStyle(this.inline));
        const leftController = this.createControllerIcon(CONSTANTS.ICONS.LEFT);
        leftController.addEventListener('click', () => this.handleLeftClick());
        controller.appendChild(leftController);
        if (!this.inline) {
            const centerController = this.createControllerIcon(CONSTANTS.ICONS.CENTER);
            centerController.addEventListener('click', () => this.handleCenterClick());
            controller.appendChild(centerController);
        }
        const rightController = this.createControllerIcon(CONSTANTS.ICONS.RIGHT);
        rightController.addEventListener('click', () => this.handleRightClick());
        controller.appendChild(rightController);
        this.elements.container.appendChild(controller);
        return this;
    }
}

class ResizeController {
    constructor(elements, dispatchNodeView) {
        this.state = {
            isResizing: false,
            startX: 0,
            startWidth: 0,
        };
        this.handleMouseMove = (e, index) => {
            if (!this.state.isResizing)
                return;
            const deltaX = index % 2 === 0 ? -(e.clientX - this.state.startX) : e.clientX - this.state.startX;
            const newWidth = this.state.startWidth + deltaX;
            this.elements.container.style.width = newWidth + 'px';
            this.elements.img.style.width = newWidth + 'px';
        };
        this.handleMouseUp = () => {
            if (this.state.isResizing) {
                this.state.isResizing = false;
            }
            this.dispatchNodeView();
        };
        this.handleTouchMove = (e, index) => {
            if (!this.state.isResizing)
                return;
            const deltaX = index % 2 === 0
                ? -(e.touches[0].clientX - this.state.startX)
                : e.touches[0].clientX - this.state.startX;
            const newWidth = this.state.startWidth + deltaX;
            this.elements.container.style.width = newWidth + 'px';
            this.elements.img.style.width = newWidth + 'px';
        };
        this.handleTouchEnd = () => {
            if (this.state.isResizing) {
                this.state.isResizing = false;
            }
            this.dispatchNodeView();
        };
        this.elements = elements;
        this.dispatchNodeView = dispatchNodeView;
    }
    createResizeHandle(index) {
        const dot = document.createElement('div');
        dot.setAttribute('style', StyleManager.getDotStyle(index));
        dot.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.state.isResizing = true;
            this.state.startX = e.clientX;
            this.state.startWidth = this.elements.container.offsetWidth;
            const onMouseMove = (e) => this.handleMouseMove(e, index);
            const onMouseUp = () => {
                this.handleMouseUp();
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        dot.addEventListener('touchstart', (e) => {
            e.cancelable && e.preventDefault();
            this.state.isResizing = true;
            this.state.startX = e.touches[0].clientX;
            this.state.startWidth = this.elements.container.offsetWidth;
            const onTouchMove = (e) => this.handleTouchMove(e, index);
            const onTouchEnd = () => {
                this.handleTouchEnd();
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            };
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        }, { passive: false });
        return dot;
    }
}

class ImageNodeView {
    constructor(context, inline) {
        this.clearContainerBorder = () => {
            utils.clearContainerBorder(this.elements.container);
        };
        this.dispatchNodeView = () => {
            var _a;
            const { view, getPos } = this.context;
            if (typeof getPos === 'function') {
                this.clearContainerBorder();
                const newAttrs = Object.assign(Object.assign({}, this.context.node.attrs), { width: (_a = AttributeParser.extractWidthFromStyle(this.elements.container.style.cssText)) !== null && _a !== void 0 ? _a : this.context.node.attrs.width, containerStyle: `${this.elements.container.style.cssText}`, wrapperStyle: `${this.elements.wrapper.style.cssText}` });
                view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, newAttrs));
            }
        };
        this.removeResizeElements = () => {
            utils.removeResizeElements(this.elements.container);
        };
        this.context = context;
        this.inline = inline;
        this.elements = this.createElements();
    }
    createElements() {
        return {
            wrapper: document.createElement('div'),
            container: document.createElement('div'),
            img: document.createElement('img'),
        };
    }
    setupImageAttributes() {
        AttributeParser.parseImageAttributes(this.context.node.attrs, this.elements.img);
    }
    setupDOMStructure() {
        const { wrapperStyle, containerStyle } = this.context.node.attrs;
        this.elements.wrapper.setAttribute('style', wrapperStyle);
        this.elements.wrapper.appendChild(this.elements.container);
        this.elements.container.setAttribute('style', containerStyle);
        this.elements.container.appendChild(this.elements.img);
    }
    createPositionController() {
        const positionController = new PositionController(this.elements, this.inline, this.dispatchNodeView);
        positionController.createPositionControls();
    }
    createResizeHandler() {
        const resizeHandler = new ResizeController(this.elements, this.dispatchNodeView);
        Array.from({ length: 4 }, (_, index) => {
            const dot = resizeHandler.createResizeHandle(index);
            this.elements.container.appendChild(dot);
        });
    }
    setupContainerClick() {
        this.elements.container.addEventListener('click', () => {
            var _a;
            const isMobile = utils.isMobile();
            isMobile && ((_a = document.querySelector('.ProseMirror-focused')) === null || _a === void 0 ? void 0 : _a.blur());
            this.removeResizeElements();
            this.createPositionController();
            this.elements.container.setAttribute('style', `position: relative; border: 1px dashed ${CONSTANTS.COLORS.BORDER}; ${this.context.node.attrs.containerStyle}`);
            this.createResizeHandler();
        });
    }
    setupContentClick() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const isClickInside = this.elements.container.contains(target) ||
                target.style.cssText ===
                    `width: ${CONSTANTS.ICON_SIZE}; height: ${CONSTANTS.ICON_SIZE}; cursor: pointer;`;
            if (!isClickInside) {
                this.clearContainerBorder();
                this.removeResizeElements();
            }
        });
    }
    initialize() {
        this.setupDOMStructure();
        this.setupImageAttributes();
        const { editable } = this.context.editor.options;
        if (!editable)
            return { dom: this.elements.container };
        this.setupContainerClick();
        this.setupContentClick();
        return {
            dom: this.elements.wrapper,
        };
    }
}

const ImageResize = index_default.extend({
    name: 'imageResize',
    addOptions() {
        var _a;
        return Object.assign(Object.assign({}, (_a = this.parent) === null || _a === void 0 ? void 0 : _a.call(this)), { inline: false });
    },
    addAttributes() {
        var _a;
        const inline = this.options.inline;
        return Object.assign(Object.assign({}, (_a = this.parent) === null || _a === void 0 ? void 0 : _a.call(this)), { containerStyle: {
                default: StyleManager.getContainerStyle(inline),
                parseHTML: (element) => {
                    const containerStyle = element.getAttribute('containerstyle') || element.getAttribute('style');
                    if (containerStyle) {
                        return containerStyle;
                    }
                    const width = element.getAttribute('width');
                    return width
                        ? StyleManager.getContainerStyle(inline, `${width}px`)
                        : `${element.style.cssText}`;
                },
            }, wrapperStyle: {
                default: StyleManager.getWrapperStyle(inline),
            } });
    },
    addNodeView() {
        return ({ node, editor, getPos }) => {
            const inline = this.options.inline;
            const context = {
                node,
                editor,
                view: editor.view,
                getPos: typeof getPos === 'function' ? getPos : undefined,
            };
            const nodeView = new ImageNodeView(context, inline);
            return nodeView.initialize();
        };
    },
});

function findDiffStart(a, b, pos) {
    for (let i = 0;; i++) {
        if (i == a.childCount || i == b.childCount)
            return a.childCount == b.childCount ? null : pos;
        let childA = a.child(i), childB = b.child(i);
        if (childA == childB) {
            pos += childA.nodeSize;
            continue;
        }
        if (!childA.sameMarkup(childB))
            return pos;
        if (childA.isText && childA.text != childB.text) {
            for (let j = 0; childA.text[j] == childB.text[j]; j++)
                pos++;
            return pos;
        }
        if (childA.content.size || childB.content.size) {
            let inner = findDiffStart(childA.content, childB.content, pos + 1);
            if (inner != null)
                return inner;
        }
        pos += childA.nodeSize;
    }
}
function findDiffEnd(a, b, posA, posB) {
    for (let iA = a.childCount, iB = b.childCount;;) {
        if (iA == 0 || iB == 0)
            return iA == iB ? null : { a: posA, b: posB };
        let childA = a.child(--iA), childB = b.child(--iB), size = childA.nodeSize;
        if (childA == childB) {
            posA -= size;
            posB -= size;
            continue;
        }
        if (!childA.sameMarkup(childB))
            return { a: posA, b: posB };
        if (childA.isText && childA.text != childB.text) {
            let same = 0, minSize = Math.min(childA.text.length, childB.text.length);
            while (same < minSize && childA.text[childA.text.length - same - 1] == childB.text[childB.text.length - same - 1]) {
                same++;
                posA--;
                posB--;
            }
            return { a: posA, b: posB };
        }
        if (childA.content.size || childB.content.size) {
            let inner = findDiffEnd(childA.content, childB.content, posA - 1, posB - 1);
            if (inner)
                return inner;
        }
        posA -= size;
        posB -= size;
    }
}

/**
A fragment represents a node's collection of child nodes.

Like nodes, fragments are persistent data structures, and you
should not mutate them or their content. Rather, you create new
instances whenever needed. The API tries to make this easy.
*/
class Fragment {
    /**
    @internal
    */
    constructor(
    /**
    The child nodes in this fragment.
    */
    content, size) {
        this.content = content;
        this.size = size || 0;
        if (size == null)
            for (let i = 0; i < content.length; i++)
                this.size += content[i].nodeSize;
    }
    /**
    Invoke a callback for all descendant nodes between the given two
    positions (relative to start of this fragment). Doesn't descend
    into a node when the callback returns `false`.
    */
    nodesBetween(from, to, f, nodeStart = 0, parent) {
        for (let i = 0, pos = 0; pos < to; i++) {
            let child = this.content[i], end = pos + child.nodeSize;
            if (end > from && f(child, nodeStart + pos, parent || null, i) !== false && child.content.size) {
                let start = pos + 1;
                child.nodesBetween(Math.max(0, from - start), Math.min(child.content.size, to - start), f, nodeStart + start);
            }
            pos = end;
        }
    }
    /**
    Call the given callback for every descendant node. `pos` will be
    relative to the start of the fragment. The callback may return
    `false` to prevent traversal of a given node's children.
    */
    descendants(f) {
        this.nodesBetween(0, this.size, f);
    }
    /**
    Extract the text between `from` and `to`. See the same method on
    [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
    */
    textBetween(from, to, blockSeparator, leafText) {
        let text = "", first = true;
        this.nodesBetween(from, to, (node, pos) => {
            let nodeText = node.isText ? node.text.slice(Math.max(from, pos) - pos, to - pos)
                : !node.isLeaf ? ""
                    : leafText ? (typeof leafText === "function" ? leafText(node) : leafText)
                        : node.type.spec.leafText ? node.type.spec.leafText(node)
                            : "";
            if (node.isBlock && (node.isLeaf && nodeText || node.isTextblock) && blockSeparator) {
                if (first)
                    first = false;
                else
                    text += blockSeparator;
            }
            text += nodeText;
        }, 0);
        return text;
    }
    /**
    Create a new fragment containing the combined content of this
    fragment and the other.
    */
    append(other) {
        if (!other.size)
            return this;
        if (!this.size)
            return other;
        let last = this.lastChild, first = other.firstChild, content = this.content.slice(), i = 0;
        if (last.isText && last.sameMarkup(first)) {
            content[content.length - 1] = last.withText(last.text + first.text);
            i = 1;
        }
        for (; i < other.content.length; i++)
            content.push(other.content[i]);
        return new Fragment(content, this.size + other.size);
    }
    /**
    Cut out the sub-fragment between the two given positions.
    */
    cut(from, to = this.size) {
        if (from == 0 && to == this.size)
            return this;
        let result = [], size = 0;
        if (to > from)
            for (let i = 0, pos = 0; pos < to; i++) {
                let child = this.content[i], end = pos + child.nodeSize;
                if (end > from) {
                    if (pos < from || end > to) {
                        if (child.isText)
                            child = child.cut(Math.max(0, from - pos), Math.min(child.text.length, to - pos));
                        else
                            child = child.cut(Math.max(0, from - pos - 1), Math.min(child.content.size, to - pos - 1));
                    }
                    result.push(child);
                    size += child.nodeSize;
                }
                pos = end;
            }
        return new Fragment(result, size);
    }
    /**
    @internal
    */
    cutByIndex(from, to) {
        if (from == to)
            return Fragment.empty;
        if (from == 0 && to == this.content.length)
            return this;
        return new Fragment(this.content.slice(from, to));
    }
    /**
    Create a new fragment in which the node at the given index is
    replaced by the given node.
    */
    replaceChild(index, node) {
        let current = this.content[index];
        if (current == node)
            return this;
        let copy = this.content.slice();
        let size = this.size + node.nodeSize - current.nodeSize;
        copy[index] = node;
        return new Fragment(copy, size);
    }
    /**
    Create a new fragment by prepending the given node to this
    fragment.
    */
    addToStart(node) {
        return new Fragment([node].concat(this.content), this.size + node.nodeSize);
    }
    /**
    Create a new fragment by appending the given node to this
    fragment.
    */
    addToEnd(node) {
        return new Fragment(this.content.concat(node), this.size + node.nodeSize);
    }
    /**
    Compare this fragment to another one.
    */
    eq(other) {
        if (this.content.length != other.content.length)
            return false;
        for (let i = 0; i < this.content.length; i++)
            if (!this.content[i].eq(other.content[i]))
                return false;
        return true;
    }
    /**
    The first child of the fragment, or `null` if it is empty.
    */
    get firstChild() { return this.content.length ? this.content[0] : null; }
    /**
    The last child of the fragment, or `null` if it is empty.
    */
    get lastChild() { return this.content.length ? this.content[this.content.length - 1] : null; }
    /**
    The number of child nodes in this fragment.
    */
    get childCount() { return this.content.length; }
    /**
    Get the child node at the given index. Raise an error when the
    index is out of range.
    */
    child(index) {
        let found = this.content[index];
        if (!found)
            throw new RangeError("Index " + index + " out of range for " + this);
        return found;
    }
    /**
    Get the child node at the given index, if it exists.
    */
    maybeChild(index) {
        return this.content[index] || null;
    }
    /**
    Call `f` for every child node, passing the node, its offset
    into this parent node, and its index.
    */
    forEach(f) {
        for (let i = 0, p = 0; i < this.content.length; i++) {
            let child = this.content[i];
            f(child, p, i);
            p += child.nodeSize;
        }
    }
    /**
    Find the first position at which this fragment and another
    fragment differ, or `null` if they are the same.
    */
    findDiffStart(other, pos = 0) {
        return findDiffStart(this, other, pos);
    }
    /**
    Find the first position, searching from the end, at which this
    fragment and the given fragment differ, or `null` if they are
    the same. Since this position will not be the same in both
    nodes, an object with two separate positions is returned.
    */
    findDiffEnd(other, pos = this.size, otherPos = other.size) {
        return findDiffEnd(this, other, pos, otherPos);
    }
    /**
    Find the index and inner offset corresponding to a given relative
    position in this fragment. The result object will be reused
    (overwritten) the next time the function is called. @internal
    */
    findIndex(pos) {
        if (pos == 0)
            return retIndex(0, pos);
        if (pos == this.size)
            return retIndex(this.content.length, pos);
        if (pos > this.size || pos < 0)
            throw new RangeError(`Position ${pos} outside of fragment (${this})`);
        for (let i = 0, curPos = 0;; i++) {
            let cur = this.child(i), end = curPos + cur.nodeSize;
            if (end >= pos) {
                if (end == pos)
                    return retIndex(i + 1, end);
                return retIndex(i, curPos);
            }
            curPos = end;
        }
    }
    /**
    Return a debugging string that describes this fragment.
    */
    toString() { return "<" + this.toStringInner() + ">"; }
    /**
    @internal
    */
    toStringInner() { return this.content.join(", "); }
    /**
    Create a JSON-serializeable representation of this fragment.
    */
    toJSON() {
        return this.content.length ? this.content.map(n => n.toJSON()) : null;
    }
    /**
    Deserialize a fragment from its JSON representation.
    */
    static fromJSON(schema, value) {
        if (!value)
            return Fragment.empty;
        if (!Array.isArray(value))
            throw new RangeError("Invalid input for Fragment.fromJSON");
        return new Fragment(value.map(schema.nodeFromJSON));
    }
    /**
    Build a fragment from an array of nodes. Ensures that adjacent
    text nodes with the same marks are joined together.
    */
    static fromArray(array) {
        if (!array.length)
            return Fragment.empty;
        let joined, size = 0;
        for (let i = 0; i < array.length; i++) {
            let node = array[i];
            size += node.nodeSize;
            if (i && node.isText && array[i - 1].sameMarkup(node)) {
                if (!joined)
                    joined = array.slice(0, i);
                joined[joined.length - 1] = node
                    .withText(joined[joined.length - 1].text + node.text);
            }
            else if (joined) {
                joined.push(node);
            }
        }
        return new Fragment(joined || array, size);
    }
    /**
    Create a fragment from something that can be interpreted as a
    set of nodes. For `null`, it returns the empty fragment. For a
    fragment, the fragment itself. For a node or array of nodes, a
    fragment containing those nodes.
    */
    static from(nodes) {
        if (!nodes)
            return Fragment.empty;
        if (nodes instanceof Fragment)
            return nodes;
        if (Array.isArray(nodes))
            return this.fromArray(nodes);
        if (nodes.attrs)
            return new Fragment([nodes], nodes.nodeSize);
        throw new RangeError("Can not convert " + nodes + " to a Fragment" +
            (nodes.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
    }
}
/**
An empty fragment. Intended to be reused whenever a node doesn't
contain anything (rather than allocating a new empty fragment for
each leaf node).
*/
Fragment.empty = new Fragment([], 0);
const found = { index: 0, offset: 0 };
function retIndex(index, offset) {
    found.index = index;
    found.offset = offset;
    return found;
}

/**
Error type raised by [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) when
given an invalid replacement.
*/
class ReplaceError extends Error {
}
/*
ReplaceError = function(this: any, message: string) {
  let err = Error.call(this, message)
  ;(err as any).__proto__ = ReplaceError.prototype
  return err
} as any

ReplaceError.prototype = Object.create(Error.prototype)
ReplaceError.prototype.constructor = ReplaceError
ReplaceError.prototype.name = "ReplaceError"
*/
/**
A slice represents a piece cut out of a larger document. It
stores not only a fragment, but also the depth up to which nodes on
both side are ‘open’ (cut through).
*/
class Slice {
    /**
    Create a slice. When specifying a non-zero open depth, you must
    make sure that there are nodes of at least that depth at the
    appropriate side of the fragment—i.e. if the fragment is an
    empty paragraph node, `openStart` and `openEnd` can't be greater
    than 1.
    
    It is not necessary for the content of open nodes to conform to
    the schema's content constraints, though it should be a valid
    start/end/middle for such a node, depending on which sides are
    open.
    */
    constructor(
    /**
    The slice's content.
    */
    content, 
    /**
    The open depth at the start of the fragment.
    */
    openStart, 
    /**
    The open depth at the end.
    */
    openEnd) {
        this.content = content;
        this.openStart = openStart;
        this.openEnd = openEnd;
    }
    /**
    The size this slice would add when inserted into a document.
    */
    get size() {
        return this.content.size - this.openStart - this.openEnd;
    }
    /**
    @internal
    */
    insertAt(pos, fragment) {
        let content = insertInto(this.content, pos + this.openStart, fragment);
        return content && new Slice(content, this.openStart, this.openEnd);
    }
    /**
    @internal
    */
    removeBetween(from, to) {
        return new Slice(removeRange(this.content, from + this.openStart, to + this.openStart), this.openStart, this.openEnd);
    }
    /**
    Tests whether this slice is equal to another slice.
    */
    eq(other) {
        return this.content.eq(other.content) && this.openStart == other.openStart && this.openEnd == other.openEnd;
    }
    /**
    @internal
    */
    toString() {
        return this.content + "(" + this.openStart + "," + this.openEnd + ")";
    }
    /**
    Convert a slice to a JSON-serializable representation.
    */
    toJSON() {
        if (!this.content.size)
            return null;
        let json = { content: this.content.toJSON() };
        if (this.openStart > 0)
            json.openStart = this.openStart;
        if (this.openEnd > 0)
            json.openEnd = this.openEnd;
        return json;
    }
    /**
    Deserialize a slice from its JSON representation.
    */
    static fromJSON(schema, json) {
        if (!json)
            return Slice.empty;
        let openStart = json.openStart || 0, openEnd = json.openEnd || 0;
        if (typeof openStart != "number" || typeof openEnd != "number")
            throw new RangeError("Invalid input for Slice.fromJSON");
        return new Slice(Fragment.fromJSON(schema, json.content), openStart, openEnd);
    }
    /**
    Create a slice from a fragment by taking the maximum possible
    open value on both side of the fragment.
    */
    static maxOpen(fragment, openIsolating = true) {
        let openStart = 0, openEnd = 0;
        for (let n = fragment.firstChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.firstChild)
            openStart++;
        for (let n = fragment.lastChild; n && !n.isLeaf && (openIsolating || !n.type.spec.isolating); n = n.lastChild)
            openEnd++;
        return new Slice(fragment, openStart, openEnd);
    }
}
/**
The empty slice.
*/
Slice.empty = new Slice(Fragment.empty, 0, 0);
function removeRange(content, from, to) {
    let { index, offset } = content.findIndex(from), child = content.maybeChild(index);
    let { index: indexTo, offset: offsetTo } = content.findIndex(to);
    if (offset == from || child.isText) {
        if (offsetTo != to && !content.child(indexTo).isText)
            throw new RangeError("Removing non-flat range");
        return content.cut(0, from).append(content.cut(to));
    }
    if (index != indexTo)
        throw new RangeError("Removing non-flat range");
    return content.replaceChild(index, child.copy(removeRange(child.content, from - offset - 1, to - offset - 1)));
}
function insertInto(content, dist, insert, parent) {
    let { index, offset } = content.findIndex(dist), child = content.maybeChild(index);
    if (offset == dist || child.isText) {
        if (parent && !parent.canReplace(index, index, insert))
            return null;
        return content.cut(0, dist).append(insert).append(content.cut(dist));
    }
    let inner = insertInto(child.content, dist - offset - 1, insert, child);
    return inner && content.replaceChild(index, child.copy(inner));
}

// Recovery values encode a range index and an offset. They are
// represented as numbers, because tons of them will be created when
// mapping, for example, a large number of decorations. The number's
// lower 16 bits provide the index, the remaining bits the offset.
//
// Note: We intentionally don't use bit shift operators to en- and
// decode these, since those clip to 32 bits, which we might in rare
// cases want to overflow. A 64-bit float can represent 48-bit
// integers precisely.
const lower16 = 0xffff;
const factor16 = Math.pow(2, 16);
function makeRecover(index, offset) { return index + offset * factor16; }
function recoverIndex(value) { return value & lower16; }
function recoverOffset(value) { return (value - (value & lower16)) / factor16; }
const DEL_BEFORE = 1, DEL_AFTER = 2, DEL_ACROSS = 4, DEL_SIDE = 8;
/**
An object representing a mapped position with extra
information.
*/
class MapResult {
    /**
    @internal
    */
    constructor(
    /**
    The mapped version of the position.
    */
    pos, 
    /**
    @internal
    */
    delInfo, 
    /**
    @internal
    */
    recover) {
        this.pos = pos;
        this.delInfo = delInfo;
        this.recover = recover;
    }
    /**
    Tells you whether the position was deleted, that is, whether the
    step removed the token on the side queried (via the `assoc`)
    argument from the document.
    */
    get deleted() { return (this.delInfo & DEL_SIDE) > 0; }
    /**
    Tells you whether the token before the mapped position was deleted.
    */
    get deletedBefore() { return (this.delInfo & (DEL_BEFORE | DEL_ACROSS)) > 0; }
    /**
    True when the token after the mapped position was deleted.
    */
    get deletedAfter() { return (this.delInfo & (DEL_AFTER | DEL_ACROSS)) > 0; }
    /**
    Tells whether any of the steps mapped through deletes across the
    position (including both the token before and after the
    position).
    */
    get deletedAcross() { return (this.delInfo & DEL_ACROSS) > 0; }
}
/**
A map describing the deletions and insertions made by a step, which
can be used to find the correspondence between positions in the
pre-step version of a document and the same position in the
post-step version.
*/
class StepMap {
    /**
    Create a position map. The modifications to the document are
    represented as an array of numbers, in which each group of three
    represents a modified chunk as `[start, oldSize, newSize]`.
    */
    constructor(
    /**
    @internal
    */
    ranges, 
    /**
    @internal
    */
    inverted = false) {
        this.ranges = ranges;
        this.inverted = inverted;
        if (!ranges.length && StepMap.empty)
            return StepMap.empty;
    }
    /**
    @internal
    */
    recover(value) {
        let diff = 0, index = recoverIndex(value);
        if (!this.inverted)
            for (let i = 0; i < index; i++)
                diff += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
        return this.ranges[index * 3] + diff + recoverOffset(value);
    }
    mapResult(pos, assoc = 1) { return this._map(pos, assoc, false); }
    map(pos, assoc = 1) { return this._map(pos, assoc, true); }
    /**
    @internal
    */
    _map(pos, assoc, simple) {
        let diff = 0, oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
        for (let i = 0; i < this.ranges.length; i += 3) {
            let start = this.ranges[i] - (this.inverted ? diff : 0);
            if (start > pos)
                break;
            let oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex], end = start + oldSize;
            if (pos <= end) {
                let side = !oldSize ? assoc : pos == start ? -1 : pos == end ? 1 : assoc;
                let result = start + diff + (side < 0 ? 0 : newSize);
                if (simple)
                    return result;
                let recover = pos == (assoc < 0 ? start : end) ? null : makeRecover(i / 3, pos - start);
                let del = pos == start ? DEL_AFTER : pos == end ? DEL_BEFORE : DEL_ACROSS;
                if (assoc < 0 ? pos != start : pos != end)
                    del |= DEL_SIDE;
                return new MapResult(result, del, recover);
            }
            diff += newSize - oldSize;
        }
        return simple ? pos + diff : new MapResult(pos + diff, 0, null);
    }
    /**
    @internal
    */
    touches(pos, recover) {
        let diff = 0, index = recoverIndex(recover);
        let oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
        for (let i = 0; i < this.ranges.length; i += 3) {
            let start = this.ranges[i] - (this.inverted ? diff : 0);
            if (start > pos)
                break;
            let oldSize = this.ranges[i + oldIndex], end = start + oldSize;
            if (pos <= end && i == index * 3)
                return true;
            diff += this.ranges[i + newIndex] - oldSize;
        }
        return false;
    }
    /**
    Calls the given function on each of the changed ranges included in
    this map.
    */
    forEach(f) {
        let oldIndex = this.inverted ? 2 : 1, newIndex = this.inverted ? 1 : 2;
        for (let i = 0, diff = 0; i < this.ranges.length; i += 3) {
            let start = this.ranges[i], oldStart = start - (this.inverted ? diff : 0), newStart = start + (this.inverted ? 0 : diff);
            let oldSize = this.ranges[i + oldIndex], newSize = this.ranges[i + newIndex];
            f(oldStart, oldStart + oldSize, newStart, newStart + newSize);
            diff += newSize - oldSize;
        }
    }
    /**
    Create an inverted version of this map. The result can be used to
    map positions in the post-step document to the pre-step document.
    */
    invert() {
        return new StepMap(this.ranges, !this.inverted);
    }
    /**
    @internal
    */
    toString() {
        return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
    }
    /**
    Create a map that moves all positions by offset `n` (which may be
    negative). This can be useful when applying steps meant for a
    sub-document to a larger document, or vice-versa.
    */
    static offset(n) {
        return n == 0 ? StepMap.empty : new StepMap(n < 0 ? [0, -n, 0] : [0, 0, n]);
    }
}
/**
A StepMap that contains no changed ranges.
*/
StepMap.empty = new StepMap([]);

const stepsByID = Object.create(null);
/**
A step object represents an atomic change. It generally applies
only to the document it was created for, since the positions
stored in it will only make sense for that document.

New steps are defined by creating classes that extend `Step`,
overriding the `apply`, `invert`, `map`, `getMap` and `fromJSON`
methods, and registering your class with a unique
JSON-serialization identifier using
[`Step.jsonID`](https://prosemirror.net/docs/ref/#transform.Step^jsonID).
*/
class Step {
    /**
    Get the step map that represents the changes made by this step,
    and which can be used to transform between positions in the old
    and the new document.
    */
    getMap() { return StepMap.empty; }
    /**
    Try to merge this step with another one, to be applied directly
    after it. Returns the merged step when possible, null if the
    steps can't be merged.
    */
    merge(other) { return null; }
    /**
    Deserialize a step from its JSON representation. Will call
    through to the step class' own implementation of this method.
    */
    static fromJSON(schema, json) {
        if (!json || !json.stepType)
            throw new RangeError("Invalid input for Step.fromJSON");
        let type = stepsByID[json.stepType];
        if (!type)
            throw new RangeError(`No step type ${json.stepType} defined`);
        return type.fromJSON(schema, json);
    }
    /**
    To be able to serialize steps to JSON, each step needs a string
    ID to attach to its JSON representation. Use this method to
    register an ID for your step classes. Try to pick something
    that's unlikely to clash with steps from other modules.
    */
    static jsonID(id, stepClass) {
        if (id in stepsByID)
            throw new RangeError("Duplicate use of step JSON ID " + id);
        stepsByID[id] = stepClass;
        stepClass.prototype.jsonID = id;
        return stepClass;
    }
}
/**
The result of [applying](https://prosemirror.net/docs/ref/#transform.Step.apply) a step. Contains either a
new document or a failure value.
*/
class StepResult {
    /**
    @internal
    */
    constructor(
    /**
    The transformed document, if successful.
    */
    doc, 
    /**
    The failure message, if unsuccessful.
    */
    failed) {
        this.doc = doc;
        this.failed = failed;
    }
    /**
    Create a successful step result.
    */
    static ok(doc) { return new StepResult(doc, null); }
    /**
    Create a failed step result.
    */
    static fail(message) { return new StepResult(null, message); }
    /**
    Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
    arguments. Create a successful result if it succeeds, and a
    failed one if it throws a `ReplaceError`.
    */
    static fromReplace(doc, from, to, slice) {
        try {
            return StepResult.ok(doc.replace(from, to, slice));
        }
        catch (e) {
            if (e instanceof ReplaceError)
                return StepResult.fail(e.message);
            throw e;
        }
    }
}

function mapFragment(fragment, f, parent) {
    let mapped = [];
    for (let i = 0; i < fragment.childCount; i++) {
        let child = fragment.child(i);
        if (child.content.size)
            child = child.copy(mapFragment(child.content, f, child));
        if (child.isInline)
            child = f(child, parent, i);
        mapped.push(child);
    }
    return Fragment.fromArray(mapped);
}
/**
Add a mark to all inline content between two positions.
*/
class AddMarkStep extends Step {
    /**
    Create a mark step.
    */
    constructor(
    /**
    The start of the marked range.
    */
    from, 
    /**
    The end of the marked range.
    */
    to, 
    /**
    The mark to add.
    */
    mark) {
        super();
        this.from = from;
        this.to = to;
        this.mark = mark;
    }
    apply(doc) {
        let oldSlice = doc.slice(this.from, this.to), $from = doc.resolve(this.from);
        let parent = $from.node($from.sharedDepth(this.to));
        let slice = new Slice(mapFragment(oldSlice.content, (node, parent) => {
            if (!node.isAtom || !parent.type.allowsMarkType(this.mark.type))
                return node;
            return node.mark(this.mark.addToSet(node.marks));
        }, parent), oldSlice.openStart, oldSlice.openEnd);
        return StepResult.fromReplace(doc, this.from, this.to, slice);
    }
    invert() {
        return new RemoveMarkStep(this.from, this.to, this.mark);
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        if (from.deleted && to.deleted || from.pos >= to.pos)
            return null;
        return new AddMarkStep(from.pos, to.pos, this.mark);
    }
    merge(other) {
        if (other instanceof AddMarkStep &&
            other.mark.eq(this.mark) &&
            this.from <= other.to && this.to >= other.from)
            return new AddMarkStep(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
        return null;
    }
    toJSON() {
        return { stepType: "addMark", mark: this.mark.toJSON(),
            from: this.from, to: this.to };
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number")
            throw new RangeError("Invalid input for AddMarkStep.fromJSON");
        return new AddMarkStep(json.from, json.to, schema.markFromJSON(json.mark));
    }
}
Step.jsonID("addMark", AddMarkStep);
/**
Remove a mark from all inline content between two positions.
*/
class RemoveMarkStep extends Step {
    /**
    Create a mark-removing step.
    */
    constructor(
    /**
    The start of the unmarked range.
    */
    from, 
    /**
    The end of the unmarked range.
    */
    to, 
    /**
    The mark to remove.
    */
    mark) {
        super();
        this.from = from;
        this.to = to;
        this.mark = mark;
    }
    apply(doc) {
        let oldSlice = doc.slice(this.from, this.to);
        let slice = new Slice(mapFragment(oldSlice.content, node => {
            return node.mark(this.mark.removeFromSet(node.marks));
        }, doc), oldSlice.openStart, oldSlice.openEnd);
        return StepResult.fromReplace(doc, this.from, this.to, slice);
    }
    invert() {
        return new AddMarkStep(this.from, this.to, this.mark);
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        if (from.deleted && to.deleted || from.pos >= to.pos)
            return null;
        return new RemoveMarkStep(from.pos, to.pos, this.mark);
    }
    merge(other) {
        if (other instanceof RemoveMarkStep &&
            other.mark.eq(this.mark) &&
            this.from <= other.to && this.to >= other.from)
            return new RemoveMarkStep(Math.min(this.from, other.from), Math.max(this.to, other.to), this.mark);
        return null;
    }
    toJSON() {
        return { stepType: "removeMark", mark: this.mark.toJSON(),
            from: this.from, to: this.to };
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number")
            throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
        return new RemoveMarkStep(json.from, json.to, schema.markFromJSON(json.mark));
    }
}
Step.jsonID("removeMark", RemoveMarkStep);
/**
Add a mark to a specific node.
*/
class AddNodeMarkStep extends Step {
    /**
    Create a node mark step.
    */
    constructor(
    /**
    The position of the target node.
    */
    pos, 
    /**
    The mark to add.
    */
    mark) {
        super();
        this.pos = pos;
        this.mark = mark;
    }
    apply(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node)
            return StepResult.fail("No node at mark step's position");
        let updated = node.type.create(node.attrs, null, this.mark.addToSet(node.marks));
        return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1));
    }
    invert(doc) {
        let node = doc.nodeAt(this.pos);
        if (node) {
            let newSet = this.mark.addToSet(node.marks);
            if (newSet.length == node.marks.length) {
                for (let i = 0; i < node.marks.length; i++)
                    if (!node.marks[i].isInSet(newSet))
                        return new AddNodeMarkStep(this.pos, node.marks[i]);
                return new AddNodeMarkStep(this.pos, this.mark);
            }
        }
        return new RemoveNodeMarkStep(this.pos, this.mark);
    }
    map(mapping) {
        let pos = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new AddNodeMarkStep(pos.pos, this.mark);
    }
    toJSON() {
        return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.pos != "number")
            throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
        return new AddNodeMarkStep(json.pos, schema.markFromJSON(json.mark));
    }
}
Step.jsonID("addNodeMark", AddNodeMarkStep);
/**
Remove a mark from a specific node.
*/
class RemoveNodeMarkStep extends Step {
    /**
    Create a mark-removing step.
    */
    constructor(
    /**
    The position of the target node.
    */
    pos, 
    /**
    The mark to remove.
    */
    mark) {
        super();
        this.pos = pos;
        this.mark = mark;
    }
    apply(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node)
            return StepResult.fail("No node at mark step's position");
        let updated = node.type.create(node.attrs, null, this.mark.removeFromSet(node.marks));
        return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1));
    }
    invert(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node || !this.mark.isInSet(node.marks))
            return this;
        return new AddNodeMarkStep(this.pos, this.mark);
    }
    map(mapping) {
        let pos = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new RemoveNodeMarkStep(pos.pos, this.mark);
    }
    toJSON() {
        return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.pos != "number")
            throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
        return new RemoveNodeMarkStep(json.pos, schema.markFromJSON(json.mark));
    }
}
Step.jsonID("removeNodeMark", RemoveNodeMarkStep);

/**
Replace a part of the document with a slice of new content.
*/
class ReplaceStep extends Step {
    /**
    The given `slice` should fit the 'gap' between `from` and
    `to`—the depths must line up, and the surrounding nodes must be
    able to be joined with the open sides of the slice. When
    `structure` is true, the step will fail if the content between
    from and to is not just a sequence of closing and then opening
    tokens (this is to guard against rebased replace steps
    overwriting something they weren't supposed to).
    */
    constructor(
    /**
    The start position of the replaced range.
    */
    from, 
    /**
    The end position of the replaced range.
    */
    to, 
    /**
    The slice to insert.
    */
    slice, 
    /**
    @internal
    */
    structure = false) {
        super();
        this.from = from;
        this.to = to;
        this.slice = slice;
        this.structure = structure;
    }
    apply(doc) {
        if (this.structure && contentBetween(doc, this.from, this.to))
            return StepResult.fail("Structure replace would overwrite content");
        return StepResult.fromReplace(doc, this.from, this.to, this.slice);
    }
    getMap() {
        return new StepMap([this.from, this.to - this.from, this.slice.size]);
    }
    invert(doc) {
        return new ReplaceStep(this.from, this.from + this.slice.size, doc.slice(this.from, this.to));
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        if (from.deletedAcross && to.deletedAcross)
            return null;
        return new ReplaceStep(from.pos, Math.max(from.pos, to.pos), this.slice, this.structure);
    }
    merge(other) {
        if (!(other instanceof ReplaceStep) || other.structure || this.structure)
            return null;
        if (this.from + this.slice.size == other.from && !this.slice.openEnd && !other.slice.openStart) {
            let slice = this.slice.size + other.slice.size == 0 ? Slice.empty
                : new Slice(this.slice.content.append(other.slice.content), this.slice.openStart, other.slice.openEnd);
            return new ReplaceStep(this.from, this.to + (other.to - other.from), slice, this.structure);
        }
        else if (other.to == this.from && !this.slice.openStart && !other.slice.openEnd) {
            let slice = this.slice.size + other.slice.size == 0 ? Slice.empty
                : new Slice(other.slice.content.append(this.slice.content), other.slice.openStart, this.slice.openEnd);
            return new ReplaceStep(other.from, this.to, slice, this.structure);
        }
        else {
            return null;
        }
    }
    toJSON() {
        let json = { stepType: "replace", from: this.from, to: this.to };
        if (this.slice.size)
            json.slice = this.slice.toJSON();
        if (this.structure)
            json.structure = true;
        return json;
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number")
            throw new RangeError("Invalid input for ReplaceStep.fromJSON");
        return new ReplaceStep(json.from, json.to, Slice.fromJSON(schema, json.slice), !!json.structure);
    }
}
Step.jsonID("replace", ReplaceStep);
/**
Replace a part of the document with a slice of content, but
preserve a range of the replaced content by moving it into the
slice.
*/
class ReplaceAroundStep extends Step {
    /**
    Create a replace-around step with the given range and gap.
    `insert` should be the point in the slice into which the content
    of the gap should be moved. `structure` has the same meaning as
    it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
    */
    constructor(
    /**
    The start position of the replaced range.
    */
    from, 
    /**
    The end position of the replaced range.
    */
    to, 
    /**
    The start of preserved range.
    */
    gapFrom, 
    /**
    The end of preserved range.
    */
    gapTo, 
    /**
    The slice to insert.
    */
    slice, 
    /**
    The position in the slice where the preserved range should be
    inserted.
    */
    insert, 
    /**
    @internal
    */
    structure = false) {
        super();
        this.from = from;
        this.to = to;
        this.gapFrom = gapFrom;
        this.gapTo = gapTo;
        this.slice = slice;
        this.insert = insert;
        this.structure = structure;
    }
    apply(doc) {
        if (this.structure && (contentBetween(doc, this.from, this.gapFrom) ||
            contentBetween(doc, this.gapTo, this.to)))
            return StepResult.fail("Structure gap-replace would overwrite content");
        let gap = doc.slice(this.gapFrom, this.gapTo);
        if (gap.openStart || gap.openEnd)
            return StepResult.fail("Gap is not a flat range");
        let inserted = this.slice.insertAt(this.insert, gap.content);
        if (!inserted)
            return StepResult.fail("Content does not fit in gap");
        return StepResult.fromReplace(doc, this.from, this.to, inserted);
    }
    getMap() {
        return new StepMap([this.from, this.gapFrom - this.from, this.insert,
            this.gapTo, this.to - this.gapTo, this.slice.size - this.insert]);
    }
    invert(doc) {
        let gap = this.gapTo - this.gapFrom;
        return new ReplaceAroundStep(this.from, this.from + this.slice.size + gap, this.from + this.insert, this.from + this.insert + gap, doc.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
    }
    map(mapping) {
        let from = mapping.mapResult(this.from, 1), to = mapping.mapResult(this.to, -1);
        let gapFrom = this.from == this.gapFrom ? from.pos : mapping.map(this.gapFrom, -1);
        let gapTo = this.to == this.gapTo ? to.pos : mapping.map(this.gapTo, 1);
        if ((from.deletedAcross && to.deletedAcross) || gapFrom < from.pos || gapTo > to.pos)
            return null;
        return new ReplaceAroundStep(from.pos, to.pos, gapFrom, gapTo, this.slice, this.insert, this.structure);
    }
    toJSON() {
        let json = { stepType: "replaceAround", from: this.from, to: this.to,
            gapFrom: this.gapFrom, gapTo: this.gapTo, insert: this.insert };
        if (this.slice.size)
            json.slice = this.slice.toJSON();
        if (this.structure)
            json.structure = true;
        return json;
    }
    /**
    @internal
    */
    static fromJSON(schema, json) {
        if (typeof json.from != "number" || typeof json.to != "number" ||
            typeof json.gapFrom != "number" || typeof json.gapTo != "number" || typeof json.insert != "number")
            throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
        return new ReplaceAroundStep(json.from, json.to, json.gapFrom, json.gapTo, Slice.fromJSON(schema, json.slice), json.insert, !!json.structure);
    }
}
Step.jsonID("replaceAround", ReplaceAroundStep);
function contentBetween(doc, from, to) {
    let $from = doc.resolve(from), dist = to - from, depth = $from.depth;
    while (dist > 0 && depth > 0 && $from.indexAfter(depth) == $from.node(depth).childCount) {
        depth--;
        dist--;
    }
    if (dist > 0) {
        let next = $from.node(depth).maybeChild($from.indexAfter(depth));
        while (dist > 0) {
            if (!next || next.isLeaf)
                return true;
            next = next.firstChild;
            dist--;
        }
    }
    return false;
}

/**
Update an attribute in a specific node.
*/
class AttrStep extends Step {
    /**
    Construct an attribute step.
    */
    constructor(
    /**
    The position of the target node.
    */
    pos, 
    /**
    The attribute to set.
    */
    attr, 
    // The attribute's new value.
    value) {
        super();
        this.pos = pos;
        this.attr = attr;
        this.value = value;
    }
    apply(doc) {
        let node = doc.nodeAt(this.pos);
        if (!node)
            return StepResult.fail("No node at attribute step's position");
        let attrs = Object.create(null);
        for (let name in node.attrs)
            attrs[name] = node.attrs[name];
        attrs[this.attr] = this.value;
        let updated = node.type.create(attrs, null, node.marks);
        return StepResult.fromReplace(doc, this.pos, this.pos + 1, new Slice(Fragment.from(updated), 0, node.isLeaf ? 0 : 1));
    }
    getMap() {
        return StepMap.empty;
    }
    invert(doc) {
        return new AttrStep(this.pos, this.attr, doc.nodeAt(this.pos).attrs[this.attr]);
    }
    map(mapping) {
        let pos = mapping.mapResult(this.pos, 1);
        return pos.deletedAfter ? null : new AttrStep(pos.pos, this.attr, this.value);
    }
    toJSON() {
        return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
    }
    static fromJSON(schema, json) {
        if (typeof json.pos != "number" || typeof json.attr != "string")
            throw new RangeError("Invalid input for AttrStep.fromJSON");
        return new AttrStep(json.pos, json.attr, json.value);
    }
}
Step.jsonID("attr", AttrStep);
/**
Update an attribute in the doc node.
*/
class DocAttrStep extends Step {
    /**
    Construct an attribute step.
    */
    constructor(
    /**
    The attribute to set.
    */
    attr, 
    // The attribute's new value.
    value) {
        super();
        this.attr = attr;
        this.value = value;
    }
    apply(doc) {
        let attrs = Object.create(null);
        for (let name in doc.attrs)
            attrs[name] = doc.attrs[name];
        attrs[this.attr] = this.value;
        let updated = doc.type.create(attrs, doc.content, doc.marks);
        return StepResult.ok(updated);
    }
    getMap() {
        return StepMap.empty;
    }
    invert(doc) {
        return new DocAttrStep(this.attr, doc.attrs[this.attr]);
    }
    map(mapping) {
        return this;
    }
    toJSON() {
        return { stepType: "docAttr", attr: this.attr, value: this.value };
    }
    static fromJSON(schema, json) {
        if (typeof json.attr != "string")
            throw new RangeError("Invalid input for DocAttrStep.fromJSON");
        return new DocAttrStep(json.attr, json.value);
    }
}
Step.jsonID("docAttr", DocAttrStep);

/**
@internal
*/
let TransformError = class extends Error {
};
TransformError = function TransformError(message) {
    let err = Error.call(this, message);
    err.__proto__ = TransformError.prototype;
    return err;
};
TransformError.prototype = Object.create(Error.prototype);
TransformError.prototype.constructor = TransformError;
TransformError.prototype.name = "TransformError";

const classesById = Object.create(null);
/**
Superclass for editor selections. Every selection type should
extend this. Should not be instantiated directly.
*/
class Selection {
    /**
    Initialize a selection with the head and anchor and ranges. If no
    ranges are given, constructs a single range across `$anchor` and
    `$head`.
    */
    constructor(
    /**
    The resolved anchor of the selection (the side that stays in
    place when the selection is modified).
    */
    $anchor, 
    /**
    The resolved head of the selection (the side that moves when
    the selection is modified).
    */
    $head, ranges) {
        this.$anchor = $anchor;
        this.$head = $head;
        this.ranges = ranges || [new SelectionRange($anchor.min($head), $anchor.max($head))];
    }
    /**
    The selection's anchor, as an unresolved position.
    */
    get anchor() { return this.$anchor.pos; }
    /**
    The selection's head.
    */
    get head() { return this.$head.pos; }
    /**
    The lower bound of the selection's main range.
    */
    get from() { return this.$from.pos; }
    /**
    The upper bound of the selection's main range.
    */
    get to() { return this.$to.pos; }
    /**
    The resolved lower  bound of the selection's main range.
    */
    get $from() {
        return this.ranges[0].$from;
    }
    /**
    The resolved upper bound of the selection's main range.
    */
    get $to() {
        return this.ranges[0].$to;
    }
    /**
    Indicates whether the selection contains any content.
    */
    get empty() {
        let ranges = this.ranges;
        for (let i = 0; i < ranges.length; i++)
            if (ranges[i].$from.pos != ranges[i].$to.pos)
                return false;
        return true;
    }
    /**
    Get the content of this selection as a slice.
    */
    content() {
        return this.$from.doc.slice(this.from, this.to, true);
    }
    /**
    Replace the selection with a slice or, if no slice is given,
    delete the selection. Will append to the given transaction.
    */
    replace(tr, content = Slice.empty) {
        // Put the new selection at the position after the inserted
        // content. When that ended in an inline node, search backwards,
        // to get the position after that node. If not, search forward.
        let lastNode = content.content.lastChild, lastParent = null;
        for (let i = 0; i < content.openEnd; i++) {
            lastParent = lastNode;
            lastNode = lastNode.lastChild;
        }
        let mapFrom = tr.steps.length, ranges = this.ranges;
        for (let i = 0; i < ranges.length; i++) {
            let { $from, $to } = ranges[i], mapping = tr.mapping.slice(mapFrom);
            tr.replaceRange(mapping.map($from.pos), mapping.map($to.pos), i ? Slice.empty : content);
            if (i == 0)
                selectionToInsertionEnd(tr, mapFrom, (lastNode ? lastNode.isInline : lastParent && lastParent.isTextblock) ? -1 : 1);
        }
    }
    /**
    Replace the selection with the given node, appending the changes
    to the given transaction.
    */
    replaceWith(tr, node) {
        let mapFrom = tr.steps.length, ranges = this.ranges;
        for (let i = 0; i < ranges.length; i++) {
            let { $from, $to } = ranges[i], mapping = tr.mapping.slice(mapFrom);
            let from = mapping.map($from.pos), to = mapping.map($to.pos);
            if (i) {
                tr.deleteRange(from, to);
            }
            else {
                tr.replaceRangeWith(from, to, node);
                selectionToInsertionEnd(tr, mapFrom, node.isInline ? -1 : 1);
            }
        }
    }
    /**
    Find a valid cursor or leaf node selection starting at the given
    position and searching back if `dir` is negative, and forward if
    positive. When `textOnly` is true, only consider cursor
    selections. Will return null when no valid selection position is
    found.
    */
    static findFrom($pos, dir, textOnly = false) {
        let inner = $pos.parent.inlineContent ? new TextSelection($pos)
            : findSelectionIn($pos.node(0), $pos.parent, $pos.pos, $pos.index(), dir, textOnly);
        if (inner)
            return inner;
        for (let depth = $pos.depth - 1; depth >= 0; depth--) {
            let found = dir < 0
                ? findSelectionIn($pos.node(0), $pos.node(depth), $pos.before(depth + 1), $pos.index(depth), dir, textOnly)
                : findSelectionIn($pos.node(0), $pos.node(depth), $pos.after(depth + 1), $pos.index(depth) + 1, dir, textOnly);
            if (found)
                return found;
        }
        return null;
    }
    /**
    Find a valid cursor or leaf node selection near the given
    position. Searches forward first by default, but if `bias` is
    negative, it will search backwards first.
    */
    static near($pos, bias = 1) {
        return this.findFrom($pos, bias) || this.findFrom($pos, -bias) || new AllSelection($pos.node(0));
    }
    /**
    Find the cursor or leaf node selection closest to the start of
    the given document. Will return an
    [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
    exists.
    */
    static atStart(doc) {
        return findSelectionIn(doc, doc, 0, 0, 1) || new AllSelection(doc);
    }
    /**
    Find the cursor or leaf node selection closest to the end of the
    given document.
    */
    static atEnd(doc) {
        return findSelectionIn(doc, doc, doc.content.size, doc.childCount, -1) || new AllSelection(doc);
    }
    /**
    Deserialize the JSON representation of a selection. Must be
    implemented for custom classes (as a static class method).
    */
    static fromJSON(doc, json) {
        if (!json || !json.type)
            throw new RangeError("Invalid input for Selection.fromJSON");
        let cls = classesById[json.type];
        if (!cls)
            throw new RangeError(`No selection type ${json.type} defined`);
        return cls.fromJSON(doc, json);
    }
    /**
    To be able to deserialize selections from JSON, custom selection
    classes must register themselves with an ID string, so that they
    can be disambiguated. Try to pick something that's unlikely to
    clash with classes from other modules.
    */
    static jsonID(id, selectionClass) {
        if (id in classesById)
            throw new RangeError("Duplicate use of selection JSON ID " + id);
        classesById[id] = selectionClass;
        selectionClass.prototype.jsonID = id;
        return selectionClass;
    }
    /**
    Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
    which is a value that can be mapped without having access to a
    current document, and later resolved to a real selection for a
    given document again. (This is used mostly by the history to
    track and restore old selections.) The default implementation of
    this method just converts the selection to a text selection and
    returns the bookmark for that.
    */
    getBookmark() {
        return TextSelection.between(this.$anchor, this.$head).getBookmark();
    }
}
Selection.prototype.visible = true;
/**
Represents a selected range in a document.
*/
class SelectionRange {
    /**
    Create a range.
    */
    constructor(
    /**
    The lower bound of the range.
    */
    $from, 
    /**
    The upper bound of the range.
    */
    $to) {
        this.$from = $from;
        this.$to = $to;
    }
}
let warnedAboutTextSelection = false;
function checkTextSelection($pos) {
    if (!warnedAboutTextSelection && !$pos.parent.inlineContent) {
        warnedAboutTextSelection = true;
        console["warn"]("TextSelection endpoint not pointing into a node with inline content (" + $pos.parent.type.name + ")");
    }
}
/**
A text selection represents a classical editor selection, with a
head (the moving side) and anchor (immobile side), both of which
point into textblock nodes. It can be empty (a regular cursor
position).
*/
class TextSelection extends Selection {
    /**
    Construct a text selection between the given points.
    */
    constructor($anchor, $head = $anchor) {
        checkTextSelection($anchor);
        checkTextSelection($head);
        super($anchor, $head);
    }
    /**
    Returns a resolved position if this is a cursor selection (an
    empty text selection), and null otherwise.
    */
    get $cursor() { return this.$anchor.pos == this.$head.pos ? this.$head : null; }
    map(doc, mapping) {
        let $head = doc.resolve(mapping.map(this.head));
        if (!$head.parent.inlineContent)
            return Selection.near($head);
        let $anchor = doc.resolve(mapping.map(this.anchor));
        return new TextSelection($anchor.parent.inlineContent ? $anchor : $head, $head);
    }
    replace(tr, content = Slice.empty) {
        super.replace(tr, content);
        if (content == Slice.empty) {
            let marks = this.$from.marksAcross(this.$to);
            if (marks)
                tr.ensureMarks(marks);
        }
    }
    eq(other) {
        return other instanceof TextSelection && other.anchor == this.anchor && other.head == this.head;
    }
    getBookmark() {
        return new TextBookmark(this.anchor, this.head);
    }
    toJSON() {
        return { type: "text", anchor: this.anchor, head: this.head };
    }
    /**
    @internal
    */
    static fromJSON(doc, json) {
        if (typeof json.anchor != "number" || typeof json.head != "number")
            throw new RangeError("Invalid input for TextSelection.fromJSON");
        return new TextSelection(doc.resolve(json.anchor), doc.resolve(json.head));
    }
    /**
    Create a text selection from non-resolved positions.
    */
    static create(doc, anchor, head = anchor) {
        let $anchor = doc.resolve(anchor);
        return new this($anchor, head == anchor ? $anchor : doc.resolve(head));
    }
    /**
    Return a text selection that spans the given positions or, if
    they aren't text positions, find a text selection near them.
    `bias` determines whether the method searches forward (default)
    or backwards (negative number) first. Will fall back to calling
    [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
    doesn't contain a valid text position.
    */
    static between($anchor, $head, bias) {
        let dPos = $anchor.pos - $head.pos;
        if (!bias || dPos)
            bias = dPos >= 0 ? 1 : -1;
        if (!$head.parent.inlineContent) {
            let found = Selection.findFrom($head, bias, true) || Selection.findFrom($head, -bias, true);
            if (found)
                $head = found.$head;
            else
                return Selection.near($head, bias);
        }
        if (!$anchor.parent.inlineContent) {
            if (dPos == 0) {
                $anchor = $head;
            }
            else {
                $anchor = (Selection.findFrom($anchor, -bias, true) || Selection.findFrom($anchor, bias, true)).$anchor;
                if (($anchor.pos < $head.pos) != (dPos < 0))
                    $anchor = $head;
            }
        }
        return new TextSelection($anchor, $head);
    }
}
Selection.jsonID("text", TextSelection);
class TextBookmark {
    constructor(anchor, head) {
        this.anchor = anchor;
        this.head = head;
    }
    map(mapping) {
        return new TextBookmark(mapping.map(this.anchor), mapping.map(this.head));
    }
    resolve(doc) {
        return TextSelection.between(doc.resolve(this.anchor), doc.resolve(this.head));
    }
}
/**
A node selection is a selection that points at a single node. All
nodes marked [selectable](https://prosemirror.net/docs/ref/#model.NodeSpec.selectable) can be the
target of a node selection. In such a selection, `from` and `to`
point directly before and after the selected node, `anchor` equals
`from`, and `head` equals `to`..
*/
class NodeSelection extends Selection {
    /**
    Create a node selection. Does not verify the validity of its
    argument.
    */
    constructor($pos) {
        let node = $pos.nodeAfter;
        let $end = $pos.node(0).resolve($pos.pos + node.nodeSize);
        super($pos, $end);
        this.node = node;
    }
    map(doc, mapping) {
        let { deleted, pos } = mapping.mapResult(this.anchor);
        let $pos = doc.resolve(pos);
        if (deleted)
            return Selection.near($pos);
        return new NodeSelection($pos);
    }
    content() {
        return new Slice(Fragment.from(this.node), 0, 0);
    }
    eq(other) {
        return other instanceof NodeSelection && other.anchor == this.anchor;
    }
    toJSON() {
        return { type: "node", anchor: this.anchor };
    }
    getBookmark() { return new NodeBookmark(this.anchor); }
    /**
    @internal
    */
    static fromJSON(doc, json) {
        if (typeof json.anchor != "number")
            throw new RangeError("Invalid input for NodeSelection.fromJSON");
        return new NodeSelection(doc.resolve(json.anchor));
    }
    /**
    Create a node selection from non-resolved positions.
    */
    static create(doc, from) {
        return new NodeSelection(doc.resolve(from));
    }
    /**
    Determines whether the given node may be selected as a node
    selection.
    */
    static isSelectable(node) {
        return !node.isText && node.type.spec.selectable !== false;
    }
}
NodeSelection.prototype.visible = false;
Selection.jsonID("node", NodeSelection);
class NodeBookmark {
    constructor(anchor) {
        this.anchor = anchor;
    }
    map(mapping) {
        let { deleted, pos } = mapping.mapResult(this.anchor);
        return deleted ? new TextBookmark(pos, pos) : new NodeBookmark(pos);
    }
    resolve(doc) {
        let $pos = doc.resolve(this.anchor), node = $pos.nodeAfter;
        if (node && NodeSelection.isSelectable(node))
            return new NodeSelection($pos);
        return Selection.near($pos);
    }
}
/**
A selection type that represents selecting the whole document
(which can not necessarily be expressed with a text selection, when
there are for example leaf block nodes at the start or end of the
document).
*/
class AllSelection extends Selection {
    /**
    Create an all-selection over the given document.
    */
    constructor(doc) {
        super(doc.resolve(0), doc.resolve(doc.content.size));
    }
    replace(tr, content = Slice.empty) {
        if (content == Slice.empty) {
            tr.delete(0, tr.doc.content.size);
            let sel = Selection.atStart(tr.doc);
            if (!sel.eq(tr.selection))
                tr.setSelection(sel);
        }
        else {
            super.replace(tr, content);
        }
    }
    toJSON() { return { type: "all" }; }
    /**
    @internal
    */
    static fromJSON(doc) { return new AllSelection(doc); }
    map(doc) { return new AllSelection(doc); }
    eq(other) { return other instanceof AllSelection; }
    getBookmark() { return AllBookmark; }
}
Selection.jsonID("all", AllSelection);
const AllBookmark = {
    map() { return this; },
    resolve(doc) { return new AllSelection(doc); }
};
// FIXME we'll need some awareness of text direction when scanning for selections
// Try to find a selection inside the given node. `pos` points at the
// position where the search starts. When `text` is true, only return
// text selections.
function findSelectionIn(doc, node, pos, index, dir, text = false) {
    if (node.inlineContent)
        return TextSelection.create(doc, pos);
    for (let i = index - (dir > 0 ? 0 : 1); dir > 0 ? i < node.childCount : i >= 0; i += dir) {
        let child = node.child(i);
        if (!child.isAtom) {
            let inner = findSelectionIn(doc, child, pos + dir, dir < 0 ? child.childCount : 0, dir, text);
            if (inner)
                return inner;
        }
        else if (!text && NodeSelection.isSelectable(child)) {
            return NodeSelection.create(doc, pos - (dir < 0 ? child.nodeSize : 0));
        }
        pos += child.nodeSize * dir;
    }
    return null;
}
function selectionToInsertionEnd(tr, startLen, bias) {
    let last = tr.steps.length - 1;
    if (last < startLen)
        return;
    let step = tr.steps[last];
    if (!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep))
        return;
    let map = tr.mapping.maps[last], end;
    map.forEach((_from, _to, _newFrom, newTo) => { if (end == null)
        end = newTo; });
    tr.setSelection(Selection.near(tr.doc.resolve(end), bias));
}

function bind(f, self) {
    return !self || !f ? f : f.bind(self);
}
class FieldDesc {
    constructor(name, desc, self) {
        this.name = name;
        this.init = bind(desc.init, self);
        this.apply = bind(desc.apply, self);
    }
}
[
    new FieldDesc("doc", {
        init(config) { return config.doc || config.schema.topNodeType.createAndFill(); },
        apply(tr) { return tr.doc; }
    }),
    new FieldDesc("selection", {
        init(config, instance) { return config.selection || Selection.atStart(instance.doc); },
        apply(tr) { return tr.selection; }
    }),
    new FieldDesc("storedMarks", {
        init(config) { return config.storedMarks || null; },
        apply(tr, _marks, _old, state) { return state.selection.$cursor ? tr.storedMarks : null; }
    }),
    new FieldDesc("scrollToSelection", {
        init() { return 0; },
        apply(tr, prev) { return tr.scrolledIntoView ? prev + 1 : prev; }
    })
];

function FindReplace(_a) {
    var editor = _a.editor, isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = useState(''), findText = _b[0], setFindText = _b[1];
    var _c = useState(''), replaceText = _c[0], setReplaceText = _c[1];
    var _d = useState(-1), currentMatch = _d[0], setCurrentMatch = _d[1];
    var _e = useState([]), matches = _e[0], setMatches = _e[1];
    var findInputRef = useRef(null);
    useEffect(function () {
        if (isOpen && findInputRef.current) {
            findInputRef.current.focus();
        }
    }, [isOpen]);
    var findTextInEditor = useCallback(function (searchText) {
        var _a, _b, _c, _d, _e;
        if (!editor || !searchText) {
            setMatches([]);
            setCurrentMatch(-1);
            editor === null || editor === void 0 ? void 0 : editor.chain().focus().unsetHighlight().run();
            return;
        }
        try {
            if (searchText.trim().length === 0) {
                setMatches([]);
                setCurrentMatch(-1);
                editor.chain().focus().unsetHighlight().run();
                return;
            }
            var doc = editor.state.doc;
            if (!doc || doc.content.size === 0) {
                console.warn('Document is empty or invalid');
                setMatches([]);
                setCurrentMatch(-1);
                return;
            }
            var caseInsensitive = true;
            var needle = caseInsensitive ? searchText.toLowerCase() : searchText;
            var found = [];
            try {
                var fullText_1 = '';
                var positionMap_1 = [];
                doc.descendants(function (node, pos) {
                    if (node.isText && node.text) {
                        for (var i = 0; i < node.text.length; i++) {
                            fullText_1 += node.text[i];
                            positionMap_1.push(pos + i);
                        }
                    }
                    return true;
                });
                var fullTextLower = caseInsensitive ? fullText_1.toLowerCase() : fullText_1;
                var searchIndex = 0;
                while (true) {
                    searchIndex = fullTextLower.indexOf(needle, searchIndex);
                    if (searchIndex === -1)
                        break;
                    if (searchIndex + searchText.length <= positionMap_1.length) {
                        var from = positionMap_1[searchIndex];
                        var to = positionMap_1[searchIndex + searchText.length - 1] + 1;
                        if (from >= 0 && to <= doc.content.size) {
                            found.push({ from: from, to: to });
                        }
                    }
                    searchIndex += 1;
                }
                found.sort(function (a, b) { return a.from - b.from; });
            }
            catch (traversalError) {
                console.error('Error traversing document:', traversalError);
                throw traversalError;
            }
            setMatches(found);
            setCurrentMatch(found.length > 0 ? 0 : -1);
            var state = editor.state, view = editor.view;
            var tr_1 = state.tr;
            tr_1 = tr_1.removeMark(0, state.doc.content.size, state.schema.marks.highlight);
            var highlightMark_1 = (_b = (_a = state.schema.marks.highlight) === null || _a === void 0 ? void 0 : _a.create) === null || _b === void 0 ? void 0 : _b.call(_a, { color: '#fff3c4' });
            var currentHighlightMark = (_d = (_c = state.schema.marks.highlight) === null || _c === void 0 ? void 0 : _c.create) === null || _d === void 0 ? void 0 : _d.call(_c, { color: '#ffd700' });
            if (highlightMark_1 && currentHighlightMark && found.length > 0) {
                found.forEach(function (_a) {
                    var from = _a.from, to = _a.to;
                    tr_1 = tr_1.addMark(from, to, highlightMark_1);
                });
                var _f = found[0], from = _f.from, to = _f.to;
                tr_1 = tr_1.addMark(from, to, currentHighlightMark);
                tr_1 = tr_1.setSelection(TextSelection.create(tr_1.doc, from, to));
                view.dispatch(tr_1);
                var domNode = (_e = view.domAtPos(from)) === null || _e === void 0 ? void 0 : _e.node;
                domNode === null || domNode === void 0 ? void 0 : domNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            else {
                view.dispatch(tr_1);
            }
        }
        catch (error) {
            console.error('Error in findTextInEditor:', error);
            setMatches([]);
            setCurrentMatch(-1);
            editor.chain().focus().unsetHighlight().run();
        }
    }, [editor]);
    var handleFindChange = function (e) {
        var value = e.target.value;
        setFindText(value);
        findTextInEditor(value);
    };
    var updateHighlights = useCallback(function (newCurrentMatch) {
        var _a, _b, _c, _d, _e;
        if (!editor || matches.length === 0 || newCurrentMatch < 0 || newCurrentMatch >= matches.length)
            return;
        try {
            var state = editor.state, view = editor.view;
            var tr_2 = state.tr;
            tr_2 = tr_2.removeMark(0, state.doc.content.size, state.schema.marks.highlight);
            var highlightMark_2 = (_b = (_a = state.schema.marks.highlight) === null || _a === void 0 ? void 0 : _a.create) === null || _b === void 0 ? void 0 : _b.call(_a, { color: '#fff3c4' });
            var currentHighlightMark = (_d = (_c = state.schema.marks.highlight) === null || _c === void 0 ? void 0 : _c.create) === null || _d === void 0 ? void 0 : _d.call(_c, { color: '#ffd700' });
            if (highlightMark_2 && currentHighlightMark) {
                matches.forEach(function (_a) {
                    var from = _a.from, to = _a.to;
                    tr_2 = tr_2.addMark(from, to, highlightMark_2);
                });
                var _f = matches[newCurrentMatch], from = _f.from, to = _f.to;
                tr_2 = tr_2.addMark(from, to, currentHighlightMark);
                tr_2 = tr_2.setSelection(TextSelection.create(tr_2.doc, from, to));
                view.dispatch(tr_2);
                var domNode = (_e = view.domAtPos(from)) === null || _e === void 0 ? void 0 : _e.node;
                domNode === null || domNode === void 0 ? void 0 : domNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
                editor.commands.focus();
            }
            else {
                view.dispatch(tr_2);
            }
        }
        catch (error) {
            console.error('Error in updateHighlights:', error);
        }
    }, [editor, matches]);
    var findNext = useCallback(function () {
        if (matches.length === 0 || currentMatch === -1)
            return;
        var nextMatch = (currentMatch + 1) % matches.length;
        setCurrentMatch(nextMatch);
        updateHighlights(nextMatch);
    }, [matches, currentMatch, updateHighlights]);
    var findPrevious = useCallback(function () {
        if (matches.length === 0 || currentMatch === -1)
            return;
        var prevMatch = (currentMatch - 1 + matches.length) % matches.length;
        setCurrentMatch(prevMatch);
        updateHighlights(prevMatch);
    }, [matches, currentMatch, updateHighlights]);
    var replaceCurrent = useCallback(function () {
        if (currentMatch < 0 || !editor || !findText || currentMatch >= matches.length)
            return;
        try {
            var match = matches[currentMatch];
            if (!match)
                return;
            var state = editor.state, view = editor.view;
            var tr = state.tr;
            tr = tr.replaceWith(match.from, match.to, state.schema.text(replaceText));
            tr = tr.removeMark(match.from, match.from + replaceText.length, state.schema.marks.highlight);
            view.dispatch(tr);
            findTextInEditor(findText);
            editor.commands.focus();
        }
        catch (error) {
            console.error('Error in replaceCurrent:', error);
        }
    }, [editor, findText, replaceText, currentMatch, matches, findTextInEditor]);
    var replaceAll = useCallback(function () {
        if (!editor || !findText || matches.length === 0)
            return;
        try {
            var state_1 = editor.state, view = editor.view;
            var tr_3 = state_1.tr;
            var sortedMatches = __spreadArray([], matches, true).sort(function (a, b) { return b.from - a.from; });
            sortedMatches.forEach(function (_a) {
                var from = _a.from, to = _a.to;
                tr_3 = tr_3.replaceWith(from, to, state_1.schema.text(replaceText));
            });
            tr_3 = tr_3.removeMark(0, tr_3.doc.content.size, state_1.schema.marks.highlight);
            view.dispatch(tr_3);
            setMatches([]);
            setCurrentMatch(-1);
            editor.commands.focus();
        }
        catch (error) {
            console.error('Error in replaceAll:', error);
        }
    }, [editor, matches, replaceText, findText]);
    var handleKeyDown = useCallback(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                findPrevious();
            }
            else {
                findNext();
            }
        }
        else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
        else if (e.key === 'Tab') {
            e.preventDefault();
            var inputs = document.querySelectorAll('input[type="text"]');
            var currentIndex = Array.from(inputs).indexOf(document.activeElement);
            var nextIndex = e.shiftKey ? (currentIndex - 1 + inputs.length) % inputs.length : (currentIndex + 1) % inputs.length;
            inputs[nextIndex].focus();
        }
    }, [findNext, findPrevious, onClose]);
    if (!isOpen)
        return null;
    return (React__default.createElement("div", { className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50" },
        React__default.createElement("div", { className: "bg-white p-4 rounded-lg shadow-xl w-full max-w-md z-[9999] border border-gray-200" },
            React__default.createElement("div", { className: "flex justify-between items-center mb-4" },
                React__default.createElement("h3", { className: "text-lg font-medium" }, "Find & Replace"),
                React__default.createElement("button", { onClick: function () {
                        if (editor) {
                            editor.chain().setTextSelection({ from: 0, to: editor.state.doc.content.size }).unsetHighlight().run();
                        }
                        onClose();
                    }, className: "text-gray-500 hover:text-gray-700" }, "Close")),
            React__default.createElement("div", { className: "space-y-4" },
                React__default.createElement("div", null,
                    React__default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Find"),
                    React__default.createElement("input", { ref: findInputRef, type: "text", value: findText, onChange: handleFindChange, onKeyDown: handleKeyDown, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "Find..." })),
                React__default.createElement("div", null,
                    React__default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Replace With"),
                    React__default.createElement("input", { type: "text", value: replaceText, onChange: function (e) { return setReplaceText(e.target.value); }, onKeyDown: handleKeyDown, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "Replace with..." })),
                React__default.createElement("div", { className: "flex flex-col gap-2" },
                    React__default.createElement("div", { className: "flex items-center justify-between text-sm" },
                        React__default.createElement("span", { className: "text-gray-600 font-medium" }, matches.length > 0
                            ? "".concat(currentMatch + 1, " of ").concat(matches.length, " matches")
                            : findText ? 'No matches found' : 'Type to start searching'),
                        React__default.createElement("div", { className: "text-xs text-gray-500" },
                            React__default.createElement("span", { className: "mr-4" }, "Enter: Next"),
                            React__default.createElement("span", { className: "mr-4" }, "Shift+Enter: Previous"),
                            React__default.createElement("span", null, "Tab: Switch fields"))),
                    React__default.createElement("div", { className: "flex justify-between items-center" },
                        React__default.createElement("div", { className: "flex space-x-2" },
                            React__default.createElement("button", { onClick: findPrevious, disabled: matches.length === 0, title: "Previous match (Shift+Enter)", className: "px-3 py-1.5 text-sm rounded-md transition-colors ".concat(matches.length > 0
                                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                    : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed') }, "Previous"),
                            React__default.createElement("button", { onClick: findNext, disabled: matches.length === 0, title: "Next match (Enter)", className: "px-3 py-1.5 text-sm rounded-md transition-colors ".concat(matches.length > 0
                                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                    : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed') }, "Next")),
                        React__default.createElement("div", { className: "flex space-x-2" },
                            React__default.createElement("button", { onClick: replaceCurrent, disabled: matches.length === 0, title: "Replace current match", className: "px-3 py-1.5 text-sm rounded-md transition-colors ".concat(matches.length > 0
                                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                    : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed') }, "Replace"),
                            React__default.createElement("button", { onClick: replaceAll, disabled: matches.length === 0, title: "Replace all ".concat(matches.length, " matches"), className: "px-3 py-1.5 text-sm rounded-md transition-colors ".concat(matches.length > 0
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700'
                                    : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed') },
                                "Replace All ",
                                matches.length > 0 ? "(".concat(matches.length, ")") : ''))))))));
}

function TableControls(_a) {
    var editor = _a.editor;
    var _b = useState(null), buttonPos = _b[0], setButtonPos = _b[1];
    var _c = useState(false), open = _c[0], setOpen = _c[1];
    useEffect(function () {
        var update = function () {
            if (!editor.isActive('table')) {
                setButtonPos(null);
                return;
            }
            var table = editor.view.dom.querySelector('table');
            if (!table) {
                setButtonPos(null);
                return;
            }
            var rect = table.getBoundingClientRect();
            setButtonPos({ top: rect.bottom + window.scrollY - 8, left: rect.right + window.scrollX - 8 });
        };
        update();
        window.addEventListener('scroll', update, true);
        editor.on('selectionUpdate', update);
        return function () {
            window.removeEventListener('scroll', update, true);
            editor.off('selectionUpdate', update);
        };
    }, [editor]);
    if (!buttonPos)
        return null;
    var run = function (cmd) { cmd(); setOpen(false); };
    return (React__default.createElement("div", null,
        React__default.createElement("button", { className: "fixed z-40 text-black w-6 h-6 font-bold flex items-center justify-center", style: { top: buttonPos.top, left: buttonPos.left }, onClick: function () { return setOpen(function (o) { return !o; }); }, "aria-label": "Table options" }, "+"),
        open && (React__default.createElement("div", { className: "fixed z-50 bg-white border rounded shadow p-2 text-sm", style: { top: buttonPos.top + 24, left: buttonPos.left - 160 } },
            React__default.createElement("button", { className: "block w-full text-left px-2 py-1 hover:bg-gray-100", onClick: function () { return run(function () { return editor.chain().focus().addRowAfter().run(); }); } }, "Add row below"),
            React__default.createElement("button", { className: "block w-full text-left px-2 py-1 hover:bg-gray-100", onClick: function () { return run(function () { return editor.chain().focus().addRowBefore().run(); }); } }, "Add row above"),
            React__default.createElement("button", { className: "block w-full text-left px-2 py-1 hover:bg-gray-100", onClick: function () { return run(function () { return editor.chain().focus().addColumnAfter().run(); }); } }, "Add column right"),
            React__default.createElement("button", { className: "block w-full text-left px-2 py-1 hover:bg-gray-100", onClick: function () { return run(function () { return editor.chain().focus().addColumnBefore().run(); }); } }, "Add column left")))));
}

function ImageModal(_a) {
    var isOpen = _a.isOpen, closeModal = _a.closeModal, editor = _a.editor;
    var _b = useState(""), url = _b[0], setUrl = _b[1];
    var _c = useState(""), altText = _c[0], setAltText = _c[1];
    var _d = useState(""), width = _d[0], setWidth = _d[1];
    var _e = useState(""), height = _e[0], setHeight = _e[1];
    var _f = useState(null), urlError = _f[0], setUrlError = _f[1];
    var isUploading = useState(false)[0];
    var _g = useState(null), setUploadedImage = _g[1];
    var isValidImageSrc = function (value) {
        if (!value)
            return false;
        return (value.startsWith("http://") ||
            value.startsWith("https://") ||
            value.startsWith("/") ||
            value.startsWith("data:") ||
            value.startsWith("blob:"));
    };
    var handleUrlChange = function (e) {
        setUrl(e.target.value);
        setUploadedImage(null);
        if (!e.target.value) {
            setUrlError(null);
        }
        else if (!isValidImageSrc(e.target.value)) {
            setUrlError('Enter a valid image URL starting with http(s)://, /, data:, or blob:');
        }
        else {
            setUrlError(null);
        }
    };
    var handleSubmit = function () {
        if (!url || (url && !isValidImageSrc(url))) {
            setUrlError('Please enter a valid image URL');
            return;
        }
        if (!altText) {
            return;
        }
        if (editor) {
            try {
                editor
                    .chain()
                    .focus()
                    .setImage({
                    src: url,
                    alt: altText,
                    title: altText,
                    width: width ? parseInt(width) : undefined,
                    height: height ? parseInt(height) : undefined,
                })
                    .run();
                handleReset();
                closeModal();
            }
            catch (error) {
                console.error('Error inserting image:', error);
            }
        }
    };
    var handleReset = function () {
        setUploadedImage(null);
        setUrl("");
        setAltText("");
        setWidth("");
        setHeight("");
        setUrlError(null);
    };
    if (!isOpen)
        return null;
    return (React__default.createElement("div", { className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50" },
        React__default.createElement("div", { className: "bg-white p-4 rounded-lg shadow-xl w-full max-w-md z-[9999] border border-gray-200" },
            React__default.createElement("div", { className: "flex justify-between items-center mb-4" },
                React__default.createElement("h3", { className: "text-lg font-semibold" }, "Upload Image"),
                React__default.createElement("button", { onClick: function () {
                        closeModal();
                        handleReset();
                    }, className: "text-gray-500 hover:text-gray-700" }, "Close")),
            React__default.createElement("div", { className: "space-y-4" },
                React__default.createElement("div", null,
                    React__default.createElement("div", { className: "flex justify-between items-center mb-1" },
                        React__default.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Image URL"),
                        url && (React__default.createElement("button", { onClick: function () { return setUrl(""); }, className: "text-xs text-gray-500 hover:text-red-500 transition-colors" }, "Clear"))),
                    React__default.createElement("input", { value: url, onChange: handleUrlChange, placeholder: "https://example.com/image.jpg", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" }),
                    urlError && (React__default.createElement("div", { className: "mt-1 text-xs text-red-500" }, urlError)),
                    url && (React__default.createElement("div", { className: "mt-1 text-xs text-gray-500" },
                        React__default.createElement("a", { href: url, target: "_blank", rel: "noopener noreferrer" }, "View image")))),
                React__default.createElement("div", { className: "space-y-4" },
                    React__default.createElement("div", null,
                        React__default.createElement("div", { className: "flex justify-between items-center mb-1" },
                            React__default.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Alt Text"),
                            React__default.createElement("div", { className: "text-xs text-gray-400" }, "Required")),
                        React__default.createElement("input", { value: altText, onChange: function (e) { return setAltText(e.target.value); }, placeholder: "Describe the image...", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" }),
                        React__default.createElement("div", { className: "mt-1 text-xs text-gray-500" }, "Helps accessibility and SEO")),
                    React__default.createElement("div", null,
                        React__default.createElement("div", { className: "flex justify-between items-center mb-1" },
                            React__default.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Dimensions"),
                            React__default.createElement("div", { className: "text-xs text-gray-400" }, "Optional")),
                        React__default.createElement("div", { className: "grid grid-cols-2 gap-4" },
                            React__default.createElement("input", { value: width, onChange: function (e) { return setWidth(e.target.value); }, placeholder: "Width (px)", type: "number", min: "1", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" }),
                            React__default.createElement("input", { value: height, onChange: function (e) { return setHeight(e.target.value); }, placeholder: "Height (px)", type: "number", min: "1", className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })),
                        React__default.createElement("div", { className: "mt-1 text-xs text-gray-500" }, "Leave empty to keep original size")))),
            React__default.createElement("div", { className: "flex justify-end gap-2 mt-6" },
                React__default.createElement("button", { onClick: function () {
                        closeModal();
                        handleReset();
                    }, className: "px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md" }, "Cancel"),
                React__default.createElement("button", { onClick: handleSubmit, disabled: (!!url && !isValidImageSrc(url)) || (!url) || !altText || isUploading, className: "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed" }, isUploading ? 'Uploading...' : 'Insert')))));
}

var AlignJustifyIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 18C2 17.4477 2.44772 17 3 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18Z", fill: "currentColor" })));
});
AlignJustifyIcon.displayName = "AlignJustifyIcon";

var ArrowLeftIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M12.7071 5.70711C13.0976 5.31658 13.0976 4.68342 12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289L4.29289 11.2929C3.90237 11.6834 3.90237 12.3166 4.29289 12.7071L11.2929 19.7071C11.6834 20.0976 12.3166 20.0976 12.7071 19.7071C13.0976 19.3166 13.0976 18.6834 12.7071 18.2929L7.41421 13L19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11L7.41421 11L12.7071 5.70711Z", fill: "currentColor" })));
});
ArrowLeftIcon.displayName = "ArrowLeftIcon";

var BanIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.43471 4.01458C4.34773 4.06032 4.26607 4.11977 4.19292 4.19292C4.11977 4.26607 4.06032 4.34773 4.01458 4.43471C2.14611 6.40628 1 9.0693 1 12C1 18.0751 5.92487 23 12 23C14.9306 23 17.5936 21.854 19.5651 19.9856C19.6522 19.9398 19.7339 19.8803 19.8071 19.8071C19.8803 19.7339 19.9398 19.6522 19.9856 19.5651C21.854 17.5936 23 14.9306 23 12C23 5.92487 18.0751 1 12 1C9.0693 1 6.40628 2.14611 4.43471 4.01458ZM6.38231 4.9681C7.92199 3.73647 9.87499 3 12 3C16.9706 3 21 7.02944 21 12C21 14.125 20.2635 16.078 19.0319 17.6177L6.38231 4.9681ZM17.6177 19.0319C16.078 20.2635 14.125 21 12 21C7.02944 21 3 16.9706 3 12C3 9.87499 3.73647 7.92199 4.9681 6.38231L17.6177 19.0319Z", fill: "currentColor" })));
});
BanIcon.displayName = "BanIcon";

var ChevronDownIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z", fill: "currentColor" })));
});
ChevronDownIcon.displayName = "ChevronDownIcon";

var CloseIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L12 13.4142L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L13.4142 12L18.7071 6.70711Z", fill: "currentColor" })));
});
CloseIcon.displayName = "CloseIcon";

var CodeBlockIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.70711 2.29289C7.09763 2.68342 7.09763 3.31658 6.70711 3.70711L4.41421 6L6.70711 8.29289C7.09763 8.68342 7.09763 9.31658 6.70711 9.70711C6.31658 10.0976 5.68342 10.0976 5.29289 9.70711L2.29289 6.70711C1.90237 6.31658 1.90237 5.68342 2.29289 5.29289L5.29289 2.29289C5.68342 1.90237 6.31658 1.90237 6.70711 2.29289Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M10.2929 2.29289C10.6834 1.90237 11.3166 1.90237 11.7071 2.29289L14.7071 5.29289C15.0976 5.68342 15.0976 6.31658 14.7071 6.70711L11.7071 9.70711C11.3166 10.0976 10.6834 10.0976 10.2929 9.70711C9.90237 9.31658 9.90237 8.68342 10.2929 8.29289L12.5858 6L10.2929 3.70711C9.90237 3.31658 9.90237 2.68342 10.2929 2.29289Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M17 4C17 3.44772 17.4477 3 18 3H19C20.6569 3 22 4.34315 22 6V18C22 19.6569 20.6569 21 19 21H5C3.34315 21 2 19.6569 2 18V12C2 11.4477 2.44772 11 3 11C3.55228 11 4 11.4477 4 12V18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18V6C20 5.44772 19.5523 5 19 5H18C17.4477 5 17 4.55228 17 4Z", fill: "currentColor" })));
});
CodeBlockIcon.displayName = "CodeBlockIcon";

var CornerDownLeftIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M21 4C21 3.44772 20.5523 3 20 3C19.4477 3 19 3.44772 19 4V11C19 11.7956 18.6839 12.5587 18.1213 13.1213C17.5587 13.6839 16.7956 14 16 14H6.41421L9.70711 10.7071C10.0976 10.3166 10.0976 9.68342 9.70711 9.29289C9.31658 8.90237 8.68342 8.90237 8.29289 9.29289L3.29289 14.2929C2.90237 14.6834 2.90237 15.3166 3.29289 15.7071L8.29289 20.7071C8.68342 21.0976 9.31658 21.0976 9.70711 20.7071C10.0976 20.3166 10.0976 19.6834 9.70711 19.2929L6.41421 16H16C17.3261 16 18.5979 15.4732 19.5355 14.5355C20.4732 13.5979 21 12.3261 21 11V4Z", fill: "currentColor" })));
});
CornerDownLeftIcon.displayName = "CornerDownLeftIcon";

var ExternalLinkIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M14 3C14 2.44772 14.4477 2 15 2H21C21.5523 2 22 2.44772 22 3V9C22 9.55228 21.5523 10 21 10C20.4477 10 20 9.55228 20 9V5.41421L10.7071 14.7071C10.3166 15.0976 9.68342 15.0976 9.29289 14.7071C8.90237 14.3166 8.90237 13.6834 9.29289 13.2929L18.5858 4H15C14.4477 4 14 3.55228 14 3Z", fill: "currentColor" }),
        React.createElement("path", { d: "M4.29289 7.29289C4.48043 7.10536 4.73478 7 5 7H11C11.5523 7 12 6.55228 12 6C12 5.44772 11.5523 5 11 5H5C4.20435 5 3.44129 5.31607 2.87868 5.87868C2.31607 6.44129 2 7.20435 2 8V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H16C16.7957 22 17.5587 21.6839 18.1213 21.1213C18.6839 20.5587 19 19.7957 19 19V13C19 12.4477 18.5523 12 18 12C17.4477 12 17 12.4477 17 13V19C17 19.2652 16.8946 19.5196 16.7071 19.7071C16.5196 19.8946 16.2652 20 16 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V8C4 7.73478 4.10536 7.48043 4.29289 7.29289Z", fill: "currentColor" })));
});
ExternalLinkIcon.displayName = "ExternalLinkIcon";

var HeadingFiveIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M5 6C5 5.44772 4.55228 5 4 5C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H5V6Z", fill: "currentColor" }),
        React.createElement("path", { d: "M16 10C16 9.44772 16.4477 9 17 9H21C21.5523 9 22 9.44772 22 10C22 10.5523 21.5523 11 21 11H18V12H18.3C20.2754 12 22 13.4739 22 15.5C22 17.5261 20.2754 19 18.3 19C17.6457 19 17.0925 18.8643 16.5528 18.5944C16.0588 18.3474 15.8586 17.7468 16.1055 17.2528C16.3525 16.7588 16.9532 16.5586 17.4472 16.8056C17.7074 16.9357 17.9542 17 18.3 17C19.3246 17 20 16.2739 20 15.5C20 14.7261 19.3246 14 18.3 14H17C16.4477 14 16 13.5523 16 13L16 12.9928V10Z", fill: "currentColor" })));
});
HeadingFiveIcon.displayName = "HeadingFiveIcon";

var HeadingFourIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M4 5C4.55228 5 5 5.44772 5 6V11H11V6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V13H5V18C5 18.5523 4.55228 19 4 19C3.44772 19 3 18.5523 3 18V6C3 5.44772 3.44772 5 4 5Z", fill: "currentColor" }),
        React.createElement("path", { d: "M17 9C17.5523 9 18 9.44772 18 10V13H20V10C20 9.44772 20.4477 9 21 9C21.5523 9 22 9.44772 22 10V18C22 18.5523 21.5523 19 21 19C20.4477 19 20 18.5523 20 18V15H17C16.4477 15 16 14.5523 16 14V10C16 9.44772 16.4477 9 17 9Z", fill: "currentColor" })));
});
HeadingFourIcon.displayName = "HeadingFourIcon";

var HeadingIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M6 3C6.55228 3 7 3.44772 7 4V11H17V4C17 3.44772 17.4477 3 18 3C18.5523 3 19 3.44772 19 4V20C19 20.5523 18.5523 21 18 21C17.4477 21 17 20.5523 17 20V13H7V20C7 20.5523 6.55228 21 6 21C5.44772 21 5 20.5523 5 20V4C5 3.44772 5.44772 3 6 3Z", fill: "currentColor" })));
});
HeadingIcon.displayName = "HeadingIcon";

var HeadingOneIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M5 6C5 5.44772 4.55228 5 4 5C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H5V6Z", fill: "currentColor" }),
        React.createElement("path", { d: "M21.0001 10C21.0001 9.63121 20.7971 9.29235 20.472 9.11833C20.1468 8.94431 19.7523 8.96338 19.4454 9.16795L16.4454 11.168C15.9859 11.4743 15.8617 12.0952 16.1681 12.5547C16.4744 13.0142 17.0953 13.1384 17.5548 12.8321L19.0001 11.8685V18C19.0001 18.5523 19.4478 19 20.0001 19C20.5524 19 21.0001 18.5523 21.0001 18V10Z", fill: "currentColor" })));
});
HeadingOneIcon.displayName = "HeadingOneIcon";

var HeadingSixIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M5 6C5 5.44772 4.55228 5 4 5C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H5V6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M20.7071 9.29289C21.0976 9.68342 21.0976 10.3166 20.7071 10.7071C19.8392 11.575 19.2179 12.2949 18.7889 13.0073C18.8587 13.0025 18.929 13 19 13C20.6569 13 22 14.3431 22 16C22 17.6569 20.6569 19 19 19C17.3431 19 16 17.6569 16 16C16 14.6007 16.2837 13.4368 16.8676 12.3419C17.4384 11.2717 18.2728 10.3129 19.2929 9.29289C19.6834 8.90237 20.3166 8.90237 20.7071 9.29289ZM19 17C18.4477 17 18 16.5523 18 16C18 15.4477 18.4477 15 19 15C19.5523 15 20 15.4477 20 16C20 16.5523 19.5523 17 19 17Z", fill: "currentColor" })));
});
HeadingSixIcon.displayName = "HeadingSixIcon";

var HeadingThreeIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M4 5C4.55228 5 5 5.44772 5 6V11H11V6C11 5.44772 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V13H5V18C5 18.5523 4.55228 19 4 19C3.44772 19 3 18.5523 3 18V6C3 5.44772 3.44772 5 4 5Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M19.4608 11.2169C19.1135 11.0531 18.5876 11.0204 18.0069 11.3619C17.5309 11.642 16.918 11.4831 16.638 11.007C16.358 10.531 16.5169 9.91809 16.9929 9.63807C18.1123 8.97962 19.3364 8.94691 20.314 9.40808C21.2839 9.86558 21.9999 10.818 21.9999 12C21.9999 12.7957 21.6838 13.5587 21.1212 14.1213C20.5586 14.6839 19.7956 15 18.9999 15C18.4476 15 17.9999 14.5523 17.9999 14C17.9999 13.4477 18.4476 13 18.9999 13C19.2651 13 19.5195 12.8947 19.707 12.7071C19.8946 12.5196 19.9999 12.2652 19.9999 12C19.9999 11.6821 19.8159 11.3844 19.4608 11.2169Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M18.0001 14C18.0001 13.4477 18.4478 13 19.0001 13C19.7957 13 20.5588 13.3161 21.1214 13.8787C21.684 14.4413 22.0001 15.2043 22.0001 16C22.0001 17.2853 21.2767 18.3971 20.1604 18.8994C19.0257 19.41 17.642 19.2315 16.4001 18.3C15.9582 17.9686 15.8687 17.3418 16.2001 16.9C16.5314 16.4582 17.1582 16.3686 17.6001 16.7C18.3581 17.2685 18.9744 17.24 19.3397 17.0756C19.7234 16.9029 20.0001 16.5147 20.0001 16C20.0001 15.7348 19.8947 15.4804 19.7072 15.2929C19.5196 15.1054 19.2653 15 19.0001 15C18.4478 15 18.0001 14.5523 18.0001 14Z", fill: "currentColor" })));
});
HeadingThreeIcon.displayName = "HeadingThreeIcon";

var HeadingTwoIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M5 6C5 5.44772 4.55228 5 4 5C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19C4.55228 19 5 18.5523 5 18V13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H5V6Z", fill: "currentColor" }),
        React.createElement("path", { d: "M22.0001 12C22.0001 10.7611 21.1663 9.79297 20.0663 9.42632C18.9547 9.05578 17.6171 9.28724 16.4001 10.2C15.9582 10.5314 15.8687 11.1582 16.2001 11.6C16.5314 12.0418 17.1582 12.1314 17.6001 11.8C18.383 11.2128 19.0455 11.1942 19.4338 11.3237C19.8339 11.457 20.0001 11.7389 20.0001 12C20.0001 12.4839 19.8554 12.7379 19.6537 12.9481C19.4275 13.1837 19.1378 13.363 18.7055 13.6307C18.6313 13.6767 18.553 13.7252 18.4701 13.777C17.9572 14.0975 17.3128 14.5261 16.8163 15.2087C16.3007 15.9177 16.0001 16.8183 16.0001 18C16.0001 18.5523 16.4478 19 17.0001 19H21.0001C21.5523 19 22.0001 18.5523 22.0001 18C22.0001 17.4477 21.5523 17 21.0001 17H18.131C18.21 16.742 18.3176 16.5448 18.4338 16.385C18.6873 16.0364 19.0429 15.7775 19.5301 15.473C19.5898 15.4357 19.6536 15.3966 19.7205 15.3556C20.139 15.0992 20.6783 14.7687 21.0964 14.3332C21.6447 13.7621 22.0001 13.0161 22.0001 12Z", fill: "currentColor" })));
});
HeadingTwoIcon.displayName = "HeadingTwoIcon";

var HighlighterIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14.7072 4.70711C15.0977 4.31658 15.0977 3.68342 14.7072 3.29289C14.3167 2.90237 13.6835 2.90237 13.293 3.29289L8.69294 7.89286L8.68594 7.9C8.13626 8.46079 7.82837 9.21474 7.82837 10C7.82837 10.2306 7.85491 10.4584 7.90631 10.6795L2.29289 16.2929C2.10536 16.4804 2 16.7348 2 17V20C2 20.5523 2.44772 21 3 21H12C12.2652 21 12.5196 20.8946 12.7071 20.7071L15.3205 18.0937C15.5416 18.1452 15.7695 18.1717 16.0001 18.1717C16.7853 18.1717 17.5393 17.8639 18.1001 17.3142L22.7072 12.7071C23.0977 12.3166 23.0977 11.6834 22.7072 11.2929C22.3167 10.9024 21.6835 10.9024 21.293 11.2929L16.6971 15.8887C16.5105 16.0702 16.2605 16.1717 16.0001 16.1717C15.7397 16.1717 15.4897 16.0702 15.303 15.8887L10.1113 10.697C9.92992 10.5104 9.82837 10.2604 9.82837 10C9.82837 9.73963 9.92992 9.48958 10.1113 9.30297L14.7072 4.70711ZM13.5858 17L9.00004 12.4142L4 17.4142V19H11.5858L13.5858 17Z", fill: "currentColor" })));
});
HighlighterIcon.displayName = "HighlighterIcon";

var ImagePlusIcon = function (_a) {
    var className = _a.className;
    return (React__default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
        React__default.createElement("path", { d: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" }),
        React__default.createElement("line", { x1: "16", y1: "5", x2: "22", y2: "5" }),
        React__default.createElement("line", { x1: "19", y1: "2", x2: "19", y2: "8" }),
        React__default.createElement("circle", { cx: "9", cy: "9", r: "2" }),
        React__default.createElement("path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" })));
};

var LinkIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M16.9958 1.06669C15.4226 1.05302 13.907 1.65779 12.7753 2.75074L12.765 2.76086L11.045 4.47086C10.6534 4.86024 10.6515 5.49341 11.0409 5.88507C11.4303 6.27673 12.0634 6.27858 12.4551 5.88919L14.1697 4.18456C14.9236 3.45893 15.9319 3.05752 16.9784 3.06662C18.0272 3.07573 19.0304 3.49641 19.772 4.23804C20.5137 4.97967 20.9344 5.98292 20.9435 7.03171C20.9526 8.07776 20.5515 9.08563 19.8265 9.83941L16.833 12.8329C16.4274 13.2386 15.9393 13.5524 15.4019 13.7529C14.8645 13.9533 14.2903 14.0359 13.7181 13.9949C13.146 13.9539 12.5894 13.7904 12.0861 13.5154C11.5827 13.2404 11.1444 12.8604 10.8008 12.401C10.47 11.9588 9.84333 11.8685 9.40108 12.1993C8.95883 12.5301 8.86849 13.1568 9.1993 13.599C9.71464 14.288 10.3721 14.858 11.1272 15.2705C11.8822 15.683 12.7171 15.9283 13.5753 15.9898C14.4334 16.0513 15.2948 15.9274 16.1009 15.6267C16.907 15.326 17.639 14.8555 18.2473 14.247L21.2472 11.2471L21.2593 11.2347C22.3523 10.1031 22.9571 8.58751 22.9434 7.01433C22.9297 5.44115 22.2987 3.93628 21.1863 2.82383C20.0738 1.71138 18.5689 1.08036 16.9958 1.06669Z", fill: "currentColor" }),
        React.createElement("path", { d: "M10.4247 8.0102C9.56657 7.94874 8.70522 8.07256 7.89911 8.37326C7.09305 8.67395 6.36096 9.14458 5.75272 9.753L2.75285 12.7529L2.74067 12.7653C1.64772 13.8969 1.04295 15.4125 1.05662 16.9857C1.07029 18.5589 1.70131 20.0637 2.81376 21.1762C3.9262 22.2886 5.43108 22.9196 7.00426 22.9333C8.57744 22.947 10.0931 22.3422 11.2247 21.2493L11.2371 21.2371L12.9471 19.5271C13.3376 19.1366 13.3376 18.5034 12.9471 18.1129C12.5565 17.7223 11.9234 17.7223 11.5328 18.1129L9.82932 19.8164C9.07555 20.5414 8.06768 20.9425 7.02164 20.9334C5.97285 20.9243 4.9696 20.5036 4.22797 19.762C3.48634 19.0203 3.06566 18.0171 3.05655 16.9683C3.04746 15.9222 3.44851 14.9144 4.17355 14.1606L7.16719 11.167C7.5727 10.7613 8.06071 10.4476 8.59811 10.2471C9.13552 10.0467 9.70976 9.96412 10.2819 10.0051C10.854 10.0461 11.4106 10.2096 11.9139 10.4846C12.4173 10.7596 12.8556 11.1397 13.1992 11.599C13.53 12.0412 14.1567 12.1316 14.5989 11.8007C15.0412 11.4699 15.1315 10.8433 14.8007 10.401C14.2854 9.71205 13.6279 9.14198 12.8729 8.72948C12.1178 8.31697 11.2829 8.07166 10.4247 8.0102Z", fill: "currentColor" })));
});
LinkIcon.displayName = "LinkIcon";

var ListTodoIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2 6C2 4.89543 2.89543 4 4 4H8C9.10457 4 10 4.89543 10 6V10C10 11.1046 9.10457 12 8 12H4C2.89543 12 2 11.1046 2 10V6ZM8 6H4V10H8V6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.70711 14.2929C10.0976 14.6834 10.0976 15.3166 9.70711 15.7071L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071L2.29289 17.7071C1.90237 17.3166 1.90237 16.6834 2.29289 16.2929C2.68342 15.9024 3.31658 15.9024 3.70711 16.2929L5 17.5858L8.29289 14.2929C8.68342 13.9024 9.31658 13.9024 9.70711 14.2929Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 6C12 5.44772 12.4477 5 13 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H13C12.4477 7 12 6.55228 12 6Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 12C12 11.4477 12.4477 11 13 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H13C12.4477 13 12 12.5523 12 12Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 18C12 17.4477 12.4477 17 13 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H13C12.4477 19 12 18.5523 12 18Z", fill: "currentColor" })));
});
ListTodoIcon.displayName = "ListTodoIcon";

var MoonStarIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 11.5955 21.7564 11.2309 21.3827 11.0761C21.009 10.9213 20.5789 11.0069 20.2929 11.2929C19.287 12.2988 17.9226 12.864 16.5 12.864C15.0774 12.864 13.713 12.2988 12.7071 11.2929C11.7012 10.287 11.136 8.92261 11.136 7.5C11.136 6.07739 11.7012 4.71304 12.7071 3.70711C12.9931 3.42111 13.0787 2.99099 12.9239 2.61732C12.7691 2.24364 12.4045 2 12 2ZM7.55544 5.34824C8.27036 4.87055 9.05353 4.51389 9.87357 4.28778C9.39271 5.27979 9.13604 6.37666 9.13604 7.5C9.13604 9.45304 9.91189 11.3261 11.2929 12.7071C12.6739 14.0881 14.547 14.864 16.5 14.864C17.6233 14.864 18.7202 14.6073 19.7122 14.1264C19.4861 14.9465 19.1295 15.7296 18.6518 16.4446C17.7727 17.7602 16.5233 18.7855 15.0615 19.391C13.5997 19.9965 11.9911 20.155 10.4393 19.8463C8.88743 19.5376 7.46197 18.7757 6.34315 17.6569C5.22433 16.538 4.4624 15.1126 4.15372 13.5607C3.84504 12.0089 4.00347 10.4003 4.60897 8.93853C5.21447 7.47672 6.23985 6.22729 7.55544 5.34824Z", fill: "currentColor" }),
        React.createElement("path", { d: "M19 2C19.5523 2 20 2.44772 20 3V4H21C21.5523 4 22 4.44772 22 5C22 5.55228 21.5523 6 21 6H20V7C20 7.55228 19.5523 8 19 8C18.4477 8 18 7.55228 18 7V6H17C16.4477 6 16 5.55228 16 5C16 4.44772 16.4477 4 17 4H18V3C18 2.44772 18.4477 2 19 2Z", fill: "currentColor" })));
});
MoonStarIcon.displayName = "MoonStarIcon";

var Redo2Icon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M15.7071 2.29289C15.3166 1.90237 14.6834 1.90237 14.2929 2.29289C13.9024 2.68342 13.9024 3.31658 14.2929 3.70711L17.5858 7H9.5C7.77609 7 6.12279 7.68482 4.90381 8.90381C3.68482 10.1228 3 11.7761 3 13.5C3 14.3536 3.16813 15.1988 3.49478 15.9874C3.82144 16.7761 4.30023 17.4926 4.90381 18.0962C6.12279 19.3152 7.77609 20 9.5 20H13C13.5523 20 14 19.5523 14 19C14 18.4477 13.5523 18 13 18H9.5C8.30653 18 7.16193 17.5259 6.31802 16.682C5.90016 16.2641 5.56869 15.768 5.34254 15.2221C5.1164 14.6761 5 14.0909 5 13.5C5 12.3065 5.47411 11.1619 6.31802 10.318C7.16193 9.47411 8.30653 9 9.5 9H17.5858L14.2929 12.2929C13.9024 12.6834 13.9024 13.3166 14.2929 13.7071C14.6834 14.0976 15.3166 14.0976 15.7071 13.7071L20.7071 8.70711C21.0976 8.31658 21.0976 7.68342 20.7071 7.29289L15.7071 2.29289Z", fill: "currentColor" })));
});
Redo2Icon.displayName = "Redo2Icon";

var SunIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { d: "M12 1C12.5523 1 13 1.44772 13 2V4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4V2C11 1.44772 11.4477 1 12 1Z", fill: "currentColor" }),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12ZM12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z", fill: "currentColor" }),
        React.createElement("path", { d: "M13 20C13 19.4477 12.5523 19 12 19C11.4477 19 11 19.4477 11 20V22C11 22.5523 11.4477 23 12 23C12.5523 23 13 22.5523 13 22V20Z", fill: "currentColor" }),
        React.createElement("path", { d: "M4.22282 4.22289C4.61335 3.83236 5.24651 3.83236 5.63704 4.22289L7.04704 5.63289C7.43756 6.02341 7.43756 6.65658 7.04704 7.0471C6.65651 7.43762 6.02335 7.43762 5.63283 7.0471L4.22282 5.6371C3.8323 5.24658 3.8323 4.61341 4.22282 4.22289Z", fill: "currentColor" }),
        React.createElement("path", { d: "M18.367 16.9529C17.9765 16.5623 17.3433 16.5623 16.9528 16.9529C16.5623 17.3434 16.5623 17.9766 16.9528 18.3671L18.3628 19.7771C18.7533 20.1676 19.3865 20.1676 19.777 19.7771C20.1675 19.3866 20.1675 18.7534 19.777 18.3629L18.367 16.9529Z", fill: "currentColor" }),
        React.createElement("path", { d: "M1 12C1 11.4477 1.44772 11 2 11H4C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13H2C1.44772 13 1 12.5523 1 12Z", fill: "currentColor" }),
        React.createElement("path", { d: "M20 11C19.4477 11 19 11.4477 19 12C19 12.5523 19.4477 13 20 13H22C22.5523 13 23 12.5523 23 12C23 11.4477 22.5523 11 22 11H20Z", fill: "currentColor" }),
        React.createElement("path", { d: "M7.04704 16.9529C7.43756 17.3434 7.43756 17.9766 7.04704 18.3671L5.63704 19.7771C5.24651 20.1676 4.61335 20.1676 4.22282 19.7771C3.8323 19.3866 3.8323 18.7534 4.22283 18.3629L5.63283 16.9529C6.02335 16.5623 6.65651 16.5623 7.04704 16.9529Z", fill: "currentColor" }),
        React.createElement("path", { d: "M19.777 5.6371C20.1675 5.24657 20.1675 4.61341 19.777 4.22289C19.3865 3.83236 18.7533 3.83236 18.3628 4.22289L16.9528 5.63289C16.5623 6.02341 16.5623 6.65658 16.9528 7.0471C17.3433 7.43762 17.9765 7.43762 18.367 7.0471L19.777 5.6371Z", fill: "currentColor" })));
});
SunIcon.displayName = "SunIcon";

function TableIcon(props) {
    return (React__default.createElement("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, props),
        React__default.createElement("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }),
        React__default.createElement("line", { x1: "3", x2: "21", y1: "9", y2: "9" }),
        React__default.createElement("line", { x1: "3", x2: "21", y1: "15", y2: "15" }),
        React__default.createElement("line", { x1: "9", x2: "9", y1: "3", y2: "21" }),
        React__default.createElement("line", { x1: "15", x2: "15", y1: "3", y2: "21" })));
}

var TrashIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 5V4C7 3.17477 7.40255 2.43324 7.91789 1.91789C8.43324 1.40255 9.17477 1 10 1H14C14.8252 1 15.5668 1.40255 16.0821 1.91789C16.5975 2.43324 17 3.17477 17 4V5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H20V20C20 20.8252 19.5975 21.5668 19.0821 22.0821C18.5668 22.5975 17.8252 23 17 23H7C6.17477 23 5.43324 22.5975 4.91789 22.0821C4.40255 21.5668 4 20.8252 4 20V7H3C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5H7ZM9 4C9 3.82523 9.09745 3.56676 9.33211 3.33211C9.56676 3.09745 9.82523 3 10 3H14C14.1748 3 14.4332 3.09745 14.6679 3.33211C14.9025 3.56676 15 3.82523 15 4V5H9V4ZM6 7V20C6 20.1748 6.09745 20.4332 6.33211 20.6679C6.56676 20.9025 6.82523 21 7 21H17C17.1748 21 17.4332 20.9025 17.6679 20.6679C17.9025 20.4332 18 20.1748 18 20V7H6Z", fill: "currentColor" })));
});
TrashIcon.displayName = "TrashIcon";

var Undo2Icon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ width: "24", height: "24", className: className, viewBox: "0 0 24 24", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, props),
        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.70711 3.70711C10.0976 3.31658 10.0976 2.68342 9.70711 2.29289C9.31658 1.90237 8.68342 1.90237 8.29289 2.29289L3.29289 7.29289C2.90237 7.68342 2.90237 8.31658 3.29289 8.70711L8.29289 13.7071C8.68342 14.0976 9.31658 14.0976 9.70711 13.7071C10.0976 13.3166 10.0976 12.6834 9.70711 12.2929L6.41421 9H14.5C15.0909 9 15.6761 9.1164 16.2221 9.34254C16.768 9.56869 17.2641 9.90016 17.682 10.318C18.0998 10.7359 18.4313 11.232 18.6575 11.7779C18.8836 12.3239 19 12.9091 19 13.5C19 14.0909 18.8836 14.6761 18.6575 15.2221C18.4313 15.768 18.0998 16.2641 17.682 16.682C17.2641 17.0998 16.768 17.4313 16.2221 17.6575C15.6761 17.8836 15.0909 18 14.5 18H11C10.4477 18 10 18.4477 10 19C10 19.5523 10.4477 20 11 20H14.5C15.3536 20 16.1988 19.8319 16.9874 19.5052C17.7761 19.1786 18.4926 18.6998 19.0962 18.0962C19.6998 17.4926 20.1786 16.7761 20.5052 15.9874C20.8319 15.1988 21 14.3536 21 13.5C21 12.6464 20.8319 11.8012 20.5052 11.0126C20.1786 10.2239 19.6998 9.50739 19.0962 8.90381C18.4926 8.30022 17.7761 7.82144 16.9874 7.49478C16.1988 7.16813 15.3536 7 14.5 7H6.41421L9.70711 3.70711Z", fill: "currentColor" })));
});
Undo2Icon.displayName = "Undo2Icon";

var DividerIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className }, props),
        React.createElement("line", { x1: "3", y1: "12", x2: "21", y2: "12" })));
});
DividerIcon.displayName = "DividerIcon";

var HighlightIcon = React.memo(function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (React.createElement("svg", __assign({ xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className }, props),
        React.createElement("path", { d: "m9 11-6 6v3h9l3-3" }),
        React.createElement("path", { d: "m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" })));
});
HighlightIcon.displayName = "HighlightIcon";

var FONT_SIZES = [
    '8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72'
];
var HEADING_SIZES = {
    1: '32px',
    2: '24px',
    3: '20px',
    4: '18px',
    5: '16px',
    6: '14px',
};
var MenuBar = function (_a) {
    var editor = _a.editor, unsetLink = _a.unsetLink;
    var _b = useState(false), isYoutubeModalOpen = _b[0], setIsYoutubeModalOpen = _b[1];
    var handleYoutubeSubmit = function (data) {
        if (!editor)
            return;
        try {
            editor
                .chain()
                .focus()
                .insertContent({
                type: 'youtube',
                attrs: {
                    src: data.url,
                    width: data.width ? parseInt(data.width) : 640,
                    height: data.height ? parseInt(data.height) : 480,
                    align: 'center',
                }
            })
                .run();
        }
        catch (error) {
            console.error('Error inserting YouTube video:', error);
        }
    };
    var _c = useState(false), isImageModalOpen = _c[0], setIsImageModalOpen = _c[1];
    var getCurrentFontSize = function () {
        var _a;
        if (editor.isActive('heading')) {
            var level = editor.getAttributes('heading').level;
            return ((_a = HEADING_SIZES[level]) === null || _a === void 0 ? void 0 : _a.replace('px', '')) || '16';
        }
        var attrs = editor.getAttributes('textStyle');
        if (attrs.fontSize) {
            return attrs.fontSize.replace('px', '');
        }
        return '16';
    };
    var handleFontSizeChange = function (size) {
        if (editor.isActive('heading')) {
            editor.chain().focus().setParagraph().run();
        }
        editor.chain().focus().setFontSize("".concat(size, "px")).run();
    };
    var handleHeadingChange = function (value) {
        editor.chain().focus().unsetFontSize().run();
        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        }
        else {
            var level = parseInt(value.substring(1));
            editor.chain().focus().toggleHeading({ level: level }).run();
        }
    };
    var _d = useState(false), isTableModalOpen = _d[0], setIsTableModalOpen = _d[1];
    var _e = useState(false), isLinkModalOpen = _e[0], setIsLinkModalOpen = _e[1];
    var handleTableSubmit = function (_a) {
        var rows = _a.rows, cols = _a.cols;
        editor.chain().focus().insertTable({
            rows: parseInt(rows),
            cols: parseInt(cols),
            withHeaderRow: true
        }).run();
    };
    var isTableSelected = editor.isActive('table');
    var editorState = useEditorState({
        editor: editor,
        selector: function (ctx) {
            var _a;
            return {
                isBold: ctx.editor.isActive("bold"),
                canBold: ctx.editor.can().chain().focus().toggleBold().run(),
                isItalic: ctx.editor.isActive("italic"),
                canItalic: ctx.editor.can().chain().focus().toggleItalic().run(),
                isStrike: ctx.editor.isActive("strike"),
                canStrike: ctx.editor.can().chain().focus().toggleStrike().run(),
                canCode: ctx.editor.can().chain().focus().toggleCode().run(),
                canClearMarks: ctx.editor.can().chain().focus().unsetAllMarks().run(),
                isParagraph: ctx.editor.isActive("paragraph"),
                isHeading1: ctx.editor.isActive("heading", { level: 1 }),
                isHeading2: ctx.editor.isActive("heading", { level: 2 }),
                isHeading3: ctx.editor.isActive("heading", { level: 3 }),
                isHeading4: ctx.editor.isActive("heading", { level: 4 }),
                isHeading5: ctx.editor.isActive("heading", { level: 5 }),
                isHeading6: ctx.editor.isActive("heading", { level: 6 }),
                isBulletList: ctx.editor.isActive("bulletList"),
                isOrderedList: ctx.editor.isActive("orderedList"),
                isCodeBlock: ctx.editor.isActive("codeBlock"),
                isBlockquote: ctx.editor.isActive("blockquote"),
                canUndo: ctx.editor.can().chain().focus().undo().run(),
                canRedo: ctx.editor.can().chain().focus().redo().run(),
                canClearFormatting: ctx.editor
                    .can()
                    .chain()
                    .focus()
                    .unsetAllMarks()
                    .run(),
                isAlignLeft: ctx.editor.isActive("textAlign", { align: "left" }),
                isAlignCenter: ctx.editor.isActive("textAlign", { align: "center" }),
                isAlignRight: ctx.editor.isActive("textAlign", { align: "right" }),
                isUnderline: ctx.editor.isActive("underline"),
                isTable: ctx.editor.isActive("table"),
                isLink: ctx.editor.isActive("link"),
                isYoutube: ctx.editor.isActive('youtube'),
                currentFontSize: ((_a = ctx.editor.getAttributes('textStyle')) === null || _a === void 0 ? void 0 : _a.fontSize) || '16px',
                isHeading: ctx.editor.isActive('heading'),
                isImage: ctx.editor.isActive('image'),
                isSubscript: ctx.editor.isActive('subscript'),
                isSuperscript: ctx.editor.isActive('superscript'),
                isHighlight: ctx.editor.isActive('highlight'),
                youtubeAlignment: ctx.editor.getAttributes('youtube').align || 'left',
                imageAlignment: ctx.editor.getAttributes('image').align || 'left',
            };
        },
    });
    return (React__default.createElement("div", { className: "border-b border-gray-200 bg-white z-[9999] rounded-lg" },
        React__default.createElement("div", { className: "flex flex-wrap items-center gap-1 sm:gap-2.5 px-2 sm:px-4 py-2 overflow-x-auto" },
            React__default.createElement("div", { className: "flex items-center gap-1 border-r pr-1 sm:pr-2" },
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().undo().run(); }, className: "p-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500", disabled: !editor.can().chain().focus().undo().run(), title: "Undo" },
                    React__default.createElement(Undo2Icon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-700" })),
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().redo().run(); }, className: "p-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500", disabled: !editor.can().chain().focus().redo().run(), title: "Redo" },
                    React__default.createElement(Redo2Icon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-700" }))),
            React__default.createElement("div", { className: "flex items-center gap-1 border-r pr-1 sm:pr-2" },
                React__default.createElement("select", { value: editor.isActive('paragraph') ? 'paragraph' : editor.isActive('heading') ? "h".concat(editor.getAttributes('heading').level) : 'paragraph', onChange: function (e) { return handleHeadingChange(e.target.value); }, className: "px-2 py-1.5 border border-gray-200 rounded-md text-xs sm:text-sm min-w-[90px] sm:min-w-[130px] bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" },
                    React__default.createElement("option", { value: "paragraph" }, "Paragraph"),
                    React__default.createElement("option", { value: "h1" }, "Heading 1"),
                    React__default.createElement("option", { value: "h2" }, "Heading 2"),
                    React__default.createElement("option", { value: "h3" }, "Heading 3"),
                    React__default.createElement("option", { value: "h4" }, "Heading 4"),
                    React__default.createElement("option", { value: "h5" }, "Heading 5"),
                    React__default.createElement("option", { value: "h6" }, "Heading 6")),
                React__default.createElement("select", { value: getCurrentFontSize(), onChange: function (e) { return handleFontSizeChange(e.target.value); }, className: "px-2 py-1.5 border border-gray-200 rounded-md text-xs sm:text-sm min-w-[60px] sm:min-w-[80px] bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500", disabled: editor.isActive('heading') }, FONT_SIZES.map(function (size) { return (React__default.createElement("option", { key: size, value: size },
                    size,
                    "px")); }))),
            React__default.createElement("div", { className: "flex items-center gap-1 border-r pr-1 sm:pr-2" },
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().toggleBold().run(); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('bold') ? 'bg-gray-100 ring-1 ring-gray-300' : ''), title: "Bold" },
                    React__default.createElement(BoldIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" })),
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().toggleItalic().run(); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('italic') ? 'bg-gray-100 ring-1 ring-gray-300' : ''), title: "Italic" },
                    React__default.createElement(ItalicIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" })),
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().toggleUnderline().run(); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('underline') ? 'bg-gray-100 ring-1 ring-gray-300' : ''), title: "Underline" },
                    React__default.createElement(UnderlineIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" })),
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().toggleStrike().run(); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('strike') ? 'bg-gray-100 ring-1 ring-gray-300' : ''), title: "Strikethrough" },
                    React__default.createElement(StrikeIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" }))),
            React__default.createElement("div", { className: "flex items-center gap-1 border-r pr-1 sm:pr-2" },
                React__default.createElement("button", { onClick: function () {
                        if (editor.isActive('youtube')) {
                            editor.chain().focus().updateAttributes('youtube', { align: 'left' }).run();
                        }
                        else if (editor.isActive('image')) {
                            editor.chain().focus().updateAttributes('image', { align: 'left' }).run();
                        }
                        else {
                            editor.chain().focus().setTextAlign('left').run();
                        }
                    }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat((editor.isActive('youtube') && editorState.youtubeAlignment === 'left') ||
                        (editor.isActive('image') && editorState.imageAlignment === 'left') ||
                        editor.isActive({ textAlign: 'left' })
                        ? 'bg-gray-100 ring-1 ring-gray-300'
                        : ''), title: "Align left" },
                    React__default.createElement(AlignLeftIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" })),
                React__default.createElement("button", { onClick: function () {
                        if (editor.isActive('youtube')) {
                            editor.chain().focus().updateAttributes('youtube', { align: 'center' }).run();
                        }
                        else if (editor.isActive('image')) {
                            editor.chain().focus().updateAttributes('image', { align: 'center' }).run();
                        }
                        else {
                            editor.chain().focus().setTextAlign('center').run();
                        }
                    }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat((editor.isActive('youtube') && editorState.youtubeAlignment === 'center') ||
                        (editor.isActive('image') && editorState.imageAlignment === 'center') ||
                        editor.isActive({ textAlign: 'center' })
                        ? 'bg-gray-100 ring-1 ring-gray-300'
                        : ''), title: "Align center" },
                    React__default.createElement(AlignCenterIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" })),
                React__default.createElement("button", { onClick: function () {
                        if (editor.isActive('youtube')) {
                            editor.chain().focus().updateAttributes('youtube', { align: 'right' }).run();
                        }
                        else if (editor.isActive('image')) {
                            editor.chain().focus().updateAttributes('image', { align: 'right' }).run();
                        }
                        else {
                            editor.chain().focus().setTextAlign('right').run();
                        }
                    }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat((editor.isActive('youtube') && editorState.youtubeAlignment === 'right') ||
                        (editor.isActive('image') && editorState.imageAlignment === 'right') ||
                        editor.isActive({ textAlign: 'right' })
                        ? 'bg-gray-100 ring-1 ring-gray-300'
                        : ''), title: "Align right" },
                    React__default.createElement(AlignRightIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" }))),
            React__default.createElement("div", { className: "flex items-center gap-1 border-r pr-1 sm:pr-2" },
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().toggleBulletList().run(); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('bulletList') ? 'bg-gray-100 ring-1 ring-gray-300' : ''), title: "Bullet List" },
                    React__default.createElement(ListIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" })),
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().toggleOrderedList().run(); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('orderedList') ? 'bg-gray-100 ring-1 ring-gray-300' : ''), title: "Numbered List" },
                    React__default.createElement(ListOrderedIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" }))),
            React__default.createElement("div", { className: "flex items-center gap-1" },
                React__default.createElement("button", { onClick: function () {
                        if (editor.isActive('link')) {
                            unsetLink();
                        }
                        else {
                            setIsLinkModalOpen(true);
                        }
                    }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('link') ? 'bg-red-50 ring-1 ring-red-300' : ''), title: editor.isActive('link') ? 'Remove link' : 'Insert link' },
                    React__default.createElement(LinkIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" })),
                React__default.createElement("div", { className: "relative group" },
                    React__default.createElement("button", { onClick: function () {
                            if (isTableSelected) {
                                editor.chain().focus().deleteTable().run();
                            }
                            else {
                                setIsTableModalOpen(true);
                            }
                        }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(isTableSelected ? 'bg-red-50 ring-1 ring-red-300' : ''), title: isTableSelected ? 'Remove Table' : 'Insert Table' },
                        React__default.createElement(TableIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" }))),
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().toggleBlockquote().run(); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('blockquote') ? 'bg-gray-100 ring-1 ring-gray-300' : ''), title: "Blockquote" },
                    React__default.createElement(BlockquoteIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" })),
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().toggleCodeBlock().run(); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('codeBlock') ? 'bg-gray-100 ring-1 ring-gray-300' : ''), title: "Code block" },
                    React__default.createElement(CodeBlockIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" })),
                React__default.createElement("button", { onClick: function () { return editor.chain().focus().toggleCode().run(); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('code') ? 'bg-gray-100 ring-1 ring-gray-300' : ''), title: "Inline code" },
                    React__default.createElement(Code2Icon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" }))),
            React__default.createElement("div", { className: "flex items-center gap-1 border-l pr-1 sm:pr-2" },
                React__default.createElement("button", { onClick: function () { return setIsImageModalOpen(true); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500", title: "Upload Image" },
                    React__default.createElement(ImagePlusIcon, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-800" })),
                React__default.createElement("button", { onClick: function () { return setIsYoutubeModalOpen(true); }, className: "p-1.5 rounded-md transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ".concat(editor.isActive('youtube') ? 'bg-gray-100 ring-1 ring-gray-300' : ''), title: "Insert YouTube video" },
                    React__default.createElement("img", { src: "/rte-editor/youtube-icon.svg", alt: "youtube", width: 22, height: 22 })))),
        React__default.createElement(ImageModal, { isOpen: isImageModalOpen, closeModal: function () { return setIsImageModalOpen(false); }, editor: editor }),
        React__default.createElement(YoutubeModal, { isOpen: isYoutubeModalOpen, closeModal: function () { return setIsYoutubeModalOpen(false); }, onSubmit: handleYoutubeSubmit }),
        React__default.createElement(TableModal, { isOpen: isTableModalOpen, closeModal: function () { return setIsTableModalOpen(false); }, onSubmit: handleTableSubmit }),
        React__default.createElement(LinkModal, { isOpen: isLinkModalOpen, closeModal: function () { return setIsLinkModalOpen(false); }, selectedText: editor.state.selection.empty ? undefined : editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to), existingUrl: editor.isActive('link') ? editor.getAttributes('link').href : undefined, onSubmit: function (_a) {
                var url = _a.url, text = _a.text;
                if (editor.state.selection.empty) {
                    editor.chain()
                        .focus()
                        .insertContent([
                        {
                            type: 'text',
                            text: text || url,
                            marks: [
                                {
                                    type: 'link',
                                    attrs: { href: url }
                                }
                            ]
                        }
                    ])
                        .run();
                }
                else {
                    editor.chain()
                        .focus()
                        .setLink({ href: url })
                        .run();
                }
            }, onUnset: function () {
                editor.chain().focus().unsetLink().run();
            } })));
};

// Link configuration
var linkConfig = {
    openOnClick: true,
    enableClickSelection: true,
    linkOnPaste: true,
    autolink: true,
    defaultProtocol: 'https',
    protocols: [
        'http',
        'https',
        {
            scheme: 'tel',
            optionalSlashes: true,
        },
        {
            scheme: 'mailto',
            optionalSlashes: true,
        }
    ],
    HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'cursor-pointer text-blue-600 hover:text-blue-800 hover:underline'
    },
    validate: function (url) {
        try {
            new URL(url);
            return true;
        }
        catch (_a) {
            return false;
        }
    }
};
var RichTextEditor = function (_a) {
    var _b = _a.initialContent, initialContent = _b === void 0 ? "" : _b, onContentChange = _a.onContentChange, onHTMLChange = _a.onHTMLChange, onJSONChange = _a.onJSONChange;
    var _c = useState(0), wordCount = _c[0], setWordCount = _c[1];
    var _d = useState(0), characterCount = _d[0], setCharacterCount = _d[1];
    var _e = useState(false), showFindReplace = _e[0], setShowFindReplace = _e[1];
    var editor = useEditor({
        autofocus: true,
        extensions: [
            CharacterCount.configure({
                limit: Infinity,
            }),
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {},
                },
                orderedList: {
                    HTMLAttributes: {},
                },
            }),
            ImageResize.extend({
                addAttributes: function () {
                    var _a;
                    return __assign(__assign({}, (_a = this.parent) === null || _a === void 0 ? void 0 : _a.call(this)), { style: {
                            default: null,
                            parseHTML: function (element) { return element.getAttribute('style'); },
                            renderHTML: function (attributes) { return ({
                                style: attributes.style,
                            }); },
                        }, align: {
                            default: 'left',
                            parseHTML: function (element) { return element.getAttribute('data-align'); },
                            renderHTML: function (attributes) {
                                if (!attributes.align)
                                    return {};
                                return { 'data-align': attributes.align };
                            },
                        } });
                }
            }).configure({
                HTMLAttributes: {
                    class: 'resizable-image',
                },
            }),
            TextStyleKit,
            FontSize.configure({
                types: ['textStyle'],
            }),
            index_default$6.configure({
                types: ["heading", "paragraph", "table", "image", "youtube"],
                alignments: ['left', 'center', 'right'],
            }),
            TaskList.configure({
                HTMLAttributes: {},
            }),
            index_default$3,
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {},
            }),
            index_default$2.configure(__assign(__assign({}, linkConfig), { HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                } })),
            Table.configure({
                resizable: true,
                HTMLAttributes: {},
            }),
            TableRow.configure({
                HTMLAttributes: {},
            }),
            TableHeader.configure({
                HTMLAttributes: {},
            }),
            TableCell.configure({
                HTMLAttributes: {},
            }),
            YoutubeAlign.configure({
                controls: true,
                nocookie: true,
                progressBarColor: 'white',
                modestBranding: true,
            }),
            Color.configure({
                types: ['textStyle'],
            }),
            index_default$5.configure({
                multicolor: true,
            }),
            index_default$4.configure({}),
            Subscript,
            Superscript,
        ],
        content: initialContent,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "focus:outline-none p-4 min-h-[500px] max-h-[500px] overflow-y-auto prose max-w-none bg-white",
            },
            handleDrop: function (view, event, _slice, moved) {
                var _a;
                if (!moved && ((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files.length)) {
                    var files = Array.from(event.dataTransfer.files);
                    var images = files.filter(function (file) { return file.type.startsWith('image'); });
                    if (images.length === 0)
                        return false;
                    event.preventDefault();
                    var tr_1 = view.state.tr;
                    var coordinates_1 = view.posAtCoords({
                        left: event.clientX,
                        top: event.clientY,
                    });
                    if (!coordinates_1)
                        return false;
                    images.forEach(function (image) {
                        var reader = new FileReader();
                        reader.onload = function (readerEvent) {
                            var _a;
                            var node = view.state.schema.nodes.image.create({
                                src: (_a = readerEvent.target) === null || _a === void 0 ? void 0 : _a.result,
                            });
                            var transaction = tr_1.insert(coordinates_1.pos, node);
                            view.dispatch(transaction);
                        };
                        reader.readAsDataURL(image);
                    });
                    return true;
                }
                return false;
            },
        },
        onUpdate: function (_a) {
            var editor = _a.editor;
            var text = editor.getText();
            var words = text.split(/\s+/).filter(function (word) { return word.length > 0; });
            setWordCount(words.length);
            setCharacterCount(text.length);
            if (onContentChange) {
                onContentChange(editor.getText());
            }
            if (onHTMLChange) {
                var rawHtml = editor.getHTML();
                onHTMLChange(rawHtml);
            }
            if (onJSONChange) {
                onJSONChange(editor.getJSON());
            }
        },
    });
    useEffect(function () {
        if (editor && initialContent !== editor.getHTML()) {
            editor.commands.setContent(initialContent);
        }
    }, [editor, initialContent]);
    var setLink = useCallback(function () {
        if (!editor)
            return;
        var selection = editor.state.selection;
        var selectedText = selection.empty
            ? ''
            : editor.state.doc.textBetween(selection.from, selection.to);
        var previousUrl = editor.getAttributes('link').href;
        var url = window.prompt('URL', previousUrl || selectedText);
        if (url === null) {
            return;
        }
        if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
        }
        try {
            var formattedUrl = url.startsWith('http://') || url.startsWith('https://')
                ? url
                : "https://".concat(url);
            editor.chain().focus().setLink({ href: formattedUrl }).run();
        }
        catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
            else {
                alert('An error occurred while setting the link');
            }
        }
    }, [editor]);
    var unsetLink = useCallback(function () {
        if (!editor)
            return;
        editor.chain().focus().unsetLink().run();
    }, [editor]);
    useEffect(function () {
        return function () {
            editor === null || editor === void 0 ? void 0 : editor.commands.unsetHighlight();
        };
    }, [editor]);
    useEffect(function () {
        var handleKeyDown = function (e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
                e.preventDefault();
                setShowFindReplace(true);
            }
            else if (e.key === 'Escape' && showFindReplace) {
                setShowFindReplace(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return function () {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showFindReplace]);
    return (React__default.createElement("div", { className: "w-full bg-white rounded-lg shadow-lg" },
        React__default.createElement("div", { className: "sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm rounded-t-lg" },
            React__default.createElement("div", { className: "flex items-center justify-start" },
                React__default.createElement("img", { src: "/rte-editor/logo.svg", alt: "logo", width: 30, height: 30, className: "ml-2" }),
                React__default.createElement("div", { className: "text-sm font-semibold text-gray-700 sm:px-4 py-2" }, "ProtiumPad")),
            editor && (React__default.createElement(FileMenuBar, { editor: editor, onOpenFindReplace: function () { return setShowFindReplace(true); } })),
            editor && (React__default.createElement(MenuBar, { editor: editor, setLink: setLink, unsetLink: unsetLink }))),
        editor && (React__default.createElement(EditorContainer, null,
            React__default.createElement("div", { className: "min-h-[300px] border-t border-gray-200" },
                React__default.createElement(EditorContent, { editor: editor, className: "prose max-w-none -z-500" })),
            React__default.createElement(TableControls, { editor: editor }))),
        React__default.createElement("div", { className: "flex justify-end py-2 px-2 sm:px-4 border-t border-gray-200" },
            React__default.createElement("div", { className: "flex items-center text-xs text-gray-500" },
                React__default.createElement("span", null,
                    wordCount,
                    " words \u2022 ",
                    characterCount,
                    " characters"))),
        React__default.createElement(FindReplace, { editor: editor, isOpen: showFindReplace, onClose: function () { return setShowFindReplace(false); } })));
};

export { FindReplace, ImageModal, LinkModal, MenuBar, RichTextEditor, TableControls, TableModal, YouTubeNodeView, YoutubeAlign, YoutubeModal };
//# sourceMappingURL=index.esm.js.map
