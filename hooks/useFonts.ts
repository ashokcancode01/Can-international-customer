import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useCallback } from "react";

/**
 * Custom hook to handle font loading
 * @returns Object containing font loading state and layout callback
 */
export const useFonts = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Keep the splash screen visible while loading fonts
    SplashScreen.preventAutoHideAsync().catch(console.warn);

    const loadFonts = async () => {
      try {
        // Load fonts
        await Font.loadAsync({
          "Comfortaa-Regular": require("../assets/fonts/Comfortaa-Regular.ttf"),
          "Comfortaa-Light": require("../assets/fonts/Comfortaa-Light.ttf"),
          "Comfortaa-Medium": require("../assets/fonts/Comfortaa-Medium.ttf"),
          "Comfortaa-SemiBold": require("../assets/fonts/Comfortaa-SemiBold.ttf"),
          "Comfortaa-Bold": require("../assets/fonts/Comfortaa-Bold.ttf"),
          "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
          "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
          "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
          "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
          "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
        });

        // Optional delay for smoother UI transition
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
      } finally {
        setAppIsReady(true);
      }
    };

    loadFonts();
  }, []);

  // Callback to hide splash screen when layout is ready
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn("Error hiding splash screen:", error);
      }
    }
  }, [appIsReady]);

  return { appIsReady, onLayoutRootView };
};
