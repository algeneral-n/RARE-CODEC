import Editor from '@monaco-editor/react'
import { useStore } from '../store/useStore'

function getLang(path: string): string {
  if (path.endsWith('.tsx') || path.endsWith('.ts')) return 'typescript'
  if (path.endsWith('.jsx') || path.endsWith('.js')) return 'javascript'
  if (path.endsWith('.css')) return 'css'
  if (path.endsWith('.html')) return 'html'
  if (path.endsWith('.json')) return 'json'
  if (path.endsWith('.md')) return 'markdown'
  return 'plaintext'
}

export default function MonacoEditor() {
  const { activeFile, files, updateFile, setDirty } = useStore()
  const content = files[activeFile] ?? '// Select a file from the tree'

  return (
    <div className="h-full flex flex-col">
      {/* File tab */}
      <div className="flex items-center h-8 px-3 border-b text-xs"
        style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
        <span className="truncate">{activeFile || 'No file selected'}</span>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLang(activeFile)}
          value={content}
          theme="vs-dark"
          onChange={(val) => {
            if (val !== undefined) {
              setDirty(true)
              updateFile(activeFile, val)
            }
          }}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 8, bottom: 8 },
            lineNumbers: 'on',
            renderLineHighlight: 'gutter',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  )
}
