import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../theme/ThemeProvider";
import LoginScreen from "../screens/Account/Login";
import ForgotPassword from "../screens/Account/auth/ForgotPassword";
import RegisterScreen from "../screens/Account/Register";
import VerifyEmail from "@/screens/Account/auth/VerifyEmail";
import ResetPasswordScreen from "@/screens/Account/auth/ResetPassword";

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { theme } = useTheme();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={() => ({
          headerShown: false,
        })}
      />

      <AuthStack.Screen
        name="ForgetPassword"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      <AuthStack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
