import { useState, useRef, useEffect, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { Send, Loader2, Bot, User, Sparkles, Paperclip, Image as ImageIcon } from 'lucide-react'
import { callAI } from './AIBridge'

export default function ChatPanel() {
    const { messages, chatLoading, addMessage, setChatLoading, leftMode } = useStore()
    const [input, setInput] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = useCallback(async () => {
        const text = input.trim()
        if (!text || chatLoading) return

        addMessage({ role: 'user', text })
        setInput('')
        setChatLoading(true)

        try {
            const response = await callAI(text, leftMode)
            addMessage({ role: 'assistant', text: response })
        } catch (err: any) {
            addMessage({ role: 'system', text: `Error: ${err.message}` })
        } finally {
            setChatLoading(false)
        }
    }, [input, chatLoading, addMessage, setChatLoading, leftMode])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const modeLabel: Record<string, string> = {
        builder: 'Builder',
        debugger: 'Debugger',
        planner: 'Planner',
        designer: 'Designer',
    }

    return (
        <div className="h-full flex flex-col">
            {/* Mode badge */}
            <div className="px-3 py-1.5 flex items-center gap-2 border-b"
                style={{ borderColor: 'var(--border)' }}>
                <Sparkles size={12} style={{ color: 'var(--accent)' }} />
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    AI — {modeLabel[leftMode]} Mode
                </span>
                <div className="flex-1" />
                <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--success)' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Connected</span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map(msg => (
                    <div key={msg.id} className="animate-in">
                        <div className="flex items-start gap-2">
                            {/* Avatar */}
                            <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: msg.role === 'user' ? 'var(--bg-tertiary)' :
                                        msg.role === 'system' ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)',
                                }}>
                                {msg.role === 'user' ? <User size={12} style={{ color: 'var(--text-secondary)' }} /> :
                                    msg.role === 'system' ? <Bot size={12} style={{ color: 'var(--error)' }} /> :
                                        <Bot size={12} style={{ color: 'var(--accent)' }} />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] mb-0.5 font-medium"
                                    style={{ color: 'var(--text-muted)' }}>
                                    {msg.role === 'user' ? 'You' : msg.role === 'system' ? 'System' : 'RARE AI'}
                                </div>
                                <div className="text-xs leading-relaxed whitespace-pre-wrap"
                                    style={{
                                        color: msg.role === 'system' ? 'var(--error)' : 'var(--text-primary)',
                                    }}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {chatLoading && (
                    <div className="flex items-center gap-2 animate-in">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{ background: 'rgba(99,102,241,0.15)' }}>
                            <Loader2 size={12} className="animate-spin" style={{ color: 'var(--accent)' }} />
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent)' }} />
                            <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent)', animationDelay: '0.3s' }} />
                            <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--accent)', animationDelay: '0.6s' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-end gap-1.5 p-2 rounded-xl border"
                    style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-bright)' }}>
                    <button className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] self-end"
                        style={{ color: 'var(--text-muted)' }} title="Attach file">
                        <Paperclip size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] self-end"
                        style={{ color: 'var(--text-muted)' }} title="Upload image">
                        <ImageIcon size={14} />
                    </button>
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Ask the ${modeLabel[leftMode]}...`}
                        className="flex-1 bg-transparent border-0 outline-none text-xs resize-none leading-5"
                        style={{ color: 'var(--text-primary)', maxHeight: 120 }}
                        rows={1}
                        onInput={e => {
                            const el = e.currentTarget
                            el.style.height = 'auto'
                            el.style.height = Math.min(el.scrollHeight, 120) + 'px'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={chatLoading || !input.trim()}
                        className="p-2 rounded-lg transition-colors self-end"
                        style={{
                            background: input.trim() ? 'var(--accent)' : 'var(--bg-hover)',
                            color: input.trim() ? '#fff' : 'var(--text-muted)',
                            cursor: input.trim() ? 'pointer' : 'not-allowed',
                        }}
                    >
                        <Send size={14} />
                    </button>
                </div>
                <div className="text-[10px] text-center mt-1.5" style={{ color: 'var(--text-muted)' }}>
                    RARE AI • Press Enter to send, Shift+Enter for new line
                </div>
            </div>
        </div>
    )
}
