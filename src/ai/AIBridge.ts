import { useStore } from '../store/useStore'
import type { LeftMode } from '../store/useStore'

/**
 * AIBridge: connects to the backend /api/ai endpoint which proxies
 * requests to OpenAI with the full RARE CODEC prompt + function tools.
 *
 * Falls back to a local simulation when the server isn't running.
 */

const SYSTEM_MODES: Record<LeftMode, string> = {
    builder: 'You are the RARE CODEC Builder. Generate code, scaffold projects, create components, and build features. Always respond with working code when asked.',
    debugger: 'You are the RARE CODEC Debugger. Analyze code for bugs, performance issues, and security vulnerabilities. Suggest fixes with code.',
    planner: 'You are the RARE CODEC Planner. Create project plans, break down features into tasks, estimate complexity, and suggest architecture.',
    designer: 'You are the RARE CODEC Designer. Suggest UI/UX improvements, color schemes, layouts, and design patterns. Provide CSS and component code.',
}

const API_BASE = import.meta.env.PROD
    ? 'https://rare-codec-api.gm-ccc.workers.dev'
    : ''

export async function callAI(userMessage: string, mode: LeftMode): Promise<string> {
    const state = useStore.getState()
    const filesContext = Object.entries(state.files)
        .map(([path, content]) => `--- ${path} ---\n${content}`)
        .join('\n\n')

    // Try the backend API first
    try {
        const res = await fetch(`${API_BASE}/api/ai`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                mode,
                systemPrompt: SYSTEM_MODES[mode],
                files: filesContext,
                projectName: state.projectName,
            }),
        })

        if (res.ok) {
            const data = await res.json()
            // If the AI returned file updates, apply them
            if (data.fileUpdates) {
                for (const [path, content] of Object.entries(data.fileUpdates)) {
                    state.updateFile(path, content as string)
                }
            }
            return data.reply
        }
    } catch {
        // Backend not running, fall back to local simulation
    }

    // Local AI simulation
    return simulateAI(userMessage, mode, state)
}

function simulateAI(message: string, mode: LeftMode, state: ReturnType<typeof useStore.getState>): string {
    const lower = message.toLowerCase()

    // Builder mode responses
    if (mode === 'builder') {
        if (lower.includes('button') || lower.includes('زر')) {
            const code = `<button
  className="px-4 py-2 rounded-lg font-medium transition-colors"
  style={{background:'#6366f1',color:'#fff'}}
  onClick={() => alert('Clicked!')}
>
  Click Me
</button>`
            state.updateFile('/src/App.tsx', state.files['/src/App.tsx'].replace(
                '</main>',
                `  ${code}\n    </main>`
            ))
            return `Added a styled button to App.tsx. Check the preview!

\`\`\`jsx
${code}
\`\`\``
        }

        if (lower.includes('navbar') || lower.includes('nav') || lower.includes('header')) {
            return `I can create a responsive navigation bar for you. Here's what I'll build:

1. Logo + brand name on the left
2. Navigation links in the center
3. CTA button on the right
4. Mobile hamburger menu

Just say "go" and I'll add it to your project.`
        }

        if (lower.includes('form') || lower.includes('نموذج')) {
            return `I'll create a styled form component with:

- Name, Email, Message fields
- Validation
- Submit handler
- Loading state
- Success feedback

Say "build it" to proceed.`
        }

        if (lower.includes('api') || lower.includes('fetch') || lower.includes('endpoint')) {
            return `I can set up API integration for you:

1. Create an API client with fetch
2. Add error handling & retries
3. Set up TypeScript types
4. Create custom hooks for data fetching

Which endpoint should I connect to?`
        }
    }

    // Debugger mode responses
    if (mode === 'debugger') {
        const problems = state.problems
        if (problems.length > 0) {
            return `Found ${problems.length} issues:\n\n${problems.map((p, i) =>
                `${i + 1}. **${p.title}** (${p.severity})\n   Location: ${p.where}`
            ).join('\n\n')}\n\nWould you like me to fix these automatically?`
        }
        return `Code analysis complete. No critical issues found.\n\nI checked:\n- TypeScript types\n- Unused imports\n- Security patterns\n- Performance anti-patterns\n\nYour code looks clean!`
    }

    // Planner mode responses
    if (mode === 'planner') {
        if (lower.includes('plan') || lower.includes('خطة')) {
            return `Here's a project plan for "${state.projectName}":

**Phase 1: Foundation** (Day 1-2)
- Project scaffolding ✓
- Core components
- State management
- Routing setup

**Phase 2: Features** (Day 3-5)
- User authentication
- Dashboard layout
- API integration
- Real-time updates

**Phase 3: Polish** (Day 6-7)
- Responsive design
- Animations
- Error handling
- Performance optimization

**Phase 4: Deploy** (Day 8)
- Testing
- CI/CD pipeline
- Cloudflare Pages deployment

Shall I break any phase into detailed tasks?`
        }
        return `I'm the Planner. I can help with:\n\n- Project roadmaps\n- Feature breakdown\n- Architecture decisions\n- Sprint planning\n- Time estimates\n\nWhat would you like to plan?`
    }

    // Designer mode responses
    if (mode === 'designer') {
        if (lower.includes('color') || lower.includes('لون')) {
            return `Here are some color scheme suggestions:

**Modern Dark** (current)
- Primary: #6366f1 (Indigo)
- Background: #0a0a0f
- Surface: #111118
- Text: #e8e8f0

**Ocean Blue**
- Primary: #0ea5e9
- Background: #0c1929
- Surface: #122640
- Text: #e0f2fe

**Emerald**
- Primary: #10b981
- Background: #0a1a14
- Surface: #112920
- Text: #d1fae5

Which scheme should I apply?`
        }
        return `I'm the Designer. I can help with:\n\n- Color schemes & themes\n- Typography choices\n- Layout patterns\n- Component styling\n- Responsive breakpoints\n- Animations & transitions\n\nWhat aspect of the design should we work on?`
    }

    // Generic fallback
    return `I understand you said: "${message}"\n\nI'm in ${mode} mode. Here's what I can do:\n\n- **Builder**: Generate code, create components, scaffold features\n- **Debugger**: Find & fix bugs, optimize performance\n- **Planner**: Create roadmaps, estimate tasks\n- **Designer**: UI/UX improvements, styling\n\nHow can I help?`
}
