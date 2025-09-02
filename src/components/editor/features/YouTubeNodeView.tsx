import React, { useState, useRef, useEffect } from 'react'
import { NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper } from '@tiptap/react'

export function YouTubeNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [dimensions, setDimensions] = useState({
    width: node.attrs.width || 640,
    height: node.attrs.height || 480
  })
  const nodeRef = useRef<HTMLDivElement>(null)
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height
    }
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPosRef.current.x
      const deltaY = e.clientY - startPosRef.current.y
      
      const newWidth = Math.max(320, startPosRef.current.width + deltaX)
      const newHeight = Math.max(180, startPosRef.current.height + deltaY)
      
      setDimensions({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      updateAttributes({
        width: dimensions.width,
        height: dimensions.height
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, dimensions, updateAttributes])

  return (
    <NodeViewWrapper className="youtube-wrapper">
      <div
        ref={nodeRef}
        className={`youtube-video ${selected ? 'ProseMirror-selectednode' : ''}`}
        data-align={node.attrs.align || 'left'}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          position: 'relative',
          display: 'block',
          margin: node.attrs.align === 'center' ? '1rem auto' : 
                 node.attrs.align === 'right' ? '1rem 0 1rem auto' : 
                 '1rem auto 1rem 0'
        }}
      >
        <iframe
          src={node.attrs.src}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0, borderRadius: '8px' }}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        
        <div
          className="resize-handle"
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '10px',
            height: '10px',
            cursor: 'se-resize',
            background: 'linear-gradient(135deg, transparent 50%, #9ca3af 50%)',
            opacity: selected ? 1 : 0,
            transition: 'opacity 0.2s'
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </NodeViewWrapper>
  )
}
