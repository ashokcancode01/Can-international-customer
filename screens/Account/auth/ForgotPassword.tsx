import React, { useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
} from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { toastManager } from "@/utils/toastManager";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./constants/paramTypes";
import ThemedKeyboardView from "@/components/themed/ThemedKeyboardView";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextField from "@/components/themedComponent/ThemedTextField";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";
import { LinearGradient } from "expo-linear-gradient";
import { useForgotPasswordMutation } from "@/store/auth/authApi";
import { useTheme } from "@/theme/ThemeProvider";
import AppLogo from "@/components/AppLogo";

const { width: screenWidth } = Dimensions.get("window");

type FormValues = {
  email: string;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const ForgetPasswordScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const [forgotPassword, { isLoading: loadingForget }] =
    useForgotPasswordMutation();

  const { theme } = useTheme();
  const colors = theme.colors;
  const isDark = theme.dark === true;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const isProcessing = isSubmitting || loadingForget;

  const handleForgetPassword = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await forgotPassword(data).unwrap();

      setEmailSent(true);
      setSentEmail(data.email);
      toastManager.success(
        "Email Sent",
        `Reset password instructions sent to ${data.email}`
      );

      setTimeout(() => {
        navigation.navigate("ResetPassword", { userEmail: data?.email });
      }, 1000);
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.data?.message || "Password reset request failed";
      toastManager.error("Password Reset", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = () => {
    if (emailSent) {
      Alert.alert(
        "Resend Email",
        "Are you sure you want to resend the password reset email?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Resend",
            onPress: () => {
              toastManager.info(
                "Email Resent",
                "Please check your inbox for password reset instructions."
              );
            },
          },
        ]
      );
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
                Forgot Password?
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
              Enter your email to receive reset instructions
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
            {!emailSent ? (
              <>
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

                <ThemedTouchableOpacity
                  onPress={handleSubmit(handleForgetPassword)}
                  disabled={isProcessing}
                  style={[
                    styles.resetButton,
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
                          Sending...
                        </ThemedText>
                      </View>
                    ) : (
                      <View style={styles.buttonContent}>
                        <ThemedText style={styles.buttonText}>
                          SEND RESET LINK
                        </ThemedText>
                      </View>
                    )}
                  </LinearGradient>
                </ThemedTouchableOpacity>
              </>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={60}
                    color={colors.success}
                  />
                </View>
                <ThemedText
                  color={colors.text}
                  style={[
                    styles.successTitle,
                    {
                      fontFamily: theme.fonts.bold,
                      fontSize: theme.fontSizes.xl,
                    },
                  ]}
                >
                  Email Sent!
                </ThemedText>
                <ThemedText
                  color={colors.secondaryText}
                  style={[
                    styles.successMessage,
                    {
                      fontFamily: theme.fonts.regular,
                      fontSize: theme.fontSizes.md,
                    },
                  ]}
                >
                  Reset password instructions have been sent to
                </ThemedText>
                <ThemedText
                  color={colors.brandColor || colors.primary}
                  style={[
                    styles.emailText,
                    {
                      fontFamily: theme.fonts.medium,
                      fontSize: theme.fontSizes.md,
                    },
                  ]}
                >
                  {sentEmail}
                </ThemedText>

                <TouchableOpacity
                  onPress={handleResendEmail}
                  style={styles.resendButton}
                  disabled={isProcessing}
                >
                  <ThemedText
                    color={colors.brandColor || colors.primary}
                    style={[
                      styles.resendText,
                      {
                        fontFamily: theme.fonts.medium,
                        fontSize: theme.fontSizes.md,
                        opacity: isProcessing ? 0.5 : 1,
                      },
                    ]}
                  >
                    Resend Email
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
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
                Remember your password?{" "}
              </ThemedText>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
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
  resetButton: {
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
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    textAlign: "center",
    marginBottom: 12,
  },
  successMessage: {
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 20,
    opacity: 0.7,
  },
  emailText: {
    textAlign: "center",
    marginBottom: 24,
  },
  resendButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
    paddingVertical: 8,
  },
  resendText: {},
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
    marginHorizontal: 12,
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

export default ForgetPasswordScreen;
