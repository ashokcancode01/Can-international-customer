import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import ThemedText from "@/components/themed/ThemedText";
import ThemedView from "@/components/themed/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


const { width } = Dimensions.get("window");

const DashboardHeader = () => {
  const { theme } = useTheme();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ThemedView style={{ flex: 1, backgroundColor: theme.colors.background }}>


          <View style={[styles.headerContainer, { backgroundColor: theme.colors.background }]}>
            <View style={styles.headerRow}>
              <View style={styles.profileContainer}>
                <Ionicons name="person-circle-outline" size={48} color={theme.colors.brandColor} />
                <View style={styles.textContainer}>
                  <ThemedText style={[styles.greetingText, { color: theme.colors.textSecondary }]}>
                    Good Morning,
                  </ThemedText>
                  <ThemedText style={[styles.nameText, { color: theme.colors.text }]}>
                    Alex
                  </ThemedText>
                </View>
              </View>
              <Ionicons name="notifications-circle" size={36} color={theme.colors.brandColor} />
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >

            <View style={[styles.trackingCard, { backgroundColor: theme.colors.card, marginHorizontal: 20 }]}>
              <Text style={[styles.trackingTitle, { color: theme.colors.text }]}>Track your package</Text>
              <Text style={[styles.trackingSubtitle, { color: theme.colors.brandColor + "CC" }]}>
                Enter receipt number to track globally
              </Text>

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
                  placeholder="Enter Tracking Number..."
                  placeholderTextColor="#888"
                  value={trackingNumber}
                  onChangeText={setTrackingNumber}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <TouchableOpacity>
                  <Ionicons name="qr-code-outline" size={20} color="#888" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.trackButton, { backgroundColor: theme.colors.brandColor }]}
              >
                <Text style={styles.trackButtonText}>Track Shipment</Text>
                <Ionicons name="arrow-forward-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.quickActionsContainer}>
              {[
                { icon: "truck", label: "Fast & Reliable" },
                { icon: "globe", label: "Worldwide Delivery" },
                { icon: "bag", label: "Business Friendly" },
              ].map((action, index) => (
                <View key={index} style={styles.actionCard}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.card }]}>
                    <FontAwesome5 name={action.icon} size={28} color={theme.colors.brandColor} />
                  </TouchableOpacity>
                  <Text style={[styles.actionLabel, { color: theme.colors.textSecondary }]}>{action.label}</Text>
                </View>
              ))}
            </View>

          </ScrollView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    fontWeight: "700",
  },
  nameText: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    fontWeight: "600",
  },
  trackingCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  trackingTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
    marginBottom: 5,
  },
  trackingSubtitle: {
    fontSize: 13,
    fontFamily: "Montserrat-Medium",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  trackButton: {
    flexDirection: "row",
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  trackButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 20,
  },

  actionCard: {
    width: (width - 80) / 3,
    alignItems: "center",
    backgroundColor: "#FFFFFF10",
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  actionLabel: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
  },

});

export default DashboardHeader;
