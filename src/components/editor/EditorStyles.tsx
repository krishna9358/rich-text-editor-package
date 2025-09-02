import styled from 'styled-components';

export const EditorContainer = styled.div`
  .ProseMirror {
    outline: none;
    padding: 1rem;
    @media (max-width: 640px) {
      padding: 0.5rem;
      font-size: 14px;
    }
  }

  .ProseMirror p {
    margin: 0;
    line-height: 1.5;
  }

  .ProseMirror a{
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
    &:hover{
      color: #0056b3;
    }
  }

  /* Image styles - using tiptap-extension-resize-image */
  .ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: block;
    margin: 1rem auto;
  }

  .ProseMirror img.resizable-image {
    cursor: pointer;
    border: 2px solid transparent;
    
    &:hover {
      border-color: #e5e7eb;
    }
    
    &.ProseMirror-selectednode {
      border-color: #3b82f6;
      outline: none;
    }
  }

  /* Image alignment in editor */
  .ProseMirror img[data-align='left'] {
    margin-right: auto;
    margin-left: 0;
  }

  .ProseMirror img[data-align='center'] {
    margin-left: auto;
    margin-right: auto;
  }

  .ProseMirror img[data-align='right'] {
    margin-left: auto;
    margin-right: 0;
  }

  /* List styles */
  .ProseMirror ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin: 0.5em 0;
    
    @media (max-width: 640px) {
      padding-left: 1em;
      margin: 0.25em 0;
    }
  }

  .ProseMirror ol {
    list-style-type: decimal;
    padding-left: 1.5em;
    margin: 0.5em 0;
    
    @media (max-width: 640px) {
      padding-left: 1em;
      margin: 0.25em 0;
    }
  }

  .ProseMirror li {
    margin: 0.2em 0;
  }

  .ProseMirror li p {
    margin: 0;
  }

  /* Heading styles */
  .ProseMirror h1 {
    font-size: 2em;
    font-weight: bold;
    margin: 0.67em 0;
    
    @media (max-width: 640px) {
      font-size: 1.5em;
      margin: 0.5em 0;
    }
  }

  .ProseMirror h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin: 0.75em 0;
    
    @media (max-width: 640px) {
      font-size: 1.25em;
      margin: 0.5em 0;
    }
  }

  .ProseMirror h3 {
    font-size: 1.17em;
    font-weight: bold;
    margin: 0.83em 0;
    
    @media (max-width: 640px) {
      font-size: 1.1em;
      margin: 0.5em 0;
    }
  }

  .ProseMirror h4 {
    font-size: 1em;
    font-weight: bold;
    margin: 1.12em 0;
    
    @media (max-width: 640px) {
      margin: 0.5em 0;
    }
  }

  .ProseMirror h5 {
    font-size: 0.83em;
    font-weight: bold;
    margin: 1.5em 0;
    
    @media (max-width: 640px) {
      margin: 0.5em 0;
    }
  }

  .ProseMirror h6 {
    font-size: 0.75em;
    font-weight: bold;
    margin: 1.67em 0;
    
    @media (max-width: 640px) {
      margin: 0.5em 0;
    }
  }

  .ProseMirror blockquote {
    border-left: 4px solid #e5e7eb;
    margin: 1em 0;
    padding-left: 1em;
    color: #6b7280;
    
    @media (max-width: 640px) {
      margin: 0.5em 0;
      padding-left: 0.5em;
    }
  }

  .ProseMirror pre {
    background-color: #f9fafb;
    border-radius: 6px;
    padding: 0.75em 1em;
    margin: 1em 0;
    overflow-x: auto;
    
    @media (max-width: 640px) {
      padding: 0.5em 0.75em;
      margin: 0.5em 0;
      font-size: 12px;
    }
  }

  .ProseMirror code {
    background-color: #f3f4f6;
    border-radius: 4px;
    padding: 0.2em 0.4em;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    
    @media (max-width: 640px) {
      font-size: 12px;
    }
  }

  /* Table styles */
  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;

    @media (max-width: 640px) {
      font-size: 12px;
    }

    td,
    th {
      border: 1px solid #e5e7eb;
      box-sizing: border-box;
      min-width: 1em;
      padding: 2px 8px;
      position: relative;
      vertical-align: top;
      height: 24px;
      line-height: 1.2;

      @media (max-width: 640px) {
        padding: 1px 4px;
        height: 20px;
      }

      > * {
        margin-bottom: 0;
      }
    }

    th {
      background-color: #f9fafb;
      font-weight: 600;
      text-align: left;
    }

    .selectedCell:after {
      background: rgba(190, 190, 226, 0.5);
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      position: absolute;
      z-index: 2;
    }

    .column-resize-handle {
      background-color: #3b82f6;
      bottom: -2px;
      pointer-events: none;
      position: absolute;
      right: -2px;
      top: 0;
      width: 4px;
      cursor: col-resize;
    }
  }

  .tableWrapper {
    margin: 1rem 0;
    overflow-x: auto;
    
    @media (max-width: 640px) {
      margin: 0.5rem 0;
    }
  }

  .resize-cursor {
    cursor: ew-resize;
  }

  /* YouTube Video Resizing Styles */
  .youtube-video {
    position: relative;
    display: block;
    margin: 1rem auto;
    resize: both;
    overflow: hidden;
    min-width: 320px;
    min-height: 180px;
    max-width: 100%;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;
    border-radius: 8px;

    @media (max-width: 640px) {
      margin: 0.5rem auto;
      min-width: 280px;
      min-height: 157px;
    }

    &[data-align='left'] {
      margin-right: auto;
      margin-left: 0;
    }

    &[data-align='center'] {
      margin-left: auto;
      margin-right: auto;
    }

    &[data-align='right'] {
      margin-left: auto;
      margin-right: 0;
    }

    &:hover {
      border-color: #e5e7eb;
    }

    &.ProseMirror-selectednode {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    iframe {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      cursor: se-resize;
      background: linear-gradient(135deg, transparent 50%, #9ca3af 50%);
    }
  }
`;
