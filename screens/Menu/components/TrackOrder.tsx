import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import { ThemedCard } from "@/components/themed/ThemedCard";
import ThemedText from "@/components/themed/ThemedText";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useGetTrackOrderQuery } from "@/store/slices/trackorder";

const TrackOrderScreen = () => {
  const { theme } = useTheme();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const {
    data: TrackOrder,
    isLoading,
    error,
  } = useGetTrackOrderQuery(submittedId, {
    skip: !submittedId,
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedCard style={styles.trackingCard} padding="lg" radius shadow="md">
 
          <View
            style={[
              styles.iconContainer,       
              { backgroundColor: theme.colors.brandColor + "20" },
            ]}
          >
            <FontAwesome5
              name="truck"
              size={36}
              color={theme.colors.brandColor}
            />
          </View>
          <ThemedText
            type="cardHeader"
            style={{ fontSize: 18, textAlign: "center", marginBottom: 8 }}
          >
            Track Your Order
          </ThemedText>

          <ThemedText
            type="cardLabel"
            style={{
              fontSize: 12,
              textAlign: "center",
              marginBottom: 16,
              color: theme.colors.textSecondary,
            }}
          >
            Enter your Order ID below to see the current status and delivery
            timeline.
          </ThemedText>

          <View
            style={[
              styles.inputContainer,
              {
                borderColor: isFocused
                  ? theme.colors.brandColor
                  : "#613b3b33",
                backgroundColor: isFocused ? "#FFFFFF20" : "#FFFFFF1A",
              },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color="#888"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              placeholder="e.g. C42EQEX6NFQP"
              placeholderTextColor="#888"
              value={trackingNumber}
              onChangeText={setTrackingNumber}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <Ionicons name="qr-code-outline" size={20} color="#888" />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSubmittedId(trackingNumber.trim())}
          >
            <ThemedCard
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                backgroundColor: theme.colors.brandColor,
                paddingVertical: 12,
              }}
              radius
            >
              <ThemedText
                type="buttonText"
                style={{ color: "#fff", marginRight: 6 }}
                capital
              >
                Track
              </ThemedText>
            </ThemedCard>
          </TouchableOpacity>

          {isLoading && (
            <ThemedText style={{ marginTop: 12, textAlign: "center" }}>
              Loading...
            </ThemedText>
          )}

          {error && (
            <ThemedText
              style={{
                marginTop: 12,
                textAlign: "center",
                color: "red",
              }}
            >
              Order not found or cancelled
            </ThemedText>
          )}

          {TrackOrder?.message && (
            <ThemedText
              style={{
                marginTop: 12,
                textAlign: "center",
                color: theme.colors.textSecondary,
              }}
            >
              {TrackOrder.message}
            </ThemedText>
          )}
        </ThemedCard>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  trackingCard: {
    width: "100%",
    marginTop: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
});

export default TrackOrderScreen;
