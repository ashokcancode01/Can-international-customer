import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { useForm } from "react-hook-form";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {
  useVerifyEmailMutation,
  useResendOtpMutation,
} from "@/store/auth/authApi";
import { toastManager } from "@/utils/toastManager";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./constants/paramTypes";
import ThemedKeyboardView from "@/components/themed/ThemedKeyboardView";
import ThemedText from "@/components/themed/ThemedText";
import ThemedTextField from "@/components/themedComponent/ThemedTextField";
import ThemedTouchableOpacity from "@/components/themed/ThemedTouchableOpacity";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/theme/ThemeProvider";
import AppLogo from "@/components/AppLogo";

const { width: screenWidth } = Dimensions.get("window");

type FormValues = {
  email: string;
  otp: string;
};

type ParamList = {
  MyScreen: { userEmail: string };
};

type ScreenRouteProp = RouteProp<ParamList, "MyScreen">;

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const VerifyEmail = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [localLoading, setLocalLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [verify, { isLoading: loadingEmailVerification }] =
    useVerifyEmailMutation();
  const [resendOtp, { isLoading: loadingOtp }] = useResendOtpMutation();

  const { theme } = useTheme();
  const colors = theme.colors;
  const isDark = theme.dark === true;

  const route = useRoute<ScreenRouteProp>();
  const { userEmail } = route.params || {};

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: { email: "", otp: "" },
    mode: "onChange",
  });

  const isProcessing = localLoading || loadingEmailVerification || loadingOtp;

  // For re-sending the OTP
  const handleResendOtp = async () => {
    try {
      await resendOtp({ email: userEmail }).unwrap();
      toastManager.success(
        "OTP Resent",
        "Please check your email for the new OTP."
      );

      let countdown = 60;
      setTimer(countdown);

      const timerInterval = setInterval(() => {
        countdown -= 1;
        setTimer(countdown);

        if (countdown === 0) {
          clearInterval(timerInterval);
        }
      }, 1000);
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.data?.message || "Failed to resend OTP";
      toastManager.error("Resend OTP", errorMessage);
    }
  };

  // For putting the email in the form
  useEffect(() => {
    reset({ email: userEmail });
  }, [userEmail, reset]);

  const handleVerify = async (data: FormValues) => {
    setLocalLoading(true);
    try {
      await verify(data).unwrap();
      toastManager.success("Account Verified", "Email verified successfully");
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1000);
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.data?.message || "Verification failed";
      toastManager.error("Email Verification", errorMessage);
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
                Verify Your Email
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
              Enter the verification code sent to your email
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
              leftIcon={{ name: "email" }}
              editable={false}
            />

            <ThemedTextField
              control={control}
              name="otp"
              label="Verification Code *"
              placeholder="Enter 6-digit code"
              keyboardType="number-pad"
              maxLength={6}
              leftIcon={{ name: "key" }}
              rules={{
                required: "Verification code is required",
              }}
              editable={!isProcessing}
            />

            <ThemedTouchableOpacity
              onPress={handleSubmit(handleVerify)}
              disabled={isProcessing}
              style={[
                styles.verifyButton,
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
                      Verifying...
                    </ThemedText>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <ThemedText style={styles.buttonText}>
                      VERIFY EMAIL
                    </ThemedText>
                  </View>
                )}
              </LinearGradient>
            </ThemedTouchableOpacity>

            <TouchableOpacity
              onPress={handleResendOtp}
              style={styles.forgotPasswordButton}
              disabled={timer > 0 || isProcessing}
            >
              <ThemedText
                color={colors.brandColor || colors.primary}
                style={[
                  {
                    fontFamily: theme.fonts.medium,
                    fontSize: theme.fontSizes.md,
                    opacity: timer > 0 || isProcessing ? 0.5 : 1,
                  },
                  styles.resendText,
                ]}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.instructionContainer}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={colors.secondaryText}
              />
              <ThemedText
                color={colors.secondaryText}
                style={[
                  styles.instructionText,
                  {
                    fontFamily: theme.fonts.regular,
                    fontSize: theme.fontSizes.md,
                  },
                ]}
              >
                Check your spam folder if you don't see the email
              </ThemedText>
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
  verifyButton: {
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
  resendText: {
    textDecorationLine: "underline",
  },
  footer: {
    paddingHorizontal: 12,
    paddingBottom: 15,
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  instructionText: {
    marginLeft: 8,
    textAlign: "center",
    opacity: 0.7,
  },
});

export default VerifyEmail;
