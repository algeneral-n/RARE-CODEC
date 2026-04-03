import 'package:flutter/material.dart';

class TemplatesTab extends StatelessWidget {
  const TemplatesTab({super.key});

  static const List<Map<String, dynamic>> _templates = [
    {
      'name': 'Landing Page',
      'desc': 'Hero + features grid + CTA',
      'icon': Icons.web_rounded,
      'color': Color(0xFF6366F1),
      'tags': ['React', 'Tailwind'],
    },
    {
      'name': 'E-Commerce',
      'desc': 'Product grid + cart + checkout',
      'icon': Icons.storefront_rounded,
      'color': Color(0xFF22C55E),
      'tags': ['React', 'Zustand'],
    },
    {
      'name': 'Dashboard',
      'desc': 'Stats cards + charts + table',
      'icon': Icons.dashboard_rounded,
      'color': Color(0xFF3B82F6),
      'tags': ['React', 'Charts'],
    },
    {
      'name': 'Chat App',
      'desc': 'Real-time messaging UI',
      'icon': Icons.chat_rounded,
      'color': Color(0xFFA855F7),
      'tags': ['React', 'WebSocket'],
    },
    {
      'name': 'Portfolio',
      'desc': 'Projects showcase + about',
      'icon': Icons.person_rounded,
      'color': Color(0xFFF59E0B),
      'tags': ['React', 'Animation'],
    },
    {
      'name': 'API Client',
      'desc': 'REST API tester interface',
      'icon': Icons.api_rounded,
      'color': Color(0xFFEF4444),
      'tags': ['React', 'Fetch'],
    },
    {
      'name': 'Blog',
      'desc': 'Articles + categories + tags',
      'icon': Icons.article_rounded,
      'color': Color(0xFF14B8A6),
      'tags': ['React', 'MDX'],
    },
    {
      'name': 'CRM',
      'desc': 'Kanban pipeline + contacts',
      'icon': Icons.view_kanban_rounded,
      'color': Color(0xFFEC4899),
      'tags': ['React', 'DnD'],
    },
    {
      'name': 'Blank Project',
      'desc': 'Start from scratch',
      'icon': Icons.add_rounded,
      'color': Color(0xFF555570),
      'tags': ['React'],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header
        Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Templates',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFFE0E0EE),
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Start your project with a pre-built template',
                style: TextStyle(fontSize: 12, color: Color(0xFF555570)),
              ),
              const SizedBox(height: 12),
              // Search
              TextField(
                style: const TextStyle(fontSize: 13, color: Color(0xFFE0E0EE)),
                decoration: InputDecoration(
                  hintText: 'Search templates...',
                  prefixIcon: const Icon(
                    Icons.search_rounded,
                    size: 18,
                    color: Color(0xFF555570),
                  ),
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  filled: true,
                  fillColor: const Color(0xFF1A1A24),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ],
          ),
        ),

        // Template Grid
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.92,
            ),
            itemCount: _templates.length,
            itemBuilder: (ctx, i) => _TemplateCard(template: _templates[i]),
          ),
        ),
      ],
    );
  }
}

class _TemplateCard extends StatelessWidget {
  final Map<String, dynamic> template;

  const _TemplateCard({required this.template});

  @override
  Widget build(BuildContext context) {
    final color = template['color'] as Color;
    return GestureDetector(
      onTap: () {
        showDialog(
          context: context,
          builder: (_) => AlertDialog(
            backgroundColor: const Color(0xFF111118),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            title: Text(
              template['name'] as String,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Color(0xFFE0E0EE),
              ),
            ),
            content: Text(
              'Apply "${template['name']}" template?\nThis will replace your current project files.',
              style: const TextStyle(
                fontSize: 13,
                color: Color(0xFF888898),
                height: 1.5,
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text(
                  'Cancel',
                  style: TextStyle(color: Color(0xFF555570)),
                ),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('${template['name']} template applied!'),
                    ),
                  );
                },
                child: const Text(
                  'Apply',
                  style: TextStyle(color: Color(0xFF6366F1)),
                ),
              ),
            ],
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: const Color(0xFF111118),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFF2A2A3A)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(template['icon'] as IconData, color: color, size: 20),
            ),
            const SizedBox(height: 10),
            // Name
            Text(
              template['name'] as String,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFFE0E0EE),
              ),
            ),
            const SizedBox(height: 3),
            // Desc
            Text(
              template['desc'] as String,
              style: const TextStyle(fontSize: 10, color: Color(0xFF555570)),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const Spacer(),
            // Tags
            Wrap(
              spacing: 4,
              children: (template['tags'] as List<String>).map((tag) {
                return Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A1A24),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    tag,
                    style: const TextStyle(
                      fontSize: 9,
                      color: Color(0xFF888898),
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}
