import { useStore } from '../store/useStore'
import type { DeviceView } from '../store/useStore'
import {
    Smartphone, Tablet, Monitor, ZoomIn, ZoomOut,
    Github, Globe, Settings, Maximize2, Minimize2,
    Mic, MicOff, Eye, MousePointerClick
} from 'lucide-react'

const devices: { key: DeviceView; icon: typeof Smartphone; label: string }[] = [
    { key: 'mobile', icon: Smartphone, label: 'Mobile' },
    { key: 'tablet', icon: Tablet, label: 'Tablet' },
    { key: 'desktop', icon: Monitor, label: 'Desktop' },
]

export default function TopBar() {
    const {
        projectName, deviceView, setDeviceView, zoom, setZoom,
        fullScreen, setFullScreen, visualEdit, setVisualEdit,
        askMode, setAskMode, voiceListening, setVoiceListening,
        rightTab, setRightTab
    } = useStore()

    return (
        <header className="h-11 flex items-center gap-1 px-3 border-b"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>

            {/* Logo + Project */}
            <div className="flex items-center gap-2 mr-3">
                <div className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs"
                    style={{ background: 'var(--accent)' }}>R</div>
                <span className="font-semibold text-sm truncate max-w-[140px]">{projectName}</span>
            </div>

            <div className="h-5 w-px mx-1" style={{ background: 'var(--border)' }} />

            {/* Visual / Ask toggles */}
            <button
                onClick={() => setVisualEdit(!visualEdit)}
                className="px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                style={{
                    background: visualEdit ? 'var(--accent)' : 'transparent',
                    color: visualEdit ? '#fff' : 'var(--text-secondary)'
                }}
                title="Visual Edit"
            >
                <Eye size={14} />
                <span className="hidden sm:inline">Visual</span>
            </button>
            <button
                onClick={() => setAskMode(!askMode)}
                className="px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
                style={{
                    background: askMode ? 'var(--accent)' : 'transparent',
                    color: askMode ? '#fff' : 'var(--text-secondary)'
                }}
                title="Ask Mode"
            >
                <MousePointerClick size={14} />
                <span className="hidden sm:inline">Ask</span>
            </button>

            <div className="flex-1" />

            {/* Device Preview */}
            <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-lg"
                style={{ background: 'var(--bg-tertiary)' }}>
                {devices.map(({ key, icon: Icon, label }) => (
                    <button
                        key={key}
                        onClick={() => { setDeviceView(key); setRightTab('preview') }}
                        className="p-1.5 rounded-md transition-colors"
                        style={{
                            background: deviceView === key ? 'var(--bg-hover)' : 'transparent',
                            color: deviceView === key ? 'var(--text-primary)' : 'var(--text-muted)'
                        }}
                        title={label}
                    >
                        <Icon size={14} />
                    </button>
                ))}
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-1 ml-1">
                <button onClick={() => setZoom(zoom - 10)} className="p-1 rounded hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-secondary)' }}>
                    <ZoomOut size={14} />
                </button>
                <span className="text-xs tabular-nums w-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                    {zoom}%
                </span>
                <button onClick={() => setZoom(zoom + 10)} className="p-1 rounded hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-secondary)' }}>
                    <ZoomIn size={14} />
                </button>
            </div>

            <div className="h-5 w-px mx-1" style={{ background: 'var(--border)' }} />

            {/* Voice */}
            <button
                onClick={() => setVoiceListening(!voiceListening)}
                className="p-1.5 rounded-md transition-colors"
                style={{
                    background: voiceListening ? 'rgba(239,68,68,0.15)' : 'transparent',
                    color: voiceListening ? 'var(--error)' : 'var(--text-secondary)'
                }}
                title={voiceListening ? 'Stop Listening' : 'Voice Command'}
            >
                {voiceListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>

            {/* GitHub */}
            <button
                onClick={() => { setRightTab('code'); /* open GitHub panel via store or modal */ }}
                className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-secondary)' }}
                title="GitHub"
            >
                <Github size={15} />
            </button>

            {/* Publish */}
            <button
                className="px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
                style={{ background: 'var(--accent)', color: '#fff' }}
                title="Publish"
            >
                <Globe size={13} />
                Publish
            </button>

            {/* Fullscreen */}
            <button
                onClick={() => setFullScreen(!fullScreen)}
                className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-secondary)' }}
                title={fullScreen ? 'Exit Full Screen' : 'Full Screen'}
            >
                {fullScreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Settings */}
            <button
                className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-secondary)' }}
                title="Settings"
            >
                <Settings size={15} />
            </button>
        </header>
    )
}
