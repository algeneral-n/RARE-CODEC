import { useStore } from '../store/useStore'
import { Code2, ShoppingCart, BarChart3, MessageSquare, Palette, Globe, Layout, FileText, Database, Zap } from 'lucide-react'

interface Template {
    id: string
    name: string
    description: string
    icon: typeof Code2
    category: string
    files: Record<string, string>
}

const templates: Template[] = [
    {
        id: 'landing', name: 'Landing Page', description: 'Modern hero + features + CTA',
        icon: Layout, category: 'Marketing',
        files: {
            '/src/App.tsx': `export default function App() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',maxWidth:960,margin:'0 auto',padding:'2rem'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 0'}}>
        <h2 style={{fontWeight:800}}>Brand</h2>
        <div style={{display:'flex',gap:'1.5rem',fontSize:14}}>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </div>
      </nav>
      <section style={{textAlign:'center',padding:'4rem 0'}}>
        <h1 style={{fontSize:'3rem',fontWeight:800,lineHeight:1.1}}>Build something amazing</h1>
        <p style={{color:'#6b7280',maxWidth:500,margin:'1rem auto'}}>The fastest way to go from idea to production with AI-powered development.</p>
        <button style={{padding:'0.75rem 2rem',background:'#6366f1',color:'#fff',border:'none',borderRadius:12,fontWeight:600,cursor:'pointer',fontSize:15}}>Get Started</button>
      </section>
      <section style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',padding:'2rem 0'}}>
        {['Lightning Fast','AI Powered','Production Ready'].map(f=>(
          <div key={f} style={{border:'1px solid #e5e7eb',borderRadius:12,padding:'1.5rem'}}>
            <h3 style={{fontWeight:600}}>{f}</h3>
            <p style={{color:'#6b7280',fontSize:14,marginTop:8}}>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
          </div>
        ))}
      </section>
    </div>
  )
}`,
            '/src/index.css': `body { margin: 0; background: #fff; }
a { color: inherit; text-decoration: none; }
a:hover { color: #6366f1; }`,
            '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)`,
        }
    },
    {
        id: 'ecommerce', name: 'E-Commerce', description: 'Product grid + cart + checkout',
        icon: ShoppingCart, category: 'Commerce',
        files: {
            '/src/App.tsx': `import { useState } from 'react'

const products = [
  { id: 1, name: 'Wireless Headphones', price: 99, img: '🎧' },
  { id: 2, name: 'Smart Watch', price: 249, img: '⌚' },
  { id: 3, name: 'Laptop Stand', price: 49, img: '💻' },
  { id: 4, name: 'Mechanical Keyboard', price: 149, img: '⌨️' },
  { id: 5, name: 'USB-C Hub', price: 39, img: '🔌' },
  { id: 6, name: 'Camera Lens', price: 299, img: '📷' },
]

export default function App() {
  const [cart, setCart] = useState<number[]>([])
  const addToCart = (id: number) => setCart(prev => [...prev, id])
  const total = cart.reduce((s, id) => s + (products.find(p => p.id === id)?.price || 0), 0)

  return (
    <div style={{fontFamily:'Inter,sans-serif',maxWidth:1100,margin:'0 auto',padding:'2rem'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:800}}>RARE Store</h1>
        <div style={{background:'#6366f1',color:'#fff',padding:'0.5rem 1rem',borderRadius:20,fontSize:13,fontWeight:600}}>
          Cart ({cart.length}) — \${total}
        </div>
      </header>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'1.5rem'}}>
        {products.map(p=>(
          <div key={p.id} style={{border:'1px solid #e5e7eb',borderRadius:16,padding:'1.5rem',textAlign:'center'}}>
            <div style={{fontSize:48,marginBottom:12}}>{p.img}</div>
            <h3 style={{fontWeight:600,fontSize:15}}>{p.name}</h3>
            <p style={{color:'#6366f1',fontWeight:700,margin:'8px 0'}}>\${p.price}</p>
            <button onClick={()=>addToCart(p.id)} style={{width:'100%',padding:'0.5rem',background:'#111',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:500}}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  )
}`,
            '/src/index.css': `body { margin: 0; background: #fafafa; }`,
            '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)`,
        }
    },
    {
        id: 'dashboard', name: 'Dashboard', description: 'Stats + charts + table',
        icon: BarChart3, category: 'SaaS',
        files: {
            '/src/App.tsx': `export default function App() {
  const stats = [
    { label: 'Revenue', value: '$12,450', change: '+12%' },
    { label: 'Users', value: '1,234', change: '+8%' },
    { label: 'Orders', value: '456', change: '+23%' },
    { label: 'Conversion', value: '3.2%', change: '+0.4%' },
  ]
  return (
    <div style={{fontFamily:'Inter,sans-serif',padding:'2rem',background:'#f9fafb',minHeight:'100vh'}}>
      <h1 style={{fontSize:'1.5rem',fontWeight:800,marginBottom:'1.5rem'}}>Dashboard</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
        {stats.map(s=>(
          <div key={s.label} style={{background:'#fff',borderRadius:12,padding:'1.25rem',boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
            <div style={{fontSize:12,color:'#6b7280',marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:'1.5rem',fontWeight:700}}>{s.value}</div>
            <div style={{fontSize:12,color:'#22c55e',marginTop:4}}>{s.change}</div>
          </div>
        ))}
      </div>
      <div style={{background:'#fff',borderRadius:12,padding:'1.5rem',boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
        <h2 style={{fontSize:15,fontWeight:600,marginBottom:'1rem'}}>Recent Orders</h2>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr style={{textAlign:'left',borderBottom:'1px solid #e5e7eb'}}>
            <th style={{padding:8}}>Order</th><th style={{padding:8}}>Customer</th><th style={{padding:8}}>Amount</th><th style={{padding:8}}>Status</th>
          </tr></thead>
          <tbody>
            {[{o:'#1234',c:'Ahmed',a:'$99',s:'Delivered'},{o:'#1235',c:'Sara',a:'$249',s:'Shipped'},{o:'#1236',c:'Ali',a:'$49',s:'Pending'}].map(r=>(
              <tr key={r.o} style={{borderBottom:'1px solid #f3f4f6'}}>
                <td style={{padding:8,fontWeight:500}}>{r.o}</td><td style={{padding:8}}>{r.c}</td><td style={{padding:8}}>{r.a}</td>
                <td style={{padding:8}}><span style={{padding:'2px 8px',borderRadius:20,fontSize:11,background:r.s==='Delivered'?'#dcfce7':r.s==='Shipped'?'#dbeafe':'#fef3c7',color:r.s==='Delivered'?'#16a34a':r.s==='Shipped'?'#2563eb':'#d97706'}}>{r.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}`,
            '/src/index.css': `body { margin: 0; }`,
            '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)`,
        }
    },
    {
        id: 'chat', name: 'Chat App', description: 'Real-time messaging UI',
        icon: MessageSquare, category: 'Communication',
        files: {
            '/src/App.tsx': `import { useState } from 'react'

const initialMessages = [
  { id: 1, sender: 'RARE AI', text: 'Hello! How can I help you today?', mine: false },
  { id: 2, sender: 'You', text: 'I want to build a mobile app', mine: true },
  { id: 3, sender: 'RARE AI', text: 'Great choice! I can help you scaffold a React Native or Flutter app. Which do you prefer?', mine: false },
]

export default function App() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: input, mine: true }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'RARE AI', text: 'I understand. Let me work on that for you...', mine: false }])
    }, 800)
  }

  return (
    <div style={{fontFamily:'Inter,sans-serif',height:'100vh',display:'flex',flexDirection:'column',background:'#f9fafb'}}>
      <header style={{padding:'1rem',borderBottom:'1px solid #e5e7eb',fontWeight:700,fontSize:16,background:'#fff'}}>Chat</header>
      <div style={{flex:1,overflow:'auto',padding:'1rem',display:'flex',flexDirection:'column',gap:12}}>
        {messages.map(m=>(
          <div key={m.id} style={{alignSelf:m.mine?'flex-end':'flex-start',maxWidth:'70%'}}>
            <div style={{fontSize:11,color:'#6b7280',marginBottom:4}}>{m.sender}</div>
            <div style={{padding:'0.75rem 1rem',borderRadius:16,background:m.mine?'#6366f1':'#fff',color:m.mine?'#fff':'#111',boxShadow:m.mine?'none':'0 1px 3px rgba(0,0,0,0.08)',fontSize:14}}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{padding:'1rem',background:'#fff',borderTop:'1px solid #e5e7eb',display:'flex',gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type a message..." style={{flex:1,padding:'0.75rem 1rem',borderRadius:12,border:'1px solid #e5e7eb',outline:'none',fontSize:14}} />
        <button onClick={send} style={{padding:'0.75rem 1.5rem',background:'#6366f1',color:'#fff',border:'none',borderRadius:12,fontWeight:600,cursor:'pointer'}}>Send</button>
      </div>
    </div>
  )
}`,
            '/src/index.css': `body { margin: 0; }`,
            '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)`,
        }
    },
    {
        id: 'portfolio', name: 'Portfolio', description: 'Personal portfolio with projects',
        icon: Palette, category: 'Personal',
        files: {
            '/src/App.tsx': `export default function App() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',maxWidth:800,margin:'0 auto',padding:'3rem 2rem'}}>
      <div style={{marginBottom:'3rem'}}>
        <h1 style={{fontSize:'2.5rem',fontWeight:800,marginBottom:8}}>John Doe</h1>
        <p style={{fontSize:18,color:'#6b7280'}}>Full-Stack Developer & Designer</p>
      </div>
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:'1rem'}}>Projects</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'1rem'}}>
        {['AI Dashboard','E-Commerce Platform','Mobile App','Design System'].map(p=>(
          <div key={p} style={{border:'1px solid #e5e7eb',borderRadius:12,padding:'1.5rem',transition:'border-color 0.2s'}}>
            <div style={{width:'100%',height:120,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:8,marginBottom:12}} />
            <h3 style={{fontWeight:600,marginBottom:4}}>{p}</h3>
            <p style={{fontSize:13,color:'#6b7280'}}>A brief description of this project and the technologies used.</p>
          </div>
        ))}
      </div>
    </div>
  )
}`,
            '/src/index.css': `body { margin: 0; background: #fff; }`,
            '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)`,
        }
    },
    {
        id: 'api', name: 'API Client', description: 'REST API tester + docs',
        icon: Globe, category: 'Developer',
        files: {
            '/src/App.tsx': `import { useState } from 'react'

export default function App() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1')
  const [method, setMethod] = useState('GET')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    setLoading(true)
    try {
      const res = await fetch(url, { method })
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch(e: any) {
      setResult('Error: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{fontFamily:'Inter,sans-serif',padding:'2rem',maxWidth:900,margin:'0 auto'}}>
      <h1 style={{fontSize:'1.5rem',fontWeight:800,marginBottom:'1.5rem'}}>API Client</h1>
      <div style={{display:'flex',gap:8,marginBottom:'1rem'}}>
        <select value={method} onChange={e=>setMethod(e.target.value)} style={{padding:'0.5rem',borderRadius:8,border:'1px solid #e5e7eb',fontWeight:600}}>
          <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
        </select>
        <input value={url} onChange={e=>setUrl(e.target.value)} style={{flex:1,padding:'0.5rem 1rem',borderRadius:8,border:'1px solid #e5e7eb',fontSize:14}} />
        <button onClick={send} style={{padding:'0.5rem 1.5rem',background:'#6366f1',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer'}}>
          {loading ? 'Loading...' : 'Send'}
        </button>
      </div>
      <pre style={{background:'#1e1e2e',color:'#e5e7eb',padding:'1.5rem',borderRadius:12,fontSize:13,overflow:'auto',maxHeight:400,whiteSpace:'pre-wrap'}}>
        {result || '// Response will appear here'}
      </pre>
    </div>
  )
}`,
            '/src/index.css': `body { margin: 0; background: #fafafa; }`,
            '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)`,
        }
    },
    {
        id: 'blog', name: 'Blog', description: 'Markdown blog with dark mode',
        icon: FileText, category: 'Content',
        files: {
            '/src/App.tsx': `export default function App() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',maxWidth:700,margin:'0 auto',padding:'3rem 2rem'}}>
      <header style={{marginBottom:'3rem'}}>
        <h1 style={{fontSize:20,fontWeight:800}}>dev.blog</h1>
      </header>
      {['Building with AI in 2026','The Future of Web Development','Understanding TypeScript Generics'].map((title,i)=>(
        <article key={i} style={{marginBottom:'2rem',paddingBottom:'2rem',borderBottom:'1px solid #e5e7eb'}}>
          <div style={{fontSize:12,color:'#6b7280',marginBottom:8}}>Jan {10+i}, 2026 · 5 min read</div>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>{title}</h2>
          <p style={{color:'#4b5563',lineHeight:1.7,fontSize:15}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
          <a href="#" style={{color:'#6366f1',fontSize:14,fontWeight:500,marginTop:8,display:'inline-block'}}>Read more →</a>
        </article>
      ))}
    </div>
  )
}`,
            '/src/index.css': `body { margin: 0; background: #fff; }`,
            '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)`,
        }
    },
    {
        id: 'crm', name: 'CRM', description: 'Customer management with Kanban',
        icon: Database, category: 'Business',
        files: {
            '/src/App.tsx': `export default function App() {
  const columns = [
    { title: 'Lead', color: '#3b82f6', items: ['Ahmed Corp', 'Sara LLC'] },
    { title: 'Qualified', color: '#f59e0b', items: ['TechStart'] },
    { title: 'Proposal', color: '#8b5cf6', items: ['BigCo', 'MegaInc'] },
    { title: 'Closed', color: '#22c55e', items: ['AlphaLtd'] },
  ]
  return (
    <div style={{fontFamily:'Inter,sans-serif',padding:'2rem',background:'#f9fafb',minHeight:'100vh'}}>
      <h1 style={{fontSize:'1.5rem',fontWeight:800,marginBottom:'1.5rem'}}>CRM Pipeline</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {columns.map(col=>(
          <div key={col.title}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:col.color}} />
              <span style={{fontWeight:600,fontSize:14}}>{col.title}</span>
              <span style={{fontSize:12,color:'#6b7280'}}>({col.items.length})</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {col.items.map(item=>(
                <div key={item} style={{background:'#fff',borderRadius:10,padding:'1rem',boxShadow:'0 1px 3px rgba(0,0,0,0.08)',cursor:'grab'}}>
                  <div style={{fontWeight:500,fontSize:14}}>{item}</div>
                  <div style={{fontSize:12,color:'#6b7280',marginTop:4}}>Last contact: 2 days ago</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}`,
            '/src/index.css': `body { margin: 0; }`,
            '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)`,
        }
    },
    {
        id: 'blank', name: 'Blank Project', description: 'Empty React starter',
        icon: Zap, category: 'Starter',
        files: {
            '/src/App.tsx': `export default function App() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <h1 style={{fontSize:'2rem',fontWeight:800}}>Hello World</h1>
    </div>
  )
}`,
            '/src/index.css': `body { margin: 0; }`,
            '/src/main.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)`,
        }
    },
]

