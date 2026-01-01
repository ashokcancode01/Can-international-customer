import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Image,
  Text,
} from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import Card from "../components/Card"; 
import ThemedText from "@/components/themed/ThemedText"; 
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useGetTrackOrderQuery, TrackOrderResponse, OrderNote } from "@/store/slices/trackorder";
import { useFocusEffect } from "@react-navigation/native";

const TrackOrderScreen = () => {
  const { theme } = useTheme();

  const [trackingNumber, setTrackingNumber] = useState("");
  const [submittedId, setSubmittedId] = useState<string | undefined>(undefined);
  const [isFocused, setIsFocused] = useState(false);
  const [orderData, setOrderData] = useState<TrackOrderResponse | null>(null);

  // Format date like "DEC 31 05:27 PM"
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return d
      .toLocaleString("en-US", options)
      .replace(",", "")
      .toUpperCase();
  };

  const { data: TrackOrder, isLoading, error } = useGetTrackOrderQuery(submittedId!, {
    skip: !submittedId,
  });

  useEffect(() => {
    if (TrackOrder) setOrderData(TrackOrder);
  }, [TrackOrder]);

  useFocusEffect(
    useCallback(() => {
      setTrackingNumber("");
      setSubmittedId(undefined);
      setIsFocused(false);
    }, [])
  );

  const stripHtml = (text?: string) => {
  if (!text) return "";
  return text.replace(/<[^>]+>/g, "").trim();
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* TRACKING CARD */}
        <Card>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.brandColor + "20" }]}>
            <FontAwesome5 name="truck" size={36} color={theme.colors.brandColor} />
          </View>

          <ThemedText type="cardHeader" style={{ fontSize: 18, textAlign: "center", marginBottom: 8 }}>
            Track Your Order
          </ThemedText>

          <ThemedText
            type="cardLabel"
            style={{ fontSize: 12, textAlign: "center", marginBottom: 16, color: theme.colors.textSecondary }}
          >
            Enter your Order ID below to see the current status and delivery timeline.
          </ThemedText>

          <View
            style={[
              styles.inputContainer,
              {
                borderColor: isFocused ? theme.colors.brandColor : "#613b3b33",
                backgroundColor: isFocused ? "#FFFFFF20" : "#FFFFFF1A",
              },
            ]}
          >
            <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
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
            disabled={!trackingNumber.trim()}
            style={{ opacity: !trackingNumber.trim() ? 0.6 : 1 }}
          >
            <Card>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.colors.brandColor,
                  paddingVertical: 12,
                  borderRadius: 10,
                }}
              >
                <ThemedText type="buttonText" style={{ color: "#fff", marginRight: 6 }} capital>
                  Track
                </ThemedText>
              </View>
            </Card>
          </TouchableOpacity>

          {isLoading && <ThemedText style={{ marginTop: 12, textAlign: "center" }}>Loading...</ThemedText>}

          {error && (
            <ThemedText
              style={{
                marginTop: 12,
                textAlign: "center",
                color: theme.colors.brandColor,
              }}
            >
              Order not found or cancelled
            </ThemedText>
          )}

          {orderData && !isLoading && !error && (
            <ThemedText
              style={{
                marginTop: 12,
                textAlign: "center",
                color: theme.colors.green,
              }}
            >
              {orderData.OrderStatus}
            </ThemedText>
          )}
        </Card>

        {/* ORDER DETAILS */}
        {orderData && !isLoading && !error && (
          <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
            {/* Header with Order ID and Flags */}
            <View style={[styles.orderHeader, { backgroundColor: theme.colors.brandColor }]}>
              <Text style={styles.orderIdText}>ORDER ID: {orderData.orderId}</Text>

              <View style={styles.flagsRow}>
                <View style={styles.flagContainer}>
                  <Image source={{ uri: orderData.senderCountry.flagUrl.png }} style={styles.flagImage} />
                  <Text style={styles.flagLabel}>{orderData.senderCountry.name}</Text>
                </View>

                <Ionicons
                  name="airplane-outline"
                  size={28}
                  color="white"
                  style={{ marginHorizontal: 20, alignSelf: "center" }}
                />

                <View style={styles.flagContainer}>
                  <Image source={{ uri: orderData.receiverCountry.flagUrl.png }} style={styles.flagImage} />
                  <Text style={styles.flagLabel}>{orderData.receiverCountry.name}</Text>
                </View>
              </View>
            </View>

            {/* Live Tracking Card */}
            <Card style={{ marginTop: 20 }}>
              <ThemedText
                type="cardHeader"
                style={{ fontSize: 18, color: theme.colors.brandColor, marginBottom: 12 }}
              >
                <FontAwesome5 name="truck" size={18} color={theme.colors.brandColor} /> Live Tracking
              </ThemedText>

              {[...orderData.orderProcess]
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((step) => (
                  <View key={step._id} style={styles.trackingStep}>
                    <View style={styles.leftStep}>
                      <FontAwesome5
                        name="check-circle"
                        size={20}
                        color={theme.colors.brandColor}
                        style={{ marginRight: 12 }}
                      />
                      <View>
                        <ThemedText style={styles.stepTitle}>{step.process}</ThemedText>
                        <ThemedText style={styles.stepDate}>{formatDate(step.createdAt)}</ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.stepDescription}>{step.description}</ThemedText>
                  </View>
                ))}
            </Card>

            {/* Notes For You */}
            {orderData.orderNotes.length > 0 && (
              <Card style={{ marginTop: 20, backgroundColor: "#fff0f0", borderColor: "#f7d6d6" }}>
                <ThemedText
                  type="cardHeader"
                  style={{ fontSize: 18, color: theme.colors.brandColor, marginBottom: 12 }}
                >
                  Notes For You
                </ThemedText>
                {orderData.orderNotes.map((note: OrderNote) => (
                  <View key={note._id} style={styles.noteContainer}>
                    <ThemedText style={styles.noteContent}>{stripHtml(note.content)}</ThemedText>
                    <ThemedText style={styles.noteDate}>{formatDate(note.createdAt)}</ThemedText>
                  </View>
                ))}
              </Card>
            )}
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
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
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  orderHeader: {
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  orderIdText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
  },
  flagsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagContainer: {
    alignItems: "center",
  },
  flagImage: {
    width: 48,
    height: 32,
    borderRadius: 4,
  },
  flagLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  trackingStep: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  leftStep: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.5,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  stepDate: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
  },
  stepDescription: {
    fontSize: 10,
    color: "#999",
    flex: 1,
    textAlign: "right",
  },
  noteContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f7d6d6",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  noteContent: {
    fontSize: 14,
    color: "#333",
  },
  noteDate: {
    fontSize: 11,
    color: "#999",
    textAlign: "right",
    marginTop: 6,
  },
  trackButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  themeOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  themeOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  themeOptionTextContainer: {
    flex: 1,
  },
  themeOptionText: {
    fontSize: 15,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  themeOptionDescription: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default TrackOrderScreen;
