import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useLoginMutation } from "@/store/auth/authApi";
import { selectIsAuthenticated } from "@/store/auth/authSlice";
import { toastManager } from "@/utils/toastManager";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./auth/constants/paramTypes";
import ThemedKeyboardView from "@/components/themed/ThemedKeyboardView";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextField from "@/components/themedComponent/ThemedTextField";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/theme/ThemeProvider";
import AppLogo from "@/components/AppLogo";
import { Ionicons } from "@expo/vector-icons";

type FormValues = {
  email: string;
  password: string;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { theme } = useTheme();
  const colors = theme.colors;
  const isDark = theme.dark === true;
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
  });

  const [login, { isLoading }] = useLoginMutation();
  const [localLoading, setLocalLoading] = useState(false);

  const isProcessing = isLoading || localLoading;

  // Navigate back to main app after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      const timeoutId = setTimeout(() => {
        navigation.getParent()?.goBack?.();
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = async (data: FormValues) => {
    setLocalLoading(true);
    try {
      await login(data).unwrap();
      toastManager.success("Welcome back!", "Successfully signed in");
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Login failed";
      if (error?.data?.code === "emailNotVerified") {
        toastManager.error("Sign In", errorMessage);
        setTimeout(() => {
          navigation.navigate("VerifyEmail", { userEmail: data?.email });
        }, 2000);
      } else {
        toastManager.error("Sign In", errorMessage);
      }
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ["#0a0a0a", "#18181b"] : ["#f8fafc", "#e2e8f0"]}
      style={styles.container}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent={true}
      />
      <ThemedKeyboardView centerContent={true} style={styles.contentContainer}>
        <View style={styles.headerSection}>
          <AppLogo />
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeHeader}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[
                  styles.backButton,
                  {
                    backgroundColor: colors.cardBackground,
                  },
                ]}
                activeOpacity={0.7}
                disabled={isProcessing}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <ThemedText
                color={colors.text}
                style={[
                  styles.welcomeTitle,
                  {
                    fontFamily: theme.fonts.bold,
                    fontSize: theme.fontSizes.xl,
                  },
                ]}
              >
                Welcome Back
              </ThemedText>
            </View>
            <ThemedText
              color={colors.secondaryText}
              style={[
                styles.welcomeSubtitle,
                {
                  fontFamily: theme.fonts.regular,
                  fontSize: theme.fontSizes.md,
                },
              ]}
            >
              Sign in to continue to your account
            </ThemedText>
          </View>
        </View>

        <View
          style={[
            styles.formCard,
            {
              backgroundColor: colors.cardBackground,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View style={styles.formContent}>
            <ThemedTextField
              control={control}
              name="email"
              label="Email Address *"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              leftIcon={{ name: "email" }}
              editable={!isProcessing}
            />

            <ThemedTextField
              control={control}
              name="password"
              label="Password *"
              placeholder="Enter your password"
              secureTextEntry
              rules={{ required: "Password is required" }}
              leftIcon={{ name: "lock" }}
              editable={!isProcessing}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgetPassword")}
              style={styles.forgotPasswordButton}
              disabled={isProcessing}
            >
              <ThemedText
                color={colors.brandColor || colors.primary}
                style={{
                  fontFamily: theme.fonts.medium,
                  fontSize: theme.fontSizes.md,
                  opacity: isProcessing ? 0.5 : 1,
                }}
              >
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            <ThemedTouchableOpacity
              onPress={handleSubmit(handleLogin)}
              disabled={isProcessing}
              style={[
                styles.loginButton,
                {
                  opacity: isProcessing ? 0.7 : 1,
                },
              ]}
            >
              <LinearGradient
                colors={[
                  colors.brandColor ?? "#dc1e3e",
                  colors.brandColor ?? "#dc1e3e",
                ]}
                style={styles.gradient}
              >
                {isProcessing ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.white}
                    />
                    <ThemedText style={styles.loadingText}>
                      Signing In...
                    </ThemedText>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <ThemedText style={styles.buttonText}>SIGN IN</ThemedText>
                  </View>
                )}
              </LinearGradient>
            </ThemedTouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.divider}>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.border }]}
              />
              <ThemedText
                color={colors.secondaryText}
                style={styles.dividerText}
              >
                OR
              </ThemedText>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.border }]}
              />
            </View>

            <View style={styles.registerRow}>
              <ThemedText
                color={colors.secondaryText}
                style={styles.registerText}
              >
                Don&apos;t have an account?{" "}
              </ThemedText>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                disabled={isProcessing}
              >
                <ThemedText
                  color={colors.brandColor || colors.primary}
                  style={[
                    styles.registerLink,
                    { opacity: isProcessing ? 0.5 : 1 },
                  ]}
                >
                  Create Account
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ThemedKeyboardView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
    marginTop: -200,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 15,
  },
  welcomeSection: {
    alignItems: "center",
    marginTop: -80,
  },
  welcomeTitle: {
    textAlign: "center",
    flex: 1,
  },
  welcomeSubtitle: {
    textAlign: "center",
    opacity: 0.7,
  },
  formCard: {
    borderRadius: 10,
    padding: 0,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  formContent: {
    padding: 15,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
    paddingVertical: 8,
  },
  loginButton: {
    height: 46,
    borderRadius: 4,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontFamily: "Montserrat-Medium",
    fontSize: 13,
    marginLeft: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Montserrat-Bold",
    fontSize: 15,
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 15,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    marginHorizontal: 12,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 13,
  },
  registerLink: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 13,
  },
});

export default LoginScreen;
