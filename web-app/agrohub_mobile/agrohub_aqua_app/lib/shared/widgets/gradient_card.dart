import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:agrohub_aqua_app/app/theme/app_theme.dart';

class GradientCard extends StatelessWidget {
  final Widget child;
  final VoidCallback? onTap;
  final double? height;
  final EdgeInsetsGeometry? padding;

  const GradientCard({
    super.key,
    required this.child,
    this.onTap,
    this.height,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final card = Container(
      height: height,
      padding: padding ?? const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AquaTheme.primary, AquaTheme.secondary],
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AquaTheme.primary.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: child,
    );

    if (onTap != null) {
      return GestureDetector(onTap: onTap, child: card);
    }
    return card;
  }
}



