import React, { useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { toastManager } from "@/utils/toastManager";
import { Ionicons } from "@expo/vector-icons";
import ThemedKeyboardView from "@/components/themed/ThemedKeyboardView";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextField from "@/components/themedComponent/ThemedTextField";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";
import { LinearGradient } from "expo-linear-gradient";
import { useRegisterMutation } from "@/store/auth/authApi";
import { AuthStackParamList } from "./auth/constants/paramTypes";
import { useTheme } from "@/theme/ThemeProvider";
import AppLogo from "@/components/AppLogo";

const { width: screenWidth } = Dimensions.get("window");

type FormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
};

type RegisterScreenNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const { theme } = useTheme();
  const colors = theme.colors;
  const isDark = theme.dark === true;

  const [register, { isLoading: loadingRegister }] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password");
  const userEmail = watch("email");

  const isProcessing = localLoading || loadingRegister;

  const handleRegister = async (data: FormValues) => {
    if (!termsAccepted) {
      setTermsError(true);
      toastManager.error(
        "Registration",
        "Please accept the terms and conditions"
      );
      return;
    }

    setLocalLoading(true);

    try {
      const response = await register({
        ...data,
        termsAccepted: true,
        userType: "Customer",
      }).unwrap();

      toastManager.success(
        "Registration Successful",
        `You have successfully registered as a customer`
      );

      setTimeout(() => {
        navigation.navigate("VerifyEmail", { userEmail: userEmail });
      }, 1000);
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.data?.message || "Registration failed";
      toastManager.error("Registration", errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted);
    if (termsError && !termsAccepted) {
      setTermsError(false);
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
                Create Account
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
              Join us and start your journey
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
              name="name"
              label="Full Name *"
              placeholder="Enter your full name"
              leftIcon={{ name: "person" }}
              rules={{
                required: "Full name is required",
              }}
              editable={!isProcessing}
            />

            <ThemedTextField
              control={control}
              name="email"
              label="Email Address *"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={{ name: "email" }}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              editable={!isProcessing}
            />

            <ThemedTextField
              control={control}
              name="phone"
              label="Phone Number *"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              leftIcon={{ name: "call" }}
              rules={{
                required: "Phone number is required",
              }}
              editable={!isProcessing}
            />

            <ThemedTextField
              control={control}
              name="address"
              label="Address *"
              placeholder="Enter your address"
              leftIcon={{ name: "location-on" }}
              rules={{
                required: "Address is required",
              }}
              editable={!isProcessing}
            />

            <ThemedTextField
              control={control}
              name="password"
              label="Password *"
              placeholder="Enter your password"
              secureTextEntry
              leftIcon={{ name: "lock" }}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              editable={!isProcessing}
            />

            <ThemedTextField
              control={control}
              name="confirmPassword"
              label="Confirm Password *"
              placeholder="Confirm your password"
              secureTextEntry
              leftIcon={{ name: "lock" }}
              rules={{
                required: "Please confirm your password",
                validate: (value: any) =>
                  value === password || "Passwords do not match",
              }}
              editable={!isProcessing}
            />

            <View style={styles.termsSection}>
              <TouchableOpacity
                style={styles.termsContainer}
                onPress={toggleTermsAccepted}
                activeOpacity={0.7}
                disabled={isProcessing}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: termsError
                        ? colors.error
                        : termsAccepted
                        ? colors.brandColor || colors.primary
                        : colors.border,
                      backgroundColor: termsAccepted
                        ? colors.brandColor || colors.primary
                        : "transparent",
                    },
                  ]}
                >
                  {termsAccepted && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={theme.colors.white}
                    />
                  )}
                </View>
                <View style={styles.termsTextContainer}>
                  <ThemedText
                    color={
                      termsError
                        ? colors.error || "#ff4444"
                        : colors.secondaryText
                    }
                    style={[
                      styles.termsText,
                      {
                        fontFamily: theme.fonts.regular,
                        fontSize: theme.fontSizes.sm,
                      },
                    ]}
                  >
                    I agree to the{" "}
                    <ThemedText
                      color={colors.brandColor || colors.primary}
                      style={styles.termsLink}
                    >
                      Terms of Service
                    </ThemedText>{" "}
                    and{" "}
                    <ThemedText
                      color={colors.brandColor || colors.primary}
                      style={styles.termsLink}
                    >
                      Privacy Policy
                    </ThemedText>
                  </ThemedText>
                </View>
              </TouchableOpacity>
              {termsError && (
                <ThemedText
                  color={colors.error}
                  style={[
                    styles.termsErrorText,
                    {
                      fontFamily: theme.fonts.regular,
                      fontSize: theme.fontSizes.sm,
                    },
                  ]}
                >
                  Please accept the terms and conditions to continue
                </ThemedText>
              )}
            </View>

            <ThemedTouchableOpacity
              onPress={handleSubmit(handleRegister)}
              disabled={isProcessing}
              style={[
                styles.registerButton,
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
                      Creating Account...
                    </ThemedText>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <ThemedText style={styles.buttonText}>
                      CREATE ACCOUNT
                    </ThemedText>
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
                style={[
                  styles.dividerText,
                  {
                    fontFamily: theme.fonts.medium,
                    fontSize: theme.fontSizes.sm,
                  },
                ]}
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
                style={[
                  styles.registerText,
                  {
                    fontFamily: theme.fonts.regular,
                    fontSize: theme.fontSizes.md,
                  },
                ]}
              >
                Already have an account?{" "}
              </ThemedText>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                disabled={isProcessing}
              >
                <ThemedText
                  color={colors.brandColor || colors.primary}
                  style={[
                    styles.registerLink,
                    {
                      fontFamily: theme.fonts.medium,
                      fontSize: theme.fontSizes.md,
                      opacity: isProcessing ? 0.5 : 1,
                    },
                  ]}
                >
                  Sign In
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
    marginTop: -100,
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
  termsSection: {
    marginBottom: 12,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    marginRight: 12,
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    opacity: 0.7,
  },
  termsLink: {
    textDecorationLine: "underline",
  },
  termsErrorText: {
    opacity: 0.7,
  },
  registerButton: {
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
    opacity: 0.7,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    opacity: 0.7,
  },
  registerLink: {},
});

export default RegisterScreen;
