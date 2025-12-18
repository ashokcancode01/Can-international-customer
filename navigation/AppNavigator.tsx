import React, { useEffect, useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import {
  selectIsAuthenticated,
  selectIsAuthLoading,
  setAuthLoading,
} from "../store/auth/authSlice";
import AuthNavigator from "./AuthNavigator";
import MainAppNavigator from "./MainAppNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

export type RootStackParamList = {
  MainApp: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthLoading = useSelector(selectIsAuthLoading);
  const { theme } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthLoading) return;
    const timer = setTimeout(() => {
      dispatch(setAuthLoading(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch, isAuthLoading]);

  const loadingContainerStyle = useMemo(
    () => ({
      flex: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      backgroundColor: theme.colors.background,
    }),
    [theme.colors.background]
  );

  if (isAuthLoading) {
    return (
      <SafeAreaView style={loadingContainerStyle}>
        <ActivityIndicator size="large" color={theme.colors.brandColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.cardBackground }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
            animation: "fade",
          }}
          initialRouteName="MainApp"
        >
          <Stack.Screen
            name="MainApp"
            component={MainAppNavigator}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              gestureEnabled: true,
              presentation: "modal",
            }}
          />
        </Stack.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default AppNavigator;
