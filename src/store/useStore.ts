import { create } from 'zustand'

/* ── Types ── */
export type LeftMode = 'builder' | 'debugger' | 'planner' | 'designer'
export type RightTab = 'preview' | 'code' | 'terminal' | 'templates'
export type BuilderFlow = 'none' | 'build-plan' | 'import-repo' | 'instructions' | 'design'
export type DeviceView = 'mobile' | 'tablet' | 'desktop'
export type BuildType = 'web' | 'ios' | 'android' | 'hybrid'

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant' | 'system'
    text: string
    ts: number
}

export interface CodeProblem {
    title: string
    where: string
    severity: 'low' | 'medium' | 'high'
}

export interface ProjectState {
    /* ── Project ── */
    projectName: string
    description: string
    buildType: BuildType
    customDomain: string
    domainVerified: boolean

    /* ── Files (virtual FS) ── */
    files: Record<string, string>
    activeFile: string
    dirty: boolean
    expandedDirs: Set<string>

    /* ── Panels ── */
    leftMode: LeftMode
    rightTab: RightTab
    builderFlow: BuilderFlow

    /* ── Preview ── */
    deviceView: DeviceView
    zoom: number
    fullScreen: boolean
    visualEdit: boolean
    askMode: boolean

    /* ── AI Chat ── */
    messages: ChatMessage[]
    chatLoading: boolean

    /* ── GitHub ── */
    githubConnected: boolean
    selectedRepo: string

    /* ── Terminal ── */
    terminalHistory: string[]

    /* ── Debugger ── */
    problems: CodeProblem[]

    /* ── Voice ── */
    voiceListening: boolean

    /* ── Actions ── */
    setProjectName: (n: string) => void
    setDescription: (d: string) => void
    setBuildType: (t: BuildType) => void
    setCustomDomain: (d: string) => void
    setDomainVerified: (v: boolean) => void
    setLeftMode: (m: LeftMode) => void
    setRightTab: (t: RightTab) => void
    setBuilderFlow: (f: BuilderFlow) => void
    setDeviceView: (d: DeviceView) => void
    setZoom: (z: number) => void
    setFullScreen: (f: boolean) => void
    setVisualEdit: (v: boolean) => void
    setAskMode: (a: boolean) => void
    setActiveFile: (f: string) => void
    setDirty: (d: boolean) => void
    toggleDir: (dir: string) => void
    updateFile: (path: string, content: string) => void
    addFile: (path: string, content: string) => void
    deleteFile: (path: string) => void
    addMessage: (msg: Omit<ChatMessage, 'id' | 'ts'>) => void
    setChatLoading: (l: boolean) => void
    setGithubConnected: (c: boolean) => void
    setSelectedRepo: (r: string) => void
    addTerminalLine: (line: string) => void
    setProblems: (p: CodeProblem[]) => void
    setVoiceListening: (v: boolean) => void
}

/* ── Default project files ── */
const defaultFiles: Record<string, string> = {
    '/src/App.tsx': `export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <h1>RARE CODEC</h1>
        <p>Build visually, edit code instantly, publish fast.</p>
        <button className="cta">Start Building</button>
      </section>
    </main>
  );
}
`,
    '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
)
`,
    '/src/index.css': `.app-shell {
  font-family: Inter, system-ui, sans-serif;
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  color: #6b7280;
  margin: 0 0 1.5rem;
}

.cta {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  background: #111;
  color: #fff;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.cta:hover { background: #333; }
`,
    '/public/index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>RARE CODEC App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
`,
    '/package.json': `{
  "name": "my-rare-app",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
`,
    '/vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
`
}

let msgId = 0

export const useStore = create<ProjectState>((set) => ({
    /* ── Defaults ── */
    projectName: 'rare-codec',
    description: 'Split-screen AI builder IDE with live preview and code editing.',
    buildType: 'web',
    customDomain: 'app.example.com',
    domainVerified: false,

    files: defaultFiles,
    activeFile: '/src/App.tsx',
    dirty: false,
    expandedDirs: new Set(['/src', '/public']),

    leftMode: 'builder',
    rightTab: 'preview',
    builderFlow: 'none',

    deviceView: 'desktop',
    zoom: 100,
    fullScreen: false,
    visualEdit: false,
    askMode: false,

    messages: [{
        id: 'init',
        role: 'assistant',
        text: 'RARE Builder ready. All project tools are available.',
        ts: Date.now()
    }],
    chatLoading: false,

    githubConnected: false,
    selectedRepo: 'RARE 4N',

    terminalHistory: ['$ RARE Smart Terminal ready', '$ waiting for command...'],

    problems: [
        { title: 'Missing favicon reference', where: '/public/index.html', severity: 'low' },
        { title: 'Unused import detected', where: '/src/App.tsx', severity: 'medium' },
    ],

    voiceListening: false,

    /* ── Actions ── */
    setProjectName: (n) => set({ projectName: n }),
    setDescription: (d) => set({ description: d }),
    setBuildType: (t) => set({ buildType: t }),
    setCustomDomain: (d) => set({ customDomain: d }),
    setDomainVerified: (v) => set({ domainVerified: v }),
    setLeftMode: (m) => set({ leftMode: m }),
    setRightTab: (t) => set({ rightTab: t }),
    setBuilderFlow: (f) => set({ builderFlow: f }),
    setDeviceView: (d) => set({ deviceView: d }),
    setZoom: (z) => set({ zoom: Math.max(50, Math.min(150, z)) }),
    setFullScreen: (f) => set({ fullScreen: f }),
    setVisualEdit: (v) => set({ visualEdit: v, askMode: false }),
    setAskMode: (a) => set({ askMode: a, visualEdit: false }),
    setActiveFile: (f) => set({ activeFile: f, dirty: false }),
    setDirty: (d) => set({ dirty: d }),
    toggleDir: (dir) => set((s) => {
        const next = new Set(s.expandedDirs)
        next.has(dir) ? next.delete(dir) : next.add(dir)
        return { expandedDirs: next }
    }),
    updateFile: (path, content) => set((s) => ({
        files: { ...s.files, [path]: content },
        dirty: false
    })),
    addFile: (path, content) => set((s) => ({
        files: { ...s.files, [path]: content },
        activeFile: path
    })),
    deleteFile: (path) => set((s) => {
        const { [path]: _, ...rest } = s.files
        return { files: rest, activeFile: Object.keys(rest)[0] || '' }
    }),
    addMessage: (msg) => set((s) => ({
        messages: [...s.messages, { ...msg, id: `msg-${++msgId}`, ts: Date.now() }]
    })),
    setChatLoading: (l) => set({ chatLoading: l }),
    setGithubConnected: (c) => set({ githubConnected: c }),
    setSelectedRepo: (r) => set({ selectedRepo: r }),
    addTerminalLine: (line) => set((s) => ({
        terminalHistory: [...s.terminalHistory, line]
    })),
    setProblems: (p) => set({ problems: p }),
    setVoiceListening: (v) => set({ voiceListening: v }),
}))
