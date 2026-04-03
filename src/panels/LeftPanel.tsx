import { useStore } from '../store/useStore'
import type { LeftMode, BuilderFlow } from '../store/useStore'
import ChatPanel from '../ai/ChatPanel'
import {
    Hammer, Bug, Map, Palette,
    FileCode, GitBranch, Wand2, PaintBucket
} from 'lucide-react'

const modes: { key: LeftMode; icon: typeof Hammer; label: string }[] = [
    { key: 'builder', icon: Hammer, label: 'Builder' },
    { key: 'debugger', icon: Bug, label: 'Debugger' },
    { key: 'planner', icon: Map, label: 'Planner' },
    { key: 'designer', icon: Palette, label: 'Designer' },
]

const builderActions: { key: BuilderFlow; icon: typeof FileCode; label: string; desc: string }[] = [
    { key: 'build-plan', icon: Wand2, label: 'Build Plan', desc: 'AI creates project structure' },
    { key: 'import-repo', icon: GitBranch, label: 'Import Repo', desc: 'Clone from GitHub' },
    { key: 'instructions', icon: FileCode, label: 'Instructions', desc: 'Describe what to build' },
    { key: 'design', icon: PaintBucket, label: 'Design', desc: 'Upload or describe design' },
]

export default function LeftPanel() {
    const { leftMode, setLeftMode, builderFlow, setBuilderFlow, problems } = useStore()

    return (
        <div className="h-full flex flex-col" style={{ background: 'var(--bg-secondary)' }}>
            {/* Mode tabs */}
            <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
                {modes.map(({ key, icon: Icon, label }) => (
                    <button
                        key={key}
                        onClick={() => setLeftMode(key)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative"
                        style={{
                            color: leftMode === key ? 'var(--accent)' : 'var(--text-secondary)',
                            background: leftMode === key ? 'var(--bg-tertiary)' : 'transparent'
                        }}
                    >
                        <Icon size={16} />
                        {label}
                        {key === 'debugger' && problems.length > 0 && (
                            <span className="absolute top-1.5 right-2 w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold"
                                style={{ background: 'var(--error)', color: '#fff' }}>
                                {problems.length}
                            </span>
                        )}
                        {leftMode === key && (
                            <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t"
                                style={{ background: 'var(--accent)' }} />
                        )}
                    </button>
                ))}
            </div>

            {/* Mode-specific header */}
            {leftMode === 'builder' && builderFlow === 'none' && (
                <div className="p-3 grid grid-cols-2 gap-2 border-b animate-in"
                    style={{ borderColor: 'var(--border)' }}>
                    {builderActions.map(({ key, icon: Icon, label, desc }) => (
                        <button
                            key={key}
                            onClick={() => setBuilderFlow(key)}
                            className="p-3 rounded-lg text-left transition-colors border"
                            style={{
                                background: 'var(--bg-tertiary)',
                                borderColor: 'var(--border)',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                            }}
                        >
                            <Icon size={16} style={{ color: 'var(--accent)' }} />
                            <div className="text-xs font-medium mt-1.5">{label}</div>
                            <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                        </button>
                    ))}
                </div>
            )}

            {leftMode === 'builder' && builderFlow !== 'none' && (
                <BuilderFlowHeader />
            )}

            {leftMode === 'debugger' && <DebuggerHeader />}
            {leftMode === 'planner' && <PlannerHeader />}
            {leftMode === 'designer' && <DesignerHeader />}

            {/* Chat panel (always visible below) */}
            <div className="flex-1 overflow-hidden">
                <ChatPanel />
            </div>
        </div>
    )
}

/* ── Builder Flow Header ── */
function BuilderFlowHeader() {
    const { builderFlow, setBuilderFlow, setDescription } = useStore()

    const titles: Record<BuilderFlow, string> = {
        'none': '',
        'build-plan': 'Build Plan — AI will generate a project structure',
        'import-repo': 'Import Repository — paste a GitHub URL',
        'instructions': 'Instructions — describe what to build',
        'design': 'Design Input — upload or describe your design',
    }

    return (
        <div className="p-3 border-b animate-in" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                    {titles[builderFlow]}
                </span>
                <button
                    onClick={() => setBuilderFlow('none')}
                    className="text-[11px] px-2 py-0.5 rounded"
                    style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}
                >
                    Back
                </button>
            </div>
            {builderFlow === 'instructions' && (
                <textarea
                    className="w-full h-20 rounded-lg p-2 text-xs resize-none border"
                    style={{
                        background: 'var(--bg-primary)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                    }}
                    placeholder="Describe your app in detail..."
                    onChange={e => setDescription(e.target.value)}
                />
            )}
            {builderFlow === 'import-repo' && (
                <input
                    className="w-full rounded-lg p-2 text-xs border"
                    style={{
                        background: 'var(--bg-primary)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                    }}
                    placeholder="https://github.com/user/repo"
                />
            )}
            {builderFlow === 'design' && (
                <div className="border-2 border-dashed rounded-lg p-4 text-center"
                    style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Drop image or paste Figma URL
                    </p>
                </div>
            )}
        </div>
    )
}

/* ── Debugger Header ── */
function DebuggerHeader() {
    const { problems } = useStore()
    return (
        <div className="p-3 border-b animate-in" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <Bug size={13} style={{ color: 'var(--error)' }} />
                Problems ({problems.length})
            </h3>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {problems.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded text-xs"
                        style={{ background: 'var(--bg-tertiary)' }}>
                        <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                            style={{ background: p.severity === 'high' ? 'var(--error)' : p.severity === 'medium' ? 'var(--warning)' : 'var(--info)' }} />
                        <div>
                            <span className="font-medium">{p.title}</span>
                            <span className="block" style={{ color: 'var(--text-muted)' }}>{p.where}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ── Planner Header ── */
function PlannerHeader() {
    return (
        <div className="p-3 border-b animate-in" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <Map size={13} style={{ color: 'var(--accent)' }} />
                Project Plan
            </h3>
            <div className="space-y-1.5">
                {['Scaffold project', 'Build auth flow', 'Create dashboard', 'Add API routes', 'Deploy'].map((step, i) => (
                    <div key={i} className="flex items-center gap-2 p-1.5 rounded text-xs"
                        style={{ background: i === 0 ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{
                                background: i === 0 ? 'var(--accent)' : 'var(--bg-tertiary)',
                                color: i === 0 ? '#fff' : 'var(--text-muted)'
                            }}>
                            {i + 1}
                        </div>
                        <span style={{ color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ── Designer Header ── */
function DesignerHeader() {
    return (
        <div className="p-3 border-b animate-in" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                <Palette size={13} style={{ color: 'var(--accent)' }} />
                Design Settings
            </h3>
            <div className="space-y-2">
                <div>
                    <label className="text-[11px] mb-1 block" style={{ color: 'var(--text-muted)' }}>Primary Color</label>
                    <div className="flex gap-1.5">
                        {['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6', '#8b5cf6'].map(c => (
                            <button
                                key={c}
                                className="w-6 h-6 rounded-md border-2 transition-transform hover:scale-110"
                                style={{ background: c, borderColor: c === '#6366f1' ? '#fff' : 'transparent' }}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-[11px] mb-1 block" style={{ color: 'var(--text-muted)' }}>Font</label>
                    <select className="w-full p-1.5 rounded text-xs border"
                        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        <option>Inter</option>
                        <option>Poppins</option>
                        <option>JetBrains Mono</option>
                        <option>Cairo</option>
                    </select>
                </div>
                <div>
                    <label className="text-[11px] mb-1 block" style={{ color: 'var(--text-muted)' }}>Border Radius</label>
                    <input type="range" min="0" max="24" defaultValue="12" className="w-full" />
                </div>
            </div>
        </div>
    )
}
