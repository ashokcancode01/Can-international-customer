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

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    reset();
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

    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, [reset, route.params]);

  // Reset form when screen is focused
  useFocusEffect(
    useCallback(() => {
      // On screen focus, set default values
      reset({
        fullName: "",
        subject: "",
        phone: "",
        email: "",
        message: route.params?.prefillMessage ?? "",
      });

      // Cleanup: reset message when leaving this screen
      return () => {
        reset({
          fullName: "",
          subject: "",
          phone: "",
          email: "",
          message: "",
        });
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
          rules={{ required: "Subject is required" }}
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
            required: "Email is required",
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
          isLoading={false}
          loadingText="Sending..."
          onPress={handleSubmit(onSubmit)}
        />
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
