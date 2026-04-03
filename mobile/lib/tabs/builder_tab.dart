import 'package:flutter/material.dart';

class BuilderTab extends StatefulWidget {
  const BuilderTab({super.key});

  @override
  State<BuilderTab> createState() => _BuilderTabState();
}

class _BuilderTabState extends State<BuilderTab> {
  final TextEditingController _chatController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  String _activeMode = 'builder';
  String? _activeFlow;

  final List<Map<String, String>> _messages = [
    {
      'role': 'system',
      'content': 'RARE CODEC Builder ready. Describe what you want to build.',
    },
  ];

  final List<Map<String, dynamic>> _modes = [
    {'key': 'builder', 'label': 'Builder', 'icon': Icons.build_rounded},
    {'key': 'debugger', 'label': 'Debugger', 'icon': Icons.bug_report_rounded},
    {'key': 'planner', 'label': 'Planner', 'icon': Icons.map_rounded},
    {'key': 'designer', 'label': 'Designer', 'icon': Icons.palette_rounded},
  ];

  final List<Map<String, dynamic>> _builderActions = [
    {
      'key': 'build-plan',
      'label': 'Build Plan',
      'icon': Icons.rocket_launch_rounded,
      'desc': 'AI generates your full project',
    },
    {
      'key': 'import-repo',
      'label': 'Import Repo',
      'icon': Icons.download_rounded,
      'desc': 'Import from GitHub URL',
    },
    {
      'key': 'instructions',
      'label': 'Instructions',
      'icon': Icons.edit_note_rounded,
      'desc': 'Write what you want to build',
    },
    {
      'key': 'design',
      'label': 'Design',
      'icon': Icons.image_rounded,
      'desc': 'Upload a screenshot or mockup',
    },
  ];

  void _sendMessage() {
    final text = _chatController.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _messages.add({'role': 'user', 'content': text});
      _chatController.clear();
    });
    // Simulate AI response
    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      setState(() {
        _messages.add({'role': 'assistant', 'content': _getAIResponse(text)});
      });
      _scrollToBottom();
    });
    _scrollToBottom();
  }

  String _getAIResponse(String input) {
    final lower = input.toLowerCase();
    if (_activeMode == 'debugger') {
      return '🔍 Scanning code for issues...\n\nNo critical errors found. 2 warnings:\n• Unused import on line 3\n• Missing key prop in list rendering';
    }
    if (_activeMode == 'planner') {
      return '📋 Project Plan:\n\n1. Setup project structure\n2. Create components\n3. Add API integration\n4. Style & polish\n5. Deploy to production';
    }
    if (_activeMode == 'designer') {
      return '🎨 Design suggestions:\n\n• Primary: #6366F1 (Indigo)\n• Background: #0A0A0F (Deep Dark)\n• Accent: #22D3EE (Cyan)\n\nFont: Inter, weight 400/600/700';
    }
    if (lower.contains('button')) {
      return 'I\'ll add a button component. Here\'s the code:\n\n```jsx\n<button className="btn-primary">\n  Click Me\n</button>\n```';
    }
    if (lower.contains('api') || lower.contains('fetch')) {
      return 'I\'ll set up the API integration with proper error handling and loading states.';
    }
    return 'I understand. Let me work on that for you. I\'ll generate the code and update the preview.';
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _chatController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Mode Switcher
        Container(
          height: 44,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: const BoxDecoration(
            color: Color(0xFF111118),
            border: Border(
              bottom: BorderSide(color: Color(0xFF2A2A3A), width: 1),
            ),
          ),
          child: Row(
            children: _modes.map((m) {
              final active = _activeMode == m['key'];
              return Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _activeMode = m['key']),
                  child: Container(
                    decoration: BoxDecoration(
                      border: Border(
                        bottom: BorderSide(
                          color: active
                              ? const Color(0xFF6366F1)
                              : Colors.transparent,
                          width: 2,
                        ),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          m['icon'] as IconData,
                          size: 14,
                          color: active
                              ? const Color(0xFF6366F1)
                              : const Color(0xFF555570),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          m['label'] as String,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: active
                                ? FontWeight.w600
                                : FontWeight.w400,
                            color: active
                                ? const Color(0xFFE0E0EE)
                                : const Color(0xFF555570),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),

        // Builder Actions (only for builder mode)
        if (_activeMode == 'builder')
          Container(
            padding: const EdgeInsets.all(12),
            child: GridView.count(
              shrinkWrap: true,
              crossAxisCount: 2,
              mainAxisSpacing: 8,
              crossAxisSpacing: 8,
              childAspectRatio: 2.4,
              physics: const NeverScrollableScrollPhysics(),
              children: _builderActions.map((a) {
                final active = _activeFlow == a['key'];
                return GestureDetector(
                  onTap: () =>
                      setState(() => _activeFlow = active ? null : a['key']),
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: active
                          ? const Color(0xFF6366F1).withValues(alpha: 0.15)
                          : const Color(0xFF1A1A24),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: active
                            ? const Color(0xFF6366F1)
                            : const Color(0xFF2A2A3A),
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          a['icon'] as IconData,
                          size: 18,
                          color: active
                              ? const Color(0xFF6366F1)
                              : const Color(0xFF888898),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                a['label'] as String,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFFE0E0EE),
                                ),
                              ),
                              Text(
                                a['desc'] as String,
                                style: const TextStyle(
                                  fontSize: 9,
                                  color: Color(0xFF555570),
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

        // Chat Messages
        Expanded(
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            itemCount: _messages.length,
            itemBuilder: (ctx, i) {
              final msg = _messages[i];
              final isUser = msg['role'] == 'user';
              final isSystem = msg['role'] == 'system';
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: isUser
                            ? const Color(0xFF6366F1)
                            : isSystem
                            ? const Color(0xFF2A2A3A)
                            : const Color(0xFF1A1A24),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        isUser
                            ? Icons.person
                            : isSystem
                            ? Icons.info_outline
                            : Icons.auto_awesome,
                        size: 14,
                        color: const Color(0xFFE0E0EE),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isUser
                              ? const Color(0xFF6366F1).withValues(alpha: 0.1)
                              : const Color(0xFF1A1A24),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          msg['content']!,
                          style: TextStyle(
                            fontSize: 13,
                            height: 1.5,
                            color: isSystem
                                ? const Color(0xFF888898)
                                : const Color(0xFFD0D0DD),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),

        // Chat Input
        Container(
          padding: const EdgeInsets.all(12),
          decoration: const BoxDecoration(
            color: Color(0xFF111118),
            border: Border(top: BorderSide(color: Color(0xFF2A2A3A), width: 1)),
          ),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(
                  Icons.attach_file,
                  size: 20,
                  color: Color(0xFF555570),
                ),
                onPressed: () {},
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(minWidth: 36),
              ),
              Expanded(
                child: TextField(
                  controller: _chatController,
                  style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFFE0E0EE),
                  ),
                  decoration: InputDecoration(
                    hintText: 'Describe what you want to build...',
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 10,
                    ),
                    filled: true,
                    fillColor: const Color(0xFF1A1A24),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
              const SizedBox(width: 8),
              GestureDetector(
                onTap: _sendMessage,
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFF6366F1),
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: const Icon(
                    Icons.send_rounded,
                    size: 16,
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
