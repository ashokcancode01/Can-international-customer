import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const CustomsClearance = () => {
  const { theme } = useTheme();

  const features = [
    "Complete documentation and compliance handling",
    "Expert support for import/export regulations",
    "Fast clearance to avoid shipment delays",
    "Duty and tax calculation assistance",
    "Reduced risk of customs violations",
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        {/* Image Card */}
        <View
          style={[
            styles.card,
            {
              width: screenWidth - 24,
              alignSelf: "center",
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border + "30",
              shadowOpacity: theme.dark ? 0 : 0.1,
              elevation: theme.dark ? 0 : 3,
            },
          ]}
        >
          <Image
            source={require("../../../../assets/app/customsclearance.png")}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel="Illustration of customs clearance service"
          />
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Seamless and compliant customs processing for smooth international shipping.
          </Text>
        </View>

        {/* Service Overview Card */}
        <View
          style={[
            styles.card,
            {
              width: screenWidth - 24,
              alignSelf: "center",
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border + "30",
              shadowOpacity: theme.dark ? 0 : 0.1,
              elevation: theme.dark ? 0 : 3,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Service Overview
          </Text>
          <Text style={[styles.sectionContent, { color: theme.colors.textSecondary }]}>
            Our Customs Clearance service simplifies the complexities of international trade by handling all documentation and compliance requirements on your behalf.
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
    </View>
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
    shadowRadius: 6,
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

export default CustomsClearance;
