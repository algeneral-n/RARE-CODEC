import { useStore } from '../store/useStore'
import type { RightTab } from '../store/useStore'
import MonacoEditor from '../editor/MonacoEditor'
import FileTree from '../editor/FileTree'
import LivePreview from '../preview/LivePreview'
import SmartTerminal from '../terminal/SmartTerminal'
import TemplateGallery from '../templates/TemplateGallery'
import { Eye, Code2, Terminal, LayoutGrid } from 'lucide-react'

const tabs: { key: RightTab; icon: typeof Eye; label: string }[] = [
    { key: 'preview', icon: Eye, label: 'Preview' },
    { key: 'code', icon: Code2, label: 'Code' },
    { key: 'terminal', icon: Terminal, label: 'Terminal' },
    { key: 'templates', icon: LayoutGrid, label: 'Templates' },
]

export default function RightPanel() {
    const { rightTab, setRightTab } = useStore()

    return (
        <div className="h-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
            {/* Tab bar */}
            <div className="flex items-center border-b px-1" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                {tabs.map(({ key, icon: Icon, label }) => (
                    <button
                        key={key}
                        onClick={() => setRightTab(key)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative"
                        style={{
                            color: rightTab === key ? 'var(--text-primary)' : 'var(--text-muted)',
                        }}
                    >
                        <Icon size={16} />
                        {label}
                        {rightTab === key && (
                            <div className="absolute bottom-0 left-1 right-1 h-0.5 rounded-t"
                                style={{ background: 'var(--accent)' }} />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden">
                {rightTab === 'preview' && <LivePreview />}
                {rightTab === 'code' && (
                    <div className="h-full flex">
                        <FileTree />
                        <div className="flex-1 overflow-hidden">
                            <MonacoEditor />
                        </div>
                    </div>
                )}
                {rightTab === 'terminal' && <SmartTerminal />}
                {rightTab === 'templates' && <TemplateGallery />}
            </div>
        </div>
    )
}
