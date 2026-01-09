import React from "react";
import { StyleSheet, View, ScrollView, Platform } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import ThemedText from "@/components/themed/ThemedText";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type Provider = {
  name: string;
  icon: IconName;
};
const PROVIDERS: Provider[] = [
  { name: "Blue Star Express", icon: "truck-fast" },
  { name: "Curvex", icon: "cube-outline" },
  { name: "DHL Express", icon: "airplane" },
  { name: "DTDC", icon: "truck-outline" },
  { name: "Nepal Express", icon: "map-marker-path" },
  { name: "SF International", icon: "earth" },
  { name: "DPNEX Logistic", icon: "warehouse" },
];

const TrustedProvidersScreen: React.FC = () => {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Our Trusted Providers
        </ThemedText>
        <ThemedText
          style={[
            styles.headerSubtitle,
            { color: colors.textSecondary },
          ]}
        >
          We collaborate with reliable logistics partners to ensure fast, secure,
          and efficient delivery.
        </ThemedText>
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              shadowColor: colors.textSecondary,
            },
          ]}
        >
          <View style={styles.providersContainer}>
            {PROVIDERS.map((provider) => (
              <ThemedTouchableOpacity
                key={provider.name}
                style={[
                  styles.providerButton,
                  {
                    backgroundColor: theme.dark ? "#1E1E1E" : "#FFFFFF",
                    borderColor: theme.dark
                      ? "#333"
                      : colors.brandColor,
                    shadowColor: theme.dark
                      ? "#000"
                      : colors.brandColor,
                  },
                ]}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name={provider.icon}
                  size={24}
                  color={colors.brandColor}
                  style={styles.providerIcon}
                />
                <ThemedText
                  style={[
                    styles.providerLabel,
                    { color: theme.dark ? "#FFFFFF" : colors.text },
                  ]}
                  numberOfLines={1}
                >
                  {provider.name}
                </ThemedText>
              </ThemedTouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TrustedProvidersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    fontFamily: "Montserrat-SemiBold",
  },
  headerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.85,
    fontFamily: "Montserrat-Regular",
  },
  card: {
    padding: 16,
    borderRadius: 18,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      }
    })
  },
  providersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  providerButton: {
    width: "48%",
    height: 80,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  providerIcon: {
    marginBottom: 6,
  },
  providerLabel: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "Montserrat-SemiBold",
  },
});
