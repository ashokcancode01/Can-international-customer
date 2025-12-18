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
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { toastManager } from "@/utils/toastManager";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ThemedKeyboardView from "@/components/themed/ThemedKeyboardView";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextField from "@/components/themedComponent/ThemedTextField";
import ThemedTouchableOpacity from "@/components/themed/ThemedTouchableOpacity";
import { LinearGradient } from "expo-linear-gradient";
import { useResetPasswordMutation } from "@/store/auth/authApi";
import { AuthStackParamList } from "./constants/paramTypes";
import { useTheme } from "@/theme/ThemeProvider";
import AppLogo from "@/components/AppLogo";

const { width: screenWidth } = Dimensions.get("window");

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

type ParamList = {
  myScreen: { userEmail: string };
};

type screenRouteProp = RouteProp<ParamList, "myScreen">;

const ResetPasswordScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [resetPassword, { isLoading: loadingReset }] =
    useResetPasswordMutation();

  // User email from the forgot password screen
  const route = useRoute<screenRouteProp>();
  const { userEmail } = route.params;

  // Use theme for colors and fonts
  const { theme } = useTheme();
  const colors = theme.colors;
  const isDark = theme.dark === true;

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    },
    mode: "onChange",
  });

  const password = watch("password");

  React.useEffect(() => {
    reset({ email: userEmail });
  }, []);

  const isProcessing = isSubmitting || loadingReset;

  const handleResetPassword = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await resetPassword(data).unwrap();

      setEmailSent(true);
      toastManager.success("Password Reset", "Password reset successful.");

      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      }, 1000);
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.data?.message || "Password reset request failed";
      toastManager.error("Password Reset", errorMessage);
    } finally {
      setIsSubmitting(false);
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
                Reset Password
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
              Create a new secure password for your account
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
                  editable={false}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                />

                <ThemedTextField
                  control={control}
                  name="otp"
                  label="Verification Code *"
                  placeholder="Enter the 6-digit code"
                  keyboardType="number-pad"
                  leftIcon={{ name: "key" }}
                  rules={{
                    required: "Verification code is required",
                  }}
                  editable={!isProcessing}
                />

                <ThemedTextField
                  control={control}
                  name="password"
                  label="New Password *"
                  placeholder="Enter your new password"
                  secureTextEntry
                  leftIcon={{ name: "lock" }}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  }}
                  editable={!isProcessing}
                />

                <ThemedTextField
                  control={control}
                  name="confirmPassword"
                  label="Confirm Password *"
                  placeholder="Confirm your new password"
                  secureTextEntry
                  leftIcon={{ name: "lock" }}
                  rules={{
                    required: "Please confirm your password",
                    validate: (value: any) =>
                      value === password || "Passwords do not match",
                  }}
                  editable={!isProcessing}
                />

                <ThemedTouchableOpacity
                  onPress={handleSubmit(handleResetPassword)}
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
                          Resetting Password...
                        </ThemedText>
                      </View>
                    ) : (
                      <View style={styles.buttonContent}>
                        <ThemedText style={styles.buttonText}>
                          RESET PASSWORD
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
                  Password Reset Successful!
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
                  Your password has been successfully reset. You will be
                  redirected to the login screen shortly.
                </ThemedText>
              </View>
            )}
          </View>

          {!emailSent && (
            <View style={styles.footer}>
              <View style={styles.divider}>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
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
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
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
                  onPress={() =>
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: "Login" }],
                      })
                    )
                  }
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
          )}
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
    lineHeight: 20,
    opacity: 0.7,
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

export default ResetPasswordScreen;
