import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class CodeTab extends StatefulWidget {
  const CodeTab({super.key});

  @override
  State<CodeTab> createState() => _CodeTabState();
}

class _CodeTabState extends State<CodeTab> {
  String _activeFile = 'src/App.tsx';
  bool _showFileTree = true;

  final Map<String, String> _files = {
    'src/App.tsx': '''import React from 'react';
import { TopBar } from './components/TopBar';
import { LeftPanel } from './panels/LeftPanel';
import { RightPanel } from './panels/RightPanel';

export default function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <div className="main-content">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}''',
    'src/main.tsx': '''import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);''',
    'src/globals.css': '''@import "tailwindcss";

:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #111118;
  --bg-tertiary: #1a1a24;
  --border: #2a2a3a;
  --text-primary: #e0e0ee;
  --accent: #6366f1;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg-primary); color: var(--text-primary); }''',
    'package.json': '''{
  "name": "rare-codec",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.0"
  }
}''',
    'vite.config.ts': '''import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});''',
    'index.html': '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RARE CODEC</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>''',
  };

  final Map<String, bool> _expandedDirs = {
    'src': true,
    'src/components': false,
    'src/panels': false,
  };

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Toolbar
        Container(
          height: 40,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: const BoxDecoration(
            color: Color(0xFF111118),
            border: Border(
              bottom: BorderSide(color: Color(0xFF2A2A3A), width: 1),
            ),
          ),
          child: Row(
            children: [
              GestureDetector(
                onTap: () => setState(() => _showFileTree = !_showFileTree),
                child: Icon(
                  _showFileTree
                      ? Icons.folder_open_rounded
                      : Icons.folder_rounded,
                  size: 16,
                  color: const Color(0xFF888898),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  _activeFile,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFFE0E0EE),
                    fontFamily: 'monospace',
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              GestureDetector(
                onTap: () {
                  final content = _files[_activeFile] ?? '';
                  Clipboard.setData(ClipboardData(text: content));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Code copied to clipboard')),
                  );
                },
                child: const Icon(
                  Icons.copy_rounded,
                  size: 14,
                  color: Color(0xFF555570),
                ),
              ),
            ],
          ),
        ),

        // Content
        Expanded(
          child: Row(
            children: [
              // File Tree
              if (_showFileTree)
                Container(
                  width: 160,
                  decoration: const BoxDecoration(
                    color: Color(0xFF0D0D14),
                    border: Border(
                      right: BorderSide(color: Color(0xFF2A2A3A), width: 1),
                    ),
                  ),
                  child: ListView(
                    padding: const EdgeInsets.all(8),
                    children: [
                      _fileItem(
                        'index.html',
                        0,
                        Icons.html_rounded,
                        const Color(0xFFF97316),
                      ),
                      _fileItem(
                        'package.json',
                        0,
                        Icons.data_object_rounded,
                        const Color(0xFFFBBF24),
                      ),
                      _fileItem(
                        'vite.config.ts',
                        0,
                        Icons.settings_rounded,
                        const Color(0xFF3B82F6),
                      ),
                      _dirItem('src', 0),
                      if (_expandedDirs['src'] == true) ...[
                        _fileItem(
                          'src/App.tsx',
                          1,
                          Icons.code_rounded,
                          const Color(0xFF3B82F6),
                        ),
                        _fileItem(
                          'src/main.tsx',
                          1,
                          Icons.code_rounded,
                          const Color(0xFF3B82F6),
                        ),
                        _fileItem(
                          'src/globals.css',
                          1,
                          Icons.style_rounded,
                          const Color(0xFFEC4899),
                        ),
                      ],
                    ],
                  ),
                ),

              // Code Editor
              Expanded(
                child: Container(
                  color: const Color(0xFF0A0A0F),
                  child: _buildCodeView(),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _dirItem(String name, int depth) {
    final expanded = _expandedDirs[name] == true;
    return GestureDetector(
      onTap: () => setState(() => _expandedDirs[name] = !expanded),
      child: Container(
        padding: EdgeInsets.only(
          left: 8.0 + depth * 16,
          top: 6,
          bottom: 6,
          right: 8,
        ),
        child: Row(
          children: [
            Icon(
              expanded
                  ? Icons.keyboard_arrow_down_rounded
                  : Icons.keyboard_arrow_right_rounded,
              size: 14,
              color: const Color(0xFF555570),
            ),
            const SizedBox(width: 4),
            Icon(
              expanded ? Icons.folder_open_rounded : Icons.folder_rounded,
              size: 14,
              color: const Color(0xFFFBBF24),
            ),
            const SizedBox(width: 6),
            Text(
              name.split('/').last,
              style: const TextStyle(fontSize: 12, color: Color(0xFFD0D0DD)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _fileItem(String path, int depth, IconData icon, Color color) {
    final active = _activeFile == path;
    final name = path.split('/').last;
    return GestureDetector(
      onTap: () => setState(() => _activeFile = path),
      child: Container(
        padding: EdgeInsets.only(
          left: 8.0 + depth * 16 + 18,
          top: 6,
          bottom: 6,
          right: 8,
        ),
        decoration: BoxDecoration(
          color: active
              ? const Color(0xFF6366F1).withValues(alpha: 0.1)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(4),
        ),
        child: Row(
          children: [
            Icon(icon, size: 14, color: color),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                name,
                style: TextStyle(
                  fontSize: 12,
                  color: active
                      ? const Color(0xFFE0E0EE)
                      : const Color(0xFF888898),
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCodeView() {
    final code = _files[_activeFile] ?? '// File not found';
    final lines = code.split('\n');

    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: lines.length,
      itemBuilder: (ctx, i) {
        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 32,
              child: Text(
                '${i + 1}',
                textAlign: TextAlign.right,
                style: const TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: Color(0xFF444455),
                  height: 1.6,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                lines[i],
                style: TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: _getLineColor(lines[i]),
                  height: 1.6,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Color _getLineColor(String line) {
    final trimmed = line.trimLeft();
    if (trimmed.startsWith('import') || trimmed.startsWith('export')) {
      return const Color(0xFFC084FC); // purple for imports
    }
    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
      return const Color(0xFF555570); // gray for comments
    }
    if (trimmed.startsWith('<') || trimmed.contains('/>')) {
      return const Color(0xFF22D3EE); // cyan for JSX
    }
    if (trimmed.contains('const ') ||
        trimmed.contains('function ') ||
        trimmed.contains('return ')) {
      return const Color(0xFF6366F1); // indigo for keywords
    }
    if (trimmed.startsWith('"') || trimmed.contains("'")) {
      return const Color(0xFF22C55E); // green for strings
    }
    return const Color(0xFFD0D0DD); // default
  }
}
