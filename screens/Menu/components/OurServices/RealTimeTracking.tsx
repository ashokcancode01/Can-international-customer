import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import Card from "../Card";

const RealTimeTracking = () => {
  const { theme } = useTheme();

  const features = [
    "Real-time updates and monitoring",
    "Customizable reporting tools",
    "24/7 customer support",
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {/* Image */}
        <Card>
          <View style={styles.imageWrapper}>
            <Image
              source={require("../../../../assets/app/realtimetracking.png")}
              style={styles.image}
              resizeMode="contain"
              accessibilityLabel="Illustration of real-time tracking service"
            />
          </View>

          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Monitor your shipments in real time with our advanced tracking technology.
          </Text>
        </Card>

        {/* Service Overview */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Service Overview
          </Text>
          <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
            Our Real-Time Tracking system uses GPS and IoT sensors to provide live
            updates on your shipment, including alerts for delays or route deviations.
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
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
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

export default RealTimeTracking;
