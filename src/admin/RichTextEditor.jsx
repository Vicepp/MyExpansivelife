import { useCallback, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { uploadImage } from '../lib/posts'
import { isFirebaseConfigured } from '../lib/firebase'

const COLORS = ['#232b4a', '#87492c', '#b3803f', '#183734', '#40b487', '#c0392b']

function Divider() {
  return <span className="mx-1 h-6 w-px shrink-0 bg-navy/10" />
}

function Tool({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`grid h-9 min-w-9 shrink-0 place-items-center rounded-lg px-2 text-[13px] font-semibold transition-colors disabled:opacity-35 ${
        active ? 'bg-navy text-white' : 'text-navy hover:bg-navy/10'
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value, onChange }) {
  const fileInput = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const editor = useEditor({
    extensions: [
      // Link and Underline are registered explicitly below, so switch off the
      // copies StarterKit ships with to avoid duplicate-extension warnings.
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ HTMLAttributes: { class: 'rounded-xl' } }),
      Youtube.configure({ controls: true, nocookie: true, width: 840, height: 472 }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: 'Start writing your article…' }),
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  })

  const addImageFromFile = useCallback(
    async (event) => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file || !editor) return

      if (!isFirebaseConfigured) {
        setError(
          'Image upload needs Firebase Storage. Connect Firebase, or use “Image URL” to link an image that is already online.',
        )
        return
      }

      setError('')
      setUploading(true)
      try {
        const url = await uploadImage(file)
        editor.chain().focus().setImage({ src: url, alt: file.name }).run()
      } catch (err) {
        setError(err.message ?? 'Upload failed.')
      } finally {
        setUploading(false)
      }
    },
    [editor],
  )

  if (!editor) return null

  const promptFor = (label, then) => {
    const url = window.prompt(label)
    if (url) then(url.trim())
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-navy/15 bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-navy/10 bg-admin-bg px-2 py-2">
        <Tool
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          ↶
        </Tool>
        <Tool
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          ↷
        </Tool>

        <Divider />

        {[2, 3, 4].map((level) => (
          <Tool
            key={level}
            title={`Heading ${level}`}
            active={editor.isActive('heading', { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          >
            H{level}
          </Tool>
        ))}
        <Tool
          title="Paragraph"
          active={editor.isActive('paragraph')}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          ¶
        </Tool>

        <Divider />

        <Tool
          title="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </Tool>
        <Tool
          title="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </Tool>
        <Tool
          title="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="underline">U</span>
        </Tool>
        <Tool
          title="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span className="line-through">S</span>
        </Tool>
        <Tool
          title="Highlight"
          active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <span className="rounded bg-sun px-1">H</span>
        </Tool>
        <Tool
          title="Inline code"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {'</>'}
        </Tool>

        <Divider />

        <Tool
          title="Bulleted list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •≡
        </Tool>
        <Tool
          title="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1≡
        </Tool>
        <Tool
          title="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝
        </Tool>
        <Tool
          title="Code block"
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {'{ }'}
        </Tool>
        <Tool
          title="Divider line"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          —
        </Tool>

        <Divider />

        {['left', 'center', 'right'].map((align) => (
          <Tool
            key={align}
            title={`Align ${align}`}
            active={editor.isActive({ textAlign: align })}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
          >
            {align === 'left' ? '⇤' : align === 'center' ? '↔' : '⇥'}
          </Tool>
        ))}

        <Divider />

        <Tool
          title="Add link"
          active={editor.isActive('link')}
          onClick={() =>
            promptFor('Link URL (https://…)', (url) =>
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run(),
            )
          }
        >
          🔗
        </Tool>
        <Tool
          title="Remove link"
          disabled={!editor.isActive('link')}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          ⛓︎
        </Tool>

        <Divider />

        <Tool
          title={uploading ? 'Uploading…' : 'Upload image'}
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
        >
          {uploading ? '…' : '🖼'}
        </Tool>
        <Tool
          title="Image from URL"
          onClick={() =>
            promptFor('Image URL (https://…)', (url) =>
              editor.chain().focus().setImage({ src: url }).run(),
            )
          }
        >
          URL
        </Tool>
        <Tool
          title="Embed YouTube video"
          onClick={() =>
            promptFor('YouTube video URL', (url) =>
              editor.commands.setYoutubeVideo({ src: url }),
            )
          }
        >
          ▶
        </Tool>

        <Divider />

        <Tool
          title="Insert table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          ▦
        </Tool>
        <Tool
          title="Add column"
          disabled={!editor.can().addColumnAfter()}
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          +col
        </Tool>
        <Tool
          title="Add row"
          disabled={!editor.can().addRowAfter()}
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          +row
        </Tool>
        <Tool
          title="Delete column"
          disabled={!editor.can().deleteColumn()}
          onClick={() => editor.chain().focus().deleteColumn().run()}
        >
          −col
        </Tool>
        <Tool
          title="Delete row"
          disabled={!editor.can().deleteRow()}
          onClick={() => editor.chain().focus().deleteRow().run()}
        >
          −row
        </Tool>
        <Tool
          title="Delete table"
          disabled={!editor.can().deleteTable()}
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          ✕▦
        </Tool>

        <Divider />

        <div className="flex items-center gap-1 px-1">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              title={`Text colour ${color}`}
              aria-label={`Text colour ${color}`}
              onClick={() => editor.chain().focus().setColor(color).run()}
              className="size-5 rounded-full ring-1 ring-navy/20"
              style={{ background: color }}
            />
          ))}
          <Tool
            title="Clear formatting"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            ⌫
          </Tool>
        </div>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={addImageFromFile}
          className="hidden"
        />
      </div>

      {error && (
        <p className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-[13px] text-amber-900">
          {error}
        </p>
      )}

      <EditorContent
        editor={editor}
        className="prose-mxl max-h-[640px] min-h-[420px] overflow-y-auto px-6 py-5"
      />

      <div className="flex flex-wrap items-center gap-4 border-t border-navy/10 bg-admin-bg px-4 py-2 text-[12px] text-navy/55">
        <span>{editor.storage.characterCount?.words?.() ?? wordCount(value)} words</span>
        <span>Tip: paste a YouTube link with the ▶ button to embed the player.</span>
      </div>
    </div>
  )
}

function wordCount(html = '') {
  return html
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}
