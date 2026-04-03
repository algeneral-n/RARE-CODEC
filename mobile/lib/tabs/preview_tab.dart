import 'package:flutter/material.dart';

class PreviewTab extends StatefulWidget {
  const PreviewTab({super.key});

  @override
  State<PreviewTab> createState() => _PreviewTabState();
}

class _PreviewTabState extends State<PreviewTab> {
  String _device = 'mobile';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) setState(() => _isLoading = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Toolbar
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
            children: [
              _deviceBtn('mobile', Icons.phone_android_rounded),
              _deviceBtn('tablet', Icons.tablet_rounded),
              _deviceBtn('desktop', Icons.desktop_windows_rounded),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF22C55E).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.circle, size: 6, color: Color(0xFF22C55E)),
                    SizedBox(width: 4),
                    Text(
                      'Live',
                      style: TextStyle(fontSize: 10, color: Color(0xFF22C55E)),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              GestureDetector(
                onTap: () => setState(() {
                  _isLoading = true;
                  Future.delayed(const Duration(milliseconds: 500), () {
                    if (mounted) setState(() => _isLoading = false);
                  });
                }),
                child: const Icon(
                  Icons.refresh_rounded,
                  size: 18,
                  color: Color(0xFF888898),
                ),
              ),
            ],
          ),
        ),

        // Preview Area
        Expanded(
          child: Container(
            color: const Color(0xFF0D0D12),
            child: Center(
              child: _isLoading
                  ? const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(
                          color: Color(0xFF6366F1),
                          strokeWidth: 2,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Loading preview...',
                          style: TextStyle(
                            color: Color(0xFF555570),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    )
                  : _buildPreviewFrame(),
            ),
          ),
        ),
      ],
    );
  }

  Widget _deviceBtn(String key, IconData icon) {
    final active = _device == key;
    return GestureDetector(
      onTap: () => setState(() => _device = key),
      child: Container(
        margin: const EdgeInsets.only(right: 4),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: active
              ? const Color(0xFF6366F1).withValues(alpha: 0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          size: 16,
          color: active ? const Color(0xFF6366F1) : const Color(0xFF555570),
        ),
      ),
    );
  }

  Widget _buildPreviewFrame() {
    final double width;
    final double height;
    final double radius;

    switch (_device) {
      case 'tablet':
        width = 300;
        height = 420;
        radius = 16;
      case 'desktop':
        width = MediaQuery.of(context).size.width - 24;
        height = MediaQuery.of(context).size.height * 0.55;
        radius = 8;
      default:
        width = 240;
        height = 430;
        radius = 28;
    }

    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(radius),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6366F1).withValues(alpha: 0.15),
            blurRadius: 30,
            spreadRadius: 0,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(radius),
        child: _buildPreviewContent(),
      ),
    );
  }

  Widget _buildPreviewContent() {
    // Simulated preview of the built app
    return Container(
      color: Colors.white,
      child: Column(
        children: [
          // Simulated app header
          Container(
            padding: const EdgeInsets.fromLTRB(16, 40, 16, 12),
            color: const Color(0xFF6366F1),
            child: const Row(
              children: [
                Text(
                  'My App',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Spacer(),
                Icon(Icons.menu, color: Colors.white, size: 20),
              ],
            ),
          ),
          // Simulated hero section
          Container(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const Icon(
                  Icons.rocket_launch,
                  size: 40,
                  color: Color(0xFF6366F1),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Welcome to Your App',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1A1A2E),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Built with RARE CODEC',
                  style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF6366F1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'Get Started',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Feature cards
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: GridView.count(
                crossAxisCount: 2,
                mainAxisSpacing: 8,
                crossAxisSpacing: 8,
                childAspectRatio: 1.3,
                children: const [
                  _FeatureCard(
                    icon: Icons.speed,
                    label: 'Fast',
                    color: Color(0xFF22C55E),
                  ),
                  _FeatureCard(
                    icon: Icons.security,
                    label: 'Secure',
                    color: Color(0xFF3B82F6),
                  ),
                  _FeatureCard(
                    icon: Icons.devices,
                    label: 'Responsive',
                    color: Color(0xFFF59E0B),
                  ),
                  _FeatureCard(
                    icon: Icons.auto_awesome,
                    label: 'AI Powered',
                    color: Color(0xFFEF4444),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _FeatureCard({
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
