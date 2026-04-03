import { useState, useCallback, useRef, useEffect } from 'react'
import TopBar from './components/TopBar'
import LeftPanel from './panels/LeftPanel'
import RightPanel from './panels/RightPanel'
import { useStore } from './store/useStore'

export default function App() {
    const fullScreen = useStore(s => s.fullScreen)
    const [leftWidth, setLeftWidth] = useState(420)
    const dragging = useRef(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const onMouseDown = useCallback(() => { dragging.current = true }, [])

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!dragging.current || !containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            setLeftWidth(Math.max(320, Math.min(x, rect.width - 400)))
        }
        const onUp = () => { dragging.current = false }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }
    }, [])

    if (fullScreen) {
        return (
            <div className="h-full flex flex-col">
                <TopBar />
                <div className="flex-1 overflow-hidden">
                    <RightPanel />
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <TopBar />
            <div ref={containerRef} className="flex-1 flex overflow-hidden">
                <div style={{ width: leftWidth, minWidth: 320 }} className="flex-shrink-0 overflow-hidden">
                    <LeftPanel />
                </div>
                <div className="split-resizer" onMouseDown={onMouseDown} />
                <div className="flex-1 overflow-hidden">
                    <RightPanel />
                </div>
            </div>
        </div>
    )
}
