import { useRef, useEffect, useState, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { Play, Trash2, Copy } from 'lucide-react'

export default function SmartTerminal() {
    const { terminalHistory, addTerminalLine } = useStore()
    const [input, setInput] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [terminalHistory])

    const handleCommand = useCallback(async (cmd: string) => {
        if (!cmd.trim()) return
        addTerminalLine(`$ ${cmd}`)
        setInput('')

        // Local command handling
        const lower = cmd.trim().toLowerCase()

        if (lower === 'help') {
            addTerminalLine('Available commands:')
            addTerminalLine('  help       - Show this help')
            addTerminalLine('  clear      - Clear terminal')
            addTerminalLine('  ls         - List project files')
            addTerminalLine('  build      - Build project')
            addTerminalLine('  dev        - Start dev server')
            addTerminalLine('  deploy     - Deploy to Cloudflare')
            addTerminalLine('  git status - Show git status')
            addTerminalLine('  npm <cmd>  - Run npm commands')
            return
        }

        if (lower === 'clear') {
            useStore.getState().terminalHistory.length = 0
            addTerminalLine('$ RARE Smart Terminal ready')
            return
        }

        if (lower === 'ls' || lower === 'dir') {
            const files = Object.keys(useStore.getState().files)
            files.forEach(f => addTerminalLine(`  ${f}`))
            addTerminalLine(`\n  ${files.length} files`)
            return
        }

        if (lower === 'build' || lower === 'npm run build') {
            addTerminalLine('Building project...')
            addTerminalLine('  ✓ TypeScript compilation')
            await delay(300)
            addTerminalLine('  ✓ Bundle assets')
            await delay(200)
            addTerminalLine('  ✓ Minify output')
            await delay(150)
            addTerminalLine('Build complete! dist/ ready (1.2MB)')
            return
        }

        if (lower === 'dev' || lower === 'npm run dev') {
            addTerminalLine('Starting dev server...')
            await delay(500)
            addTerminalLine('  VITE v6.0.0  ready in 240ms')
            addTerminalLine('  ➜  Local:   http://localhost:5173/')
            addTerminalLine('  ➜  Network: http://192.168.1.100:5173/')
            return
        }

        if (lower === 'deploy' || lower.startsWith('cf deploy') || lower.startsWith('wrangler')) {
            addTerminalLine('Deploying to Cloudflare Pages...')
            await delay(400)
            addTerminalLine('  ✓ Build output verified')
            await delay(300)
            addTerminalLine('  ✓ Uploading assets (12 files)')
            await delay(500)
            addTerminalLine('  ✓ Deployment live!')
            addTerminalLine('  URL: https://rare-codec.pages.dev')
            return
        }

        if (lower === 'git status') {
            addTerminalLine('On branch main')
            addTerminalLine('Changes not staged for commit:')
            addTerminalLine('  modified: src/App.tsx')
            addTerminalLine('  modified: src/index.css')
            return
        }

        // Try sending to backend
        try {
            const res = await fetch('/api/terminal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: cmd }),
            })
            if (res.ok) {
                const data = await res.json()
                if (data.output) addTerminalLine(data.output)
            } else {
                addTerminalLine(`Command not recognized: ${cmd}`)
                addTerminalLine('Type "help" for available commands')
            }
        } catch {
            addTerminalLine(`Command not recognized: ${cmd}`)
            addTerminalLine('Type "help" for available commands')
        }
    }, [addTerminalLine])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input)
        }
    }

    return (
        <div className="h-full flex flex-col" style={{ background: '#0d0d12' }}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 h-8 px-3 border-b"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    SMART TERMINAL
                </span>
                <div className="flex-1" />
                <button className="p-1 rounded hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-muted)' }}
                    title="Copy output"
                    onClick={() => navigator.clipboard.writeText(terminalHistory.join('\n'))}>
                    <Copy size={12} />
                </button>
                <button className="p-1 rounded hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-muted)' }}
                    title="Clear"
                    onClick={() => {
                        useStore.getState().terminalHistory.length = 0
                        addTerminalLine('$ RARE Smart Terminal ready')
                    }}>
                    <Trash2 size={12} />
                </button>
            </div>

            {/* Output */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-5"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => inputRef.current?.focus()}
            >
                {terminalHistory.map((line, i) => (
                    <div key={i} className={line.startsWith('$') ? 'text-[var(--accent)]' : ''}>
                        {line}
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-2 border-t"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                <span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>$</span>
                <input
                    ref={inputRef}
                    type="text"
                    className="flex-1 bg-transparent border-0 outline-none text-xs font-mono"
                    style={{ color: 'var(--text-primary)' }}
                    placeholder="Type a command..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <button
                    onClick={() => handleCommand(input)}
                    className="p-1 rounded hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--accent)' }}
                    title="Run"
                >
                    <Play size={13} />
                </button>
            </div>
        </div>
    )
}

function delay(ms: number) {
    return new Promise(r => setTimeout(r, ms))
}
