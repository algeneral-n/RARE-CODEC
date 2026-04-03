import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'tabs/builder_tab.dart';
import 'tabs/preview_tab.dart';
import 'tabs/terminal_tab.dart';
import 'tabs/code_tab.dart';
import 'tabs/templates_tab.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const RareCodecApp());
}

class RareCodecApp extends StatelessWidget {
  const RareCodecApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RARE CODEC',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0A0A0F),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF6366F1),
          secondary: Color(0xFF818CF8),
          surface: Color(0xFF111118),
          error: Color(0xFFEF4444),
        ),
        fontFamily: 'Inter',
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF111118),
          elevation: 0,
          centerTitle: false,
        ),
        cardTheme: CardThemeData(
          color: const Color(0xFF111118),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF1A1A24),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF2A2A3A)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF2A2A3A)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF6366F1)),
          ),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
          hintStyle: const TextStyle(color: Color(0xFF555570), fontSize: 13),
        ),
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _tabs = const [
    BuilderTab(),
    PreviewTab(),
    TerminalTab(),
    CodeTab(),
    TemplatesTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: const Color(0xFF6366F1),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Center(
                child: Text(
                  'R',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 14,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              'RARE CODEC',
              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.mic, size: 20),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Voice command — listening...')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings, size: 20),
            onPressed: () {},
          ),
        ],
      ),
      body: IndexedStack(index: _currentIndex, children: _tabs),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: Color(0xFF111118),
          border: Border(top: BorderSide(color: Color(0xFF2A2A3A), width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (i) => setState(() => _currentIndex = i),
          type: BottomNavigationBarType.fixed,
          backgroundColor: const Color(0xFF111118),
          selectedItemColor: const Color(0xFF6366F1),
          unselectedItemColor: const Color(0xFF555570),
          selectedFontSize: 11,
          unselectedFontSize: 11,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.build_rounded),
              label: 'Builder',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.preview_rounded),
              label: 'Preview',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.terminal_rounded),
              label: 'Terminal',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.code_rounded),
              label: 'Code',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.grid_view_rounded),
              label: 'Templates',
            ),
          ],
        ),
      ),
    );
  }
}
