import {  MD3LightTheme } from "react-native-paper";

export const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors (your main brand color)
    primary: "#A0CE4E", // Your main lime green
    onPrimary: "#FFFFFF", // White text on primary
    primaryContainer: "#E8F5D6", // Light green container
    onPrimaryContainer: "#2E5016", // Dark green text on light container

    // Secondary colors (complementary greens)
    secondary: "#7CB342", // Darker green
    onSecondary: "#FFFFFF", // White text on secondary
    secondaryContainer: "#DCEDC8", // Very light green
    onSecondaryContainer: "#1B5E20", // Very dark green

    // Tertiary colors (accent with white/gray)
    tertiary: "#66BB6A", // Medium green
    onTertiary: "#FFFFFF", // White text
    tertiaryContainer: "#C8E6C9", // Light green container
    onTertiaryContainer: "#1B5E20", // Dark green text

    // Surface colors (clean whites and light grays)
    surface: "#FFFFFF", // Pure white
    onSurface: "#1C1B1F", // Dark text on white
    surfaceVariant: "#F8F9FA", // Very light gray
    onSurfaceVariant: "#49454F", // Medium gray text

    // Background colors
    background: "#FFFFFF", // White background
    onBackground: "#1C1B1F", // Dark text on background

    // Outline colors
    outline: "#A0CE4E", // Use your brand color for outlines
    outlineVariant: "#CAC4D0", // Light gray for subtle outlines

    // Error colors (keeping standard red but with your green tint)
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
  },
};