import React, { useEffect, useState, useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import { store, loadPersistedState } from "./store/store";
import { useFonts } from "./hooks/useFonts";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { ThemeProvider } from "./theme/ThemeProvider";
import { NavigationRoot } from "./navigation/NavigationRoot";
import AppNavigator from "./navigation/AppNavigator";
import { NetworkStatusBar } from "./components/NetworkStatusBar";
import { ErrorBoundary } from "./components/ErrorBoundary";

const App: React.FC = () => {
  const [isStoreReady, setIsStoreReady] = useState(false);
  const { appIsReady, onLayoutRootView } = useFonts();
  const { isConnected } = useNetworkStatus();

  useEffect(() => {
    async function loadState() {
      try {
        await loadPersistedState();
      } catch (error) {
      } finally {
        setIsStoreReady(true);
      }
    }
    loadState();
  }, []);

  const isAppReady = useMemo(
    () => appIsReady && isStoreReady,
    [appIsReady, isStoreReady]
  );

  if (!isAppReady) return null;

  return (
    <ErrorBoundary>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <Provider store={store}>
          <ThemeProvider>
            <NavigationRoot>
              <AppNavigator />
              {!isConnected && <NetworkStatusBar />}
              <Toast />
            </NavigationRoot>
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
