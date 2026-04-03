import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

/* ── OpenAI client ── */
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
})

/* ── AI endpoint ── */
app.post('/api/ai', async (req, res) => {
    try {
        const { message, mode, systemPrompt, files, projectName } = req.body

        if (!process.env.OPENAI_API_KEY) {
            res.json({
                reply: `[Local Mode] API key not set. Set OPENAI_API_KEY to enable real AI.\n\nYou said: "${message}"\nMode: ${mode}\nProject: ${projectName}`,
            })
            return
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `${systemPrompt}\n\nProject: ${projectName}\n\nCurrent project files:\n${files}`,
                },
                { role: 'user', content: message },
            ],
            max_tokens: 4096,
            temperature: 0.7,
        })

        const reply = completion.choices[0]?.message?.content || 'No response from AI.'

        // Parse file updates from AI response (look for code blocks with file paths)
        const fileUpdates: Record<string, string> = {}
        const filePattern = /```(?:tsx?|jsx?|css|html|json)\s*\/\/\s*file:\s*(.+?)\n([\s\S]*?)```/g
        let match
        while ((match = filePattern.exec(reply)) !== null) {
            fileUpdates[match[1].trim()] = match[2].trim()
        }

        res.json({
            reply,
            fileUpdates: Object.keys(fileUpdates).length > 0 ? fileUpdates : undefined,
        })
    } catch (err: any) {
        console.error('AI error:', err.message)
        res.status(500).json({ error: err.message })
    }
})

/* ── Terminal endpoint ── */
app.post('/api/terminal', async (req, res) => {
    const { command } = req.body
    // In production, this would exec the command in a sandboxed container.
    // For now, return a simulated response.
    res.json({
        output: `Executed: ${command}\n(Server terminal — set up Docker/sandbox for real execution)`,
    })
})

/* ── GitHub proxy ── */
app.post('/api/github/:action', async (req, res) => {
    const { action } = req.params
    const token = req.headers['x-github-token'] as string

    if (!token) {
        res.status(401).json({ error: 'GitHub token required' })
        return
    }

    try {
        const ghRes = await fetch(`https://api.github.com/${action}`, {
            method: req.method === 'GET' ? 'GET' : 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
        })
        const data = await ghRes.json()
        res.json(data)
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
})

/* ── Health check ── */
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        ai: !!process.env.OPENAI_API_KEY,
        version: '1.0.0',
    })
})

const PORT = parseInt(process.env.PORT || '3001')
app.listen(PORT, () => {
    console.log(`RARE CODEC Server running on port ${PORT}`)
    console.log(`AI: ${process.env.OPENAI_API_KEY ? 'Connected' : 'No API key — local mode'}`)
})
