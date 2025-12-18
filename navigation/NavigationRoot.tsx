import React, { useMemo } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  Theme as NavigationTheme,
} from "@react-navigation/native";
import { StatusBar } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

interface NavigationRootProps {
  children: React.ReactNode;
}

/**
 * Root navigation component that provides navigation context with theming
 */
export const NavigationRoot: React.FC<NavigationRootProps> = ({ children }) => {
  const { theme } = useTheme();

  // Create navigation theme based on current app theme
  const navigationTheme = useMemo<NavigationTheme>(
    () => ({
      ...DefaultTheme,
      dark: theme.dark,
      colors: {
        ...DefaultTheme.colors,
        ...theme.colors,
      },
    }),
    [theme]
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.brandColor}
        translucent={false}
        animated={true}
      />
      {children}
    </NavigationContainer>
  );
};
