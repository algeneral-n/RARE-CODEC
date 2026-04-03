import { useMemo } from 'react'
import { useStore } from '../store/useStore'
import { Smartphone, Tablet, Monitor, RefreshCw, ExternalLink } from 'lucide-react'

const deviceFrames: Record<string, { w: number; h: number }> = {
    mobile: { w: 375, h: 667 },
    tablet: { w: 768, h: 1024 },
    desktop: { w: 1280, h: 800 },
}

export default function LivePreview() {
    const { files, deviceView, zoom, visualEdit, askMode } = useStore()

    const srcDoc = useMemo(() => {
        const appTsx = files['/src/App.tsx'] || ''
        const css = files['/src/index.css'] || ''

        // Simple transform: strip import/export, wrap in basic HTML
        const appCode = appTsx
            .replace(/^import\s+.*$/gm, '')
            .replace(/^export\s+default\s+/m, 'const AppComponent = ')

        return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Inter, system-ui, sans-serif; background: #fff; }
  ${css}
</style>
<script src="https://unpkg.com/react@19/umd/react.production.min.js"><\/script>
<script src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
</head>
<body>
<div id="preview-root"></div>
<script type="text/babel">
${appCode}

const root = ReactDOM.createRoot(document.getElementById('preview-root'));
try {
  root.render(React.createElement(AppComponent));
} catch(e) {
  document.getElementById('preview-root').innerHTML =
    '<div style="padding:2rem;color:#ef4444;font-size:14px"><b>Render Error:</b><br/>' + e.message + '</div>';
}
<\/script>
${visualEdit ? `<script>
  document.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const el = e.target;
    const outline = document.createElement('div');
    outline.style.cssText = 'position:fixed;border:2px solid #6366f1;pointer-events:none;z-index:99999;border-radius:4px;';
    const r = el.getBoundingClientRect();
    outline.style.top = r.top + 'px';
    outline.style.left = r.left + 'px';
    outline.style.width = r.width + 'px';
    outline.style.height = r.height + 'px';
    document.querySelectorAll('.ve-outline').forEach(o => o.remove());
    outline.className = 've-outline';
    document.body.appendChild(outline);
    window.parent.postMessage({ type: 'visual-select', tag: el.tagName, text: el.textContent?.slice(0,50) }, '*');
  }, true);
<\/script>` : ''}
${askMode ? `<script>
  document.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const el = e.target;
    window.parent.postMessage({ type: 'ask-pin', tag: el.tagName, text: el.textContent?.slice(0,80) }, '*');
  }, true);
<\/script>` : ''}
</body>
</html>`
    }, [files, visualEdit, askMode])

    const frame = deviceFrames[deviceView]
    const scale = zoom / 100

    return (
        <div className="h-full flex flex-col">
            {/* Preview toolbar */}
            <div className="flex items-center gap-2 h-9 px-3 border-b"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-1">
                    {deviceView === 'mobile' && <Smartphone size={13} style={{ color: 'var(--accent)' }} />}
                    {deviceView === 'tablet' && <Tablet size={13} style={{ color: 'var(--accent)' }} />}
                    {deviceView === 'desktop' && <Monitor size={13} style={{ color: 'var(--accent)' }} />}
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {frame.w} × {frame.h}
                    </span>
                </div>
                <div className="flex-1" />
                {visualEdit && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent)' }}>
                        Visual Edit ON
                    </span>
                )}
                {askMode && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}>
                        Ask Mode ON
                    </span>
                )}
                <button className="p-1 rounded hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-muted)' }} title="Refresh">
                    <RefreshCw size={13} />
                </button>
                <button className="p-1 rounded hover:bg-[var(--bg-hover)]"
                    style={{ color: 'var(--text-muted)' }} title="Open in new tab">
                    <ExternalLink size={13} />
                </button>
            </div>

            {/* Preview area */}
            <div className="flex-1 flex items-center justify-center overflow-auto p-4"
                style={{ background: '#0d0d12' }}>
                <div
                    style={{
                        width: deviceView === 'desktop' ? '100%' : frame.w,
                        maxWidth: '100%',
                        height: deviceView === 'desktop' ? '100%' : frame.h,
                        maxHeight: '100%',
                        transform: deviceView !== 'desktop' ? `scale(${scale})` : undefined,
                        transformOrigin: 'center center',
                        borderRadius: deviceView === 'mobile' ? 28 : deviceView === 'tablet' ? 16 : 8,
                        overflow: 'hidden',
                        boxShadow: '0 0 0 1px var(--border), 0 20px 60px rgba(0,0,0,0.5)',
                    }}
                >
                    <iframe
                        srcDoc={srcDoc}
                        title="Preview"
                        className="w-full h-full border-0"
                        style={{ background: '#fff' }}
                        sandbox="allow-scripts allow-same-origin"
                    />
                </div>
            </div>
        </div>
    )
}