export default function TemplateGallery() {
    const { addMessage } = useStore()

    const applyTemplate = (t: Template) => {
        const state = useStore.getState()
        // Replace all files with template files, keep package.json and vite.config
        const baseFiles: Record<string, string> = {}
        const currentFiles = state.files
        for (const key of Object.keys(currentFiles)) {
            if (key === '/package.json' || key === '/vite.config.ts') {
                baseFiles[key] = currentFiles[key]
            }
        }
        // Merge template files
        const merged = { ...baseFiles, ...t.files }
        // Set all files via individual updates
        for (const [path, content] of Object.entries(merged)) {
            state.updateFile(path, content)
        }
        // Remove files not in template
        for (const key of Object.keys(currentFiles)) {
            if (!(key in merged)) {
                state.deleteFile(key)
            }
        }
        state.setActiveFile('/src/App.tsx')
        state.setRightTab('preview')
        addMessage({ role: 'assistant', text: `Template "${t.name}" applied! Preview updated.` })
    }

    return (
        <div className="h-full overflow-y-auto p-4" style={{ background: 'var(--bg-primary)' }}>
            <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Templates</h2>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Choose a template to start building
            </p>
            <div className="grid grid-cols-2 gap-3">
                {templates.map(t => {
                    const Icon = t.icon
                    return (
                        <button
                            key={t.id}
                            onClick={() => applyTemplate(t)}
                            className="template-card text-left p-4 rounded-xl border transition-all"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: 'var(--bg-tertiary)' }}>
                                    <Icon size={16} style={{ color: 'var(--accent)' }} />
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 rounded"
                                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                                    {t.category}
                                </span>
                            </div>
                            <h3 className="text-xs font-semibold mb-0.5">{t.name}</h3>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t.description}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
