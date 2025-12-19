import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import ThemedText from "@/components/themed/ThemedText";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";

const TRUSTED_PROVIDERS = [
  "Blue Star Express",
  "Curvex",
  "DHL Express",
  "DTDC",
  "Nepal Express",
  "SF International",
  "DPNEX Logistic",
];

const TrustedProvidersScreen = () => {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Our Trusted Providers
        </ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          We collaborate with reliable logistics providers to ensure fast and secure delivery.
        </ThemedText>
      </View>

      {/* Providers Card */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.providersContainer}>
          {TRUSTED_PROVIDERS.map((provider, index) => (
            <ThemedTouchableOpacity
              key={index}
              style={[
                styles.providerButton,
                {
                  backgroundColor: theme.dark ? "#000" : "#fff", // black in dark mode
                  borderColor: theme.dark ? "#000" : colors.brandColor,
                  shadowColor: theme.dark ? "#000" : colors.brandColor,
                },
              ]}
              activeOpacity={0.8}
            >
              <ThemedText
                style={[
                  styles.providerLabel,
                  { color: theme.dark ? "#fff" : colors.text }, // white text in dark mode
                ]}
              >
                {provider}
              </ThemedText>
            </ThemedTouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 12,
  },

  sectionHeader: {
    marginBottom: 10,
    marginHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    opacity: 0.8,
  },

  card: {
    padding: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  providersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  providerButton: {
    width: "48%",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  providerLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default TrustedProvidersScreen;
