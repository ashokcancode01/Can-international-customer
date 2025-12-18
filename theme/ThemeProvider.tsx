import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { toastManager } from "@/utils/toastManager";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
  brandColor?: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  textSecondary: string;
  background: string;
  card: string;
  cardBackground: string;
  text: string;
  secondaryText: string;
  border: string;
  borderColor: string;
  placeholder: string;
  disabled: string;
  error: string;
  success: string;
  positive: string;
  negative: string;
  shadow: string;
  tooltipBackground: string;
  tooltipText: string;
  tooltipSecondary: string;
  modalBackground: string;
  icon: string;
  green: string;
  red: string;
  shapeColor1: string;
  shapeColor2: string;
  shapeColor3: string;
  white: string;
  warning: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
    semibold: string;
    light: string;
  };
  fontSizes: {
    xs: number;
    xs1: number;
    sm: number;
    sm1: number;
    md: number;
    md1: number;
    lg: number;
    lg1: number;
    xl: number;
    xl1: number;
    xxl: number;
    xxl1: number;
  };
}

const THEME_PREFERENCE_KEY = "@app_theme_preference";

const baseFonts = {
  regular: "Montserrat-Regular",
  light: "Montserrat-Light",
  medium: "Montserrat-Medium",
  semibold: "Montserrat-SemiBold",
  bold: "Montserrat-Bold",
};

const fontSizes = {
  xs: 9,
  xs1: 10,
  sm: 11,
  sm1: 12,
  md: 13,
  md1: 14,
  lg: 15,
  lg1: 16,
  xl: 18,
  xl1: 20,
  xxl: 22,
  xxl1: 24,
};

export const lightTheme: Theme = {
  dark: false,
  colors: {
    brandColor: "#dc1e3e",
    primary: "#0066cc",
    primaryDark: "#004c99",
    primaryLight: "#0080ff",
    textSecondary: "#666666",
    background: "#f8f9fa",
    card: "#ffffff",
    cardBackground: "#ffffff",
    text: "#1a1a1a",
    secondaryText: "#555555",
    border: "#e9ecef",
    borderColor: "#e9ecef",
    placeholder: "#999999",
    disabled: "#bcbcbc",
    error: "#B00020",
    success: "#5cb85c",
    positive: "#34A853",
    negative: "#EA4335",
    shadow: "#000000",
    tooltipBackground: "#2D3748",
    tooltipText: "#FFFFFF",
    tooltipSecondary: "#CBD5E0",
    modalBackground: "#FFFFFF",
    icon: "#2D3748",
    green: "#6aa84f",
    red: "#cc0000",
    shapeColor1: "rgba(0, 102, 204, 0.05)",
    shapeColor2: "rgba(0, 102, 204, 0.07)",
    shapeColor3: "rgba(0, 102, 204, 0.06)",
    white: "#FFFFFF",
    warning: "#F59E0B",
  },
  fonts: baseFonts,
  fontSizes,
};

export const darkTheme: Theme = {
  dark: true,
  colors: {
    brandColor: "#dc1e3e",
    primary: "#3b82f6",
    primaryDark: "#2563eb",
    primaryLight: "#60a5fa",
    textSecondary: "#a1a1aa",
    background: "#0a0a0a",
    card: "#18181b",
    cardBackground: "#27272a",
    text: "#f4f4f5",
    secondaryText: "#a1a1aa",
    border: "#3f3f46",
    borderColor: "#52525b",
    placeholder: "#71717a",
    disabled: "#52525b",
    error: "#ef4444",
    success: "#22c55e",
    positive: "#10b981",
    negative: "#f87171",
    shadow: "#000000",
    tooltipBackground: "#374151",
    tooltipText: "#f9fafb",
    tooltipSecondary: "#d1d5db",
    modalBackground: "#1f2937",
    icon: "#e5e7eb",
    green: "#84cc16",
    red: "#ef4444",
    shapeColor1: "rgba(59, 130, 246, 0.1)",
    shapeColor2: "rgba(59, 130, 246, 0.15)",
    shapeColor3: "rgba(59, 130, 246, 0.12)",
    white: "#FFFFFF",
    warning: "#FBBF24",
  },
  fonts: baseFonts,
  fontSizes,
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  themeMode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider component that manages theme state and persistence
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (
          savedTheme &&
          (savedTheme === "light" ||
            savedTheme === "dark" ||
            savedTheme === "system")
        ) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        const errorMessage =
          (error as Error)?.message || "Failed to load theme preference";
        toastManager.error("Theme Error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  // Determine current theme based on system or user preference
  const currentThemeMode = useMemo<"light" | "dark">(() => {
    if (themeMode === "system") {
      return (systemTheme || "light") as "light" | "dark";
    }
    return themeMode as "light" | "dark";
  }, [themeMode, systemTheme]);

  const isDark = currentThemeMode === "dark";
  const theme = isDark ? darkTheme : lightTheme;

  // Save theme preference to AsyncStorage
  const saveTheme = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, mode);
    } catch (error) {
      const errorMessage =
        (error as Error)?.message || "Failed to save theme preference";
      toastManager.error("Theme Error", errorMessage);
    }
  };

  // Set theme and persist preference
  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveTheme(mode);
  };

  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newTheme = currentThemeMode === "light" ? "dark" : "light";
    setTheme(newTheme as ThemeMode);
  };

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo<ThemeContextType>(
    () => ({
      theme,
      toggleTheme,
      themeMode,
      setTheme,
      isDark,
    }),
    [theme, themeMode, isDark]
  );

  // Show loading state or render children with theme context
  if (isLoading) return null;

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
