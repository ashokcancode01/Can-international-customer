import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import Card from "../Card";

const AirFreight = () => {
  const { theme } = useTheme();

  const features = [
    "Fast delivery for urgent shipments",
    "Global network with major airlines",
    "Secure handling for sensitive goods",
    "Flexible delivery options",
    "Custom documentation assistance",
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {/* Image */}
        <Card>
          <Image
            source={require("../../../../assets/app/airfreight.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Fast and reliable air cargo solutions for time-sensitive international shipments.
          </Text>
        </Card>

        {/* Service Overview */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Service Overview
          </Text>
          <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
            Our Air Freight service provides rapid and secure transportation for your high-priority goods across global destinations. With partnerships across major airlines, optimized routes, and advanced handling processes, we ensure your cargo arrives safely and on schedule.
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

export default AirFreight;
