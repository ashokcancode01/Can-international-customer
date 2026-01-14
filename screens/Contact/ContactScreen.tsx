import React, { useCallback, useState } from "react";
import { View, StyleSheet, RefreshControl, Linking, Image } from "react-native";
import { useForm } from "react-hook-form";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import ThemedTextField from "@/components/themedComponent/ThemedTextField";
import ThemedButton from "@/components/themedComponent/ThemedButton";
import ThemedText from "@/components/themed/ThemedText";
import { useTheme } from "@/theme/ThemeProvider";
import ThemedKeyboardView from "@/components/themed/ThemedKeyboardView";
import { ThemedView } from "@/components/themed/ThemedView";
import { useRoute, useFocusEffect, } from "@react-navigation/native";
import { useCreateLeadMutation } from "@/store/slices/contact";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";

interface FormData {
  fullName: string;
  subject: string;
  phone: string;
  email: string;
  message: string;
}

const ContactScreen = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [messageResult, setMessageResult] = useState<{ text: string; type: "success" | "error" } | null>(null); // updated
  const route = useRoute<any>();
  const hideAppBar = route.params?.hideAppBar ?? false;
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      subject: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const [createLead, { isLoading }] = useCreateLeadMutation();

  const onSubmit = async (data: FormData) => {
    try {
      await createLead({
        payload: {
          name: data.fullName,
          phone: data.phone,
          email: data.email,
          description: data.message,
          inquiryOf: "General",
        }
      }).unwrap();

      setMessageResult({ text: "Thank you! We will contact you shortly.", type: "success" });
      reset();
      setTimeout(() => setMessageResult(null), 3000);

    } catch {
      setMessageResult({ text: "Failed to send message. Please try again.", type: "error" });
      setTimeout(() => setMessageResult(null), 3000);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    reset({
      fullName: "",
      subject: "",
      phone: "",
      email: "",
      message: route.params?.prefillMessage ?? "",
    });
    setMessageResult(null);
    setTimeout(() => setRefreshing(false), 600);
  }, [reset, route.params]);

  // Reset form when screen is focused
  useFocusEffect(
    useCallback(() => {
      reset({
        fullName: "",
        subject: "",
        phone: "",
        email: "",
        message: route.params?.prefillMessage ?? "",
      });
      setMessageResult(null);
      return () => {
        reset({
          fullName: "",
          subject: "",
          phone: "",
          email: "",
          message: "",
        });
        setMessageResult(null);
      };
    }, [route.params, reset])
  );

  //Helper to open phone  dialer with the given
  const handleCall = async (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    try {
      await Linking.openURL(url);
    } catch { }
  };

  //Helper to open email client
  const handleEmail = async (email: string) => {
    const url = `mailto:${email}`;
    try {
      await Linking.openURL(url);
    } catch { }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {!hideAppBar && (
        <View style={[styles.HeaderBackground, { backgroundColor: theme.colors.cardBackground }]}>
          <Image
            source={require("../../assets/app/appBar.png")}
            resizeMode="cover"
            style={styles.HeaderImage}
          />
        </View>
      )}
      <ThemedKeyboardView
        scrollEnabled
        fullWidth
        style={styles.container}
        backgroundColor={theme.colors.background}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={80}
            tintColor={theme.colors.text}
            colors={[theme.colors.text || "#fff"]}
            style={{ backgroundColor: theme.colors.background, }}
          />}
      >
        {/* Contact Info Card */}
        <ThemedView style={[styles.cardContainer, { backgroundColor: theme.colors.card, marginTop: hideAppBar ? 20 : 80 }]}>
          <ThemedText type="label" style={[styles.heading, { color: theme.colors.text }]}>
            Contact Us
          </ThemedText>
          <ThemedTouchableOpacity onPress={() => handleCall("01-5970736")} style={{ backgroundColor: "transparent" }}>
            <View style={styles.infoRow}>
              <Entypo name="phone" size={20} color={theme.colors.brandColor!} />
              <ThemedText style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                01-5970736
              </ThemedText>
            </View>
          </ThemedTouchableOpacity>
          <View style={styles.infoRow}>
            <Entypo name="location-pin" size={20} color={theme.colors.brandColor!} />
            <ThemedText style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              Nepal Can International, Tinkune, Muni Bhairab Marg, Kathmandu 44600
            </ThemedText>
          </View>

          <ThemedTouchableOpacity
            onPress={() => handleEmail("support@international.nepalcan.com")}
            style={{ backgroundColor: "transparent" }}
          >
            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={20} color={theme.colors.brandColor!} />
              <ThemedText style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                support@international.nepalcan.com
              </ThemedText>
            </View>
          </ThemedTouchableOpacity>

        </ThemedView>

        {/* Form Card */}
        <ThemedView style={[styles.cardContainer, { backgroundColor: theme.colors.card }]}>
          <ThemedText type="label" style={[styles.heading, { color: theme.colors.text }]}>
            Send a Message
          </ThemedText>
          <ThemedTextField
            control={control}
            name="fullName"
            placeholder="Full Name"
            leftIcon={{
              name: "person",
              color: theme.colors.brandColor,
            }}
            label={
              <ThemedText>
                Full Name{" "}
                <ThemedText style={{ color: theme.colors.brandColor }}>*</ThemedText>
              </ThemedText>
            }
            placeholderTextColor={theme.colors.textSecondary}
            rules={{ required: "Full Name is required" }}
          />
          <ThemedTextField
            control={control}
            name="subject"
            placeholder="Subject"
            leftIcon={{
              name: "subject",
              color: theme.colors.brandColor,
            }}
            label="Subject"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <ThemedTextField
            control={control}
            name="phone"
            placeholder="Phone"
            leftIcon={{
              name: "phone",
              color: theme.colors.brandColor,
            }}
            label={
              <ThemedText>
                Phone{" "}
                <ThemedText style={{ color: theme.colors.brandColor }}>*</ThemedText>
              </ThemedText>
            }
            keyboardType="phone-pad"
            placeholderTextColor={theme.colors.textSecondary}
            rules={{
              required: "Phone is required",
              pattern: { value: /^[0-9]+$/, message: "Phone must be numeric" },
            }}
          />
          <ThemedTextField
            control={control}
            name="email"
            placeholder="Email"
            leftIcon={{
              name: "email",
              color: theme.colors.brandColor,
            }}
            label="Email"
            keyboardType="email-address"
            placeholderTextColor={theme.colors.textSecondary}
            rules={{
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
            }}
          />
          <ThemedTextField
            control={control}
            name="message"
            placeholder="Message"
            label={
              <ThemedText>
                Message{" "}
                <ThemedText style={{ color: theme.colors.brandColor }}>*</ThemedText>
              </ThemedText>
            }
            multiline
            scrollEnabled={true}
            clearButton={false}
            placeholderTextColor={theme.colors.textSecondary}
            rules={{ required: "Message is required" }}
          />
          <ThemedButton
            buttonName="Send"
            isLoading={isLoading}
            loadingText="Sending..."
            onPress={handleSubmit(onSubmit)}
          />

          {/* Success/Error Message */}
          {messageResult && (
            <ThemedText
              style={{
                marginTop: 10,
                marginLeft: 60,
                color: messageResult.type === "success" ? theme.colors.green : theme.colors.brandColor,
                fontSize: 13,
              }}
            >
              {messageResult.text}
            </ThemedText>
          )}
        </ThemedView>
      </ThemedKeyboardView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  HeaderBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 10,
  },
  HeaderImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  cardContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 0,
    marginHorizontal: 12,
    borderColor: "rgba(0,0,0,0.05)",
    borderWidth: 1,
  },
  heading: {
    fontSize: 15,
    fontFamily: "Montserrat-bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 12,
  },
});

export default ContactScreen;
