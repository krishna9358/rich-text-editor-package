import Youtube from '@tiptap/extension-youtube'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes } from '@tiptap/core'
import { YouTubeNodeView } from './YouTubeNodeView'

export const YoutubeAlign = Youtube.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'left',
        parseHTML: element => (element as HTMLElement).getAttribute('data-align'),
        renderHTML: attributes => {
          if (!attributes.align) return {}
          return { 'data-align': attributes.align }
        },
      },
      width: {
        default: 640,
        parseHTML: element => {
          const width = element.getAttribute('width')
          return width ? parseInt(width) : 640
        },
        renderHTML: attributes => {
          return { width: attributes.width.toString() }
        },
      },
      height: {
        default: 480,
        parseHTML: element => {
          const height = element.getAttribute('height')
          return height ? parseInt(height) : 480
        },
        renderHTML: attributes => {
          return { height: attributes.height.toString() }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const { width, height, align, ...rest } = HTMLAttributes
    return [
      'div',
      mergeAttributes(
        { class: 'youtube-video', 'data-align': align || 'left' },
        rest
      ),
      [
        'iframe',
        mergeAttributes(
          {
            width: width || '640',
            height: height || '480',
            frameborder: '0',
            allowfullscreen: 'true',
            src: HTMLAttributes.src,
          }
        ),
      ],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(YouTubeNodeView)
  }
})
