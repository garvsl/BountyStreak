// Pirate theme color palette
export const COLORS = {
  // Primary colors
  primary: "#FFD700", // Gold for doubloons/treasure
  primaryDark: "#B8860B", // Darker gold
  primaryLight: "#FFF3B0", // Light gold

  // Secondary colors
  secondary: "#8B4513", // Saddle brown for wood/ship elements
  secondaryDark: "#654321", // Darker brown
  secondaryLight: "#DEB887", // Burlywood

  // Accent colors
  accent1: "#006994", // Deep sea blue
  accent2: "#32CD32", // Success green
  accent3: "#DC143C", // Crimson red for important elements

  // Background colors
  background: "#1C1C1E", // Dark background
  backgroundLight: "#2C2C2E", // Lighter background for cards
  backgroundDark: "#121214", // Darker background for contrast

  // Text colors
  textPrimary: "#F8F8FF", // Ghost white
  textSecondary: "#D3D3D3", // Light gray
  textMuted: "#808080", // Gray

  // Status colors
  success: "#2E8B57", // Sea green
  warning: "#DAA520", // Golden rod
  error: "#8B0000", // Dark red
  info: "#4682B4", // Steel blue

  // Gradients
  gradientStart: "#2C2C2E",
  gradientEnd: "#1C1C1E",
};

// Typography
export const FONTS = {
  primary: "Kica-PERSONALUSE-Light",
  // Add more font families if needed
};

// Font sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
};

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 24,
  full: 9999,
};

// Shadows
export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Common styles
export const COMMON_STYLES = {
  card: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.md,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES["3xl"],
    color: COLORS.textPrimary,
    // marginBottom: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.md,
    color: COLORS.background,
    fontWeight: "bold",
  },
};

// Quest styles
export const QUEST_STYLES = {
  container: {
    ...COMMON_STYLES.card,
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  title: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
    // marginBottom: SPACING.sm,
  },
  progressBar: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: BORDER_RADIUS.full,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: COLORS.primary,
    height: "100%",
  },
};

// Navigation styles
export const NAV_STYLES = {
  tabBar: {
    backgroundColor: COLORS.backgroundDark,
    borderTopColor: COLORS.primary,
    borderTopWidth: 1,
  },
  tabBarIcon: {
    color: COLORS.primary,
  },
  tabBarLabel: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.xs,
  },
};
