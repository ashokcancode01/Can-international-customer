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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Our Trusted Providers
        </ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          We collaborate with reliable logistics providers to ensure fast and secure delivery.
        </ThemedText>
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Providers Card */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.textSecondary }]}>
          <View style={styles.providersContainer}>
            {TRUSTED_PROVIDERS.map((provider, index) => (
              <ThemedTouchableOpacity
                key={index}
                style={[
                  styles.providerButton,
                  {
                    backgroundColor: theme.dark ? "#1E1E1E" : "#fff",
                    borderColor: theme.dark ? "#333" : colors.brandColor,
                    shadowColor: theme.dark ? "#000" : colors.brandColor,
                  },
                ]}
                activeOpacity={0.8}
              >
                <ThemedText
                  style={[
                    styles.providerLabel,
                    { color: theme.dark ? "#fff" : colors.text },
                  ]}
                >
                  {provider}
                </ThemedText>
              </ThemedTouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },

  sectionHeader: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "Montserrat-SemiBold",
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    opacity: 0.8,
    fontFamily: "Montserrat-Regular",
  },

  card: {
    padding: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  providersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  providerButton: {
    width: "48%",
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  providerLabel: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Montserrat-SemiBold",
  },
});

export default TrustedProvidersScreen;
