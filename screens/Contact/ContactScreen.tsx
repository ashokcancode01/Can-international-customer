import React, { useCallback, useState } from "react";
import { View, StyleSheet, RefreshControl } from "react-native";
import { useForm } from "react-hook-form";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import ThemedTextField from "@/components/themedComponent/ThemedTextField";
import ThemedButton from "@/components/themedComponent/ThemedButton";
import ThemedText from "@/components/themed/ThemedText";
import { useTheme } from "@/theme/ThemeProvider";
import ThemedKeyboardView from "@/components/themed/ThemedKeyboardView";
import { ThemedView } from "@/components/themed/ThemedView";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { useCreateLeadMutation } from "@/store/slices/contact";

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

      setMessageResult({ text: "Message sent successfully!", type: "success" });
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

  return (
    <ThemedKeyboardView
      scrollEnabled
      fullWidth
      style={styles.container}
      backgroundColor={theme.colors.background}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.brandColor}
          colors={[theme.colors.brandColor!]}
        />
      }
    >
      {/* Contact Info Card */}
      <ThemedView style={[styles.cardContainer, { backgroundColor: theme.colors.card }]}>
        <ThemedText type="label" style={[styles.heading, { color: theme.colors.text }]}>
          Contact Us
        </ThemedText>
        <View style={styles.infoRow}>
          <Entypo name="phone" size={20} color={theme.colors.brandColor!} />
          <ThemedText style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            01-5970736
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <Entypo name="location-pin" size={20} color={theme.colors.brandColor!} />
          <ThemedText style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Nepal Can International, Tinkune, Muni Bhairab Marg, Kathmandu 44600
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="email" size={20} color={theme.colors.brandColor!} />
          <ThemedText style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            support@international.nepalcan.com
          </ThemedText>
        </View>
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
          label="Full Name"
          placeholderTextColor={theme.colors.textSecondary}
          rules={{ required: "Full Name is required" }}
        />
        <ThemedTextField
          control={control}
          name="subject"
          placeholder="Subject"
          label="Subject"
          placeholderTextColor={theme.colors.textSecondary}
        />
        <ThemedTextField
          control={control}
          name="phone"
          placeholder="Phone"
          label="Phone"
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
          label="Message"
          multiline
          scrollEnabled={true}
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
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    elevation: 3,
    marginHorizontal: 12
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
