import { useMemo } from 'react'
import { useStore } from '../store/useStore'
import { ChevronRight, ChevronDown, FileCode, FileText, FileJson, File as FileIcon, Folder } from 'lucide-react'

interface TreeNode {
    name: string
    path: string
    isDir: boolean
    children: TreeNode[]
}

function buildTree(paths: string[]): TreeNode[] {
    const root: TreeNode = { name: '', path: '', isDir: true, children: [] }

    for (const p of paths) {
        const parts = p.split('/').filter(Boolean)
        let current = root
        let pathSoFar = ''
        for (let i = 0; i < parts.length; i++) {
            pathSoFar += '/' + parts[i]
            const isLast = i === parts.length - 1
            let child = current.children.find(c => c.name === parts[i])
            if (!child) {
                child = { name: parts[i], path: pathSoFar, isDir: !isLast, children: [] }
                current.children.push(child)
            }
            if (!isLast) current = child
        }
    }

    // Sort: folders first, then alphabetical
    const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.sort((a, b) => {
            if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
            return a.name.localeCompare(b.name)
        }).map(n => ({ ...n, children: sortNodes(n.children) }))
    }

    return sortNodes(root.children)
}

function getFileIcon(name: string) {
    if (name.endsWith('.tsx') || name.endsWith('.ts')) return <FileCode size={13} style={{ color: '#3b82f6' }} />
    if (name.endsWith('.css')) return <FileText size={13} style={{ color: '#ec4899' }} />
    if (name.endsWith('.json')) return <FileJson size={13} style={{ color: '#f59e0b' }} />
    if (name.endsWith('.html')) return <FileCode size={13} style={{ color: '#f97316' }} />
    return <FileIcon size={13} style={{ color: 'var(--text-muted)' }} />
}

function TreeNodeItem({ node, depth }: { node: TreeNode; depth: number }) {
    const { activeFile, setActiveFile, expandedDirs, toggleDir } = useStore()
    const isExpanded = expandedDirs.has(node.path)
    const isActive = activeFile === node.path

    if (node.isDir) {
        return (
            <>
                <button
                    onClick={() => toggleDir(node.path)}
                    className="w-full flex items-center gap-1 py-1 px-1 text-xs hover:bg-[var(--bg-hover)] transition-colors rounded"
                    style={{ paddingLeft: depth * 12 + 4, color: 'var(--text-secondary)' }}
                >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <Folder size={13} style={{ color: isExpanded ? 'var(--accent)' : 'var(--text-muted)' }} />
                    <span className="truncate">{node.name}</span>
                </button>
                {isExpanded && node.children.map(child => (
                    <TreeNodeItem key={child.path} node={child} depth={depth + 1} />
                ))}
            </>
        )
    }

    return (
        <button
            onClick={() => setActiveFile(node.path)}
            className="w-full flex items-center gap-1.5 py-1 px-1 text-xs transition-colors rounded"
            style={{
                paddingLeft: depth * 12 + 16,
                background: isActive ? 'var(--bg-hover)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
        >
            {getFileIcon(node.name)}
            <span className="truncate">{node.name}</span>
        </button>
    )
}

export default function FileTree() {
    const files = useStore(s => s.files)
    const tree = useMemo(() => buildTree(Object.keys(files)), [files])

    return (
        <div className="w-48 h-full overflow-y-auto border-r py-2 px-1 flex-shrink-0"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider px-2 pb-1.5"
                style={{ color: 'var(--text-muted)' }}>
                Explorer
            </div>
            {tree.map(node => (
                <TreeNodeItem key={node.path} node={node} depth={0} />
            ))}
        </div>
    )
}
