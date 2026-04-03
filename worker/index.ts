/**
 * RARE CODEC API — Cloudflare Worker
 * Worker name: rare-codec-api
 */

interface Env {
    OPENAI_API_KEY: string
}

function corsHeaders(): Record<string, string> {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-GitHub-Token',
    }
}

function json(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
}

/* ── AI handler ── */
async function handleAI(req: Request, env: Env): Promise<Response> {
    const { message, mode, systemPrompt, files, projectName } = await req.json() as any

    if (!env.OPENAI_API_KEY) {
        return json({
            reply: `[Local Mode] API key not set.\n\nYou said: "${message}"\nMode: ${mode}\nProject: ${projectName}`,
        })
    }

    const body = {
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
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const err = await res.text()
        return json({ error: `OpenAI error: ${err}` }, 502)
    }

    const data = await res.json() as any
    const reply = data.choices?.[0]?.message?.content || 'No response from AI.'

    // Parse file updates from AI response
    const fileUpdates: Record<string, string> = {}
    const filePattern = /```(?:tsx?|jsx?|css|html|json)\s*\/\/\s*file:\s*(.+?)\n([\s\S]*?)```/g
    let match
    while ((match = filePattern.exec(reply)) !== null) {
        fileUpdates[match[1].trim()] = match[2].trim()
    }

    return json({
        reply,
        fileUpdates: Object.keys(fileUpdates).length > 0 ? fileUpdates : undefined,
    })
}

/* ── Terminal handler ── */
async function handleTerminal(req: Request): Promise<Response> {
    const { command } = await req.json() as any
    return json({
        output: `Executed: ${command}\n(Server terminal — sandbox not yet available)`,
    })
}

/* ── GitHub proxy ── */
async function handleGitHub(req: Request, action: string): Promise<Response> {
    const token = req.headers.get('x-github-token')
    if (!token) {
        return json({ error: 'GitHub token required' }, 401)
    }

    const body = req.method !== 'GET' ? await req.text() : undefined
    const ghRes = await fetch(`https://api.github.com/${action}`, {
        method: req.method === 'GET' ? 'GET' : 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'rare-codec-api',
        },
        body,
    })
    const data = await ghRes.json()
    return json(data, ghRes.status)
}

/* ── Health check ── */
function handleHealth(env: Env): Response {
    return json({
        status: 'ok',
        ai: !!env.OPENAI_API_KEY,
        version: '1.0.0',
        runtime: 'cloudflare-worker',
    })
}

/* ── Main fetch handler ── */
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url)
        const path = url.pathname

        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders() })
        }

        try {
            // Route matching
            if (path === '/api/ai' && request.method === 'POST') {
                return handleAI(request, env)
            }
            if (path === '/api/terminal' && request.method === 'POST') {
                return handleTerminal(request)
            }
            if (path.startsWith('/api/github/') && request.method === 'POST') {
                const action = path.replace('/api/github/', '')
                return handleGitHub(request, action)
            }
            if (path === '/api/health') {
                return handleHealth(env)
            }

            return json({ error: 'Not found' }, 404)
        } catch (err: any) {
            return json({ error: err.message || 'Internal error' }, 500)
        }
    },
}
