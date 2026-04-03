import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class TerminalTab extends StatefulWidget {
  const TerminalTab({super.key});

  @override
  State<TerminalTab> createState() => _TerminalTabState();
}

class _TerminalTabState extends State<TerminalTab> {
  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final FocusNode _focusNode = FocusNode();

  final List<Map<String, String>> _lines = [
    {'type': 'system', 'text': 'RARE CODEC Terminal v1.0'},
    {'type': 'system', 'text': 'Type "help" for available commands.\n'},
  ];

  void _executeCommand(String cmd) {
    if (cmd.trim().isEmpty) return;
    setState(() {
      _lines.add({'type': 'input', 'text': '\$ $cmd'});
    });
    _inputController.clear();

    final lower = cmd.trim().toLowerCase();
    String output;

    switch (lower) {
      case 'help':
        output =
            'Available commands:\n  help     — Show this message\n  clear    — Clear terminal\n  ls       — List project files\n  build    — Build the project\n  dev      — Start dev server\n  deploy   — Deploy to Cloudflare\n  git status — Show git status\n  version  — Show version info';
      case 'clear':
        setState(() => _lines.clear());
        return;
      case 'ls':
      case 'dir':
        output =
            '📁 src/\n  ├── App.tsx\n  ├── main.tsx\n  ├── globals.css\n  ├── components/\n  │   └── TopBar.tsx\n  ├── panels/\n  │   ├── LeftPanel.tsx\n  │   └── RightPanel.tsx\n  ├── editor/\n  │   ├── FileTree.tsx\n  │   └── MonacoEditor.tsx\n  └── preview/\n      └── LivePreview.tsx\n📄 package.json\n📄 vite.config.ts\n📄 tsconfig.json';
      case 'build':
        _animateOutput([
          '⚙️  Building project...',
          '   Compiling TypeScript...',
          '   Bundling with Vite...',
          '   Optimizing assets...',
          '✅ Build complete — 1.2s\n   Output: dist/ (348 KB gzipped)',
        ]);
        return;
      case 'dev':
        _animateOutput([
          '🚀 Starting dev server...',
          '   VITE v6.4.1 ready in 420ms',
          '   ➜ Local:   http://localhost:5173/',
          '   ➜ Network: http://192.168.1.5:5173/',
          '   ➜ press h + enter to show help',
        ]);
        return;
      case 'deploy':
        _animateOutput([
          '☁️  Deploying to Cloudflare Pages...',
          '   Building project...',
          '   Uploading assets (23 files)...',
          '   Setting up edge functions...',
          '✅ Deployed! https://rare-codec.pages.dev',
        ]);
        return;
      case 'git status':
        output =
            'On branch main\n\nChanges not staged for commit:\n  modified: src/App.tsx\n  modified: src/globals.css\n\nUntracked files:\n  src/components/NewComponent.tsx\n\n2 modified, 1 untracked';
      case 'version':
        output =
            'RARE CODEC v1.0.0\nNode.js v24.14.0\nVite 6.4.1\nReact 19\nTypeScript 5.8';
      default:
        output = 'Command not found: $cmd\nType "help" for available commands.';
    }

    setState(() {
      _lines.add({'type': 'output', 'text': output});
    });
    _scrollToBottom();
  }

  void _animateOutput(List<String> lines) {
    for (int i = 0; i < lines.length; i++) {
      Future.delayed(Duration(milliseconds: 300 * (i + 1)), () {
        if (!mounted) return;
        setState(() {
          _lines.add({'type': 'output', 'text': lines[i]});
        });
        _scrollToBottom();
      });
    }
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 50), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

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
              const Icon(
                Icons.terminal_rounded,
                size: 14,
                color: Color(0xFF888898),
              ),
              const SizedBox(width: 8),
              const Text(
                'Terminal',
                style: TextStyle(fontSize: 12, color: Color(0xFFE0E0EE)),
              ),
              const Spacer(),
              GestureDetector(
                onTap: () {
                  final text = _lines.map((l) => l['text']).join('\n');
                  Clipboard.setData(ClipboardData(text: text));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Terminal output copied')),
                  );
                },
                child: const Icon(
                  Icons.copy_rounded,
                  size: 14,
                  color: Color(0xFF555570),
                ),
              ),
              const SizedBox(width: 12),
              GestureDetector(
                onTap: () => setState(() => _lines.clear()),
                child: const Icon(
                  Icons.clear_all_rounded,
                  size: 16,
                  color: Color(0xFF555570),
                ),
              ),
            ],
          ),
        ),

        // Terminal Output
        Expanded(
          child: Container(
            color: const Color(0xFF0A0A0F),
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(12),
              itemCount: _lines.length,
              itemBuilder: (ctx, i) {
                final line = _lines[i];
                Color color;
                switch (line['type']) {
                  case 'input':
                    color = const Color(0xFF6366F1);
                  case 'system':
                    color = const Color(0xFF555570);
                  default:
                    color = const Color(0xFFD0D0DD);
                }
                return Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Text(
                    line['text']!,
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                      color: color,
                      height: 1.6,
                    ),
                  ),
                );
              },
            ),
          ),
        ),

        // Input
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: const BoxDecoration(
            color: Color(0xFF0A0A0F),
            border: Border(top: BorderSide(color: Color(0xFF2A2A3A), width: 1)),
          ),
          child: Row(
            children: [
              const Text(
                '\$ ',
                style: TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 13,
                  color: Color(0xFF6366F1),
                  fontWeight: FontWeight.bold,
                ),
              ),
              Expanded(
                child: TextField(
                  controller: _inputController,
                  focusNode: _focusNode,
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 13,
                    color: Color(0xFFE0E0EE),
                  ),
                  decoration: const InputDecoration(
                    hintText: 'Enter command...',
                    hintStyle: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 13,
                      color: Color(0xFF555570),
                    ),
                    isDense: true,
                    contentPadding: EdgeInsets.zero,
                    border: InputBorder.none,
                    filled: false,
                  ),
                  onSubmitted: (v) {
                    _executeCommand(v);
                    _focusNode.requestFocus();
                  },
                ),
              ),
              GestureDetector(
                onTap: () {
                  _executeCommand(_inputController.text);
                  _focusNode.requestFocus();
                },
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF6366F1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Icon(
                    Icons.play_arrow_rounded,
                    size: 14,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
