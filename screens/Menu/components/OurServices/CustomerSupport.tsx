import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

const CustomerSupport = () => {
  const { theme } = useTheme();

  const features = [
    "Live chat, phone, and email support",
    "Dedicated account managers",
    "Quick resolution of issues",
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Image
          source={require("../../../../assets/app/customersupport.png")}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel="Illustration of 24/7 customer support service"
        />
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Get round-the-clock assistance for all your logistics needs.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Service Overview
        </Text>
        <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
          Our Customer Support team is available 24/7 to resolve issues, answer queries, and provide guidance on shipments and logistics operations.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.colors.brandColor, marginTop: 16 }]}>
          Key Features
        </Text>
        {features.map((feature, idx) => (
          <View style={styles.featureItem} key={idx}>
            <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.brandColor} />
            <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Montserrat",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Medium",
    fontWeight: "700",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: "Montserrat",
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: "Montserrat",
    lineHeight: 20,
    flex: 1,
  },
});

export default CustomerSupport;
