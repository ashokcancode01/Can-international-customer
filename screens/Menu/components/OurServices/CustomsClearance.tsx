import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import Card from "../Card";
import LoadingIndicator from "@/components/LoadingIndicator";

const CustomsClearance = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const features = [
    "Complete documentation and compliance handling",
    "Expert support for import/export regulations",
    "Fast clearance to avoid shipment delays",
    "Duty and tax calculation assistance",
    "Reduced risk of customs violations",
  ];

  //Image
  const customsClearanceImage = require("@/assets/app/custom_clearance.png");

  //Refresh Handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.fullScreenLoader,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <LoadingIndicator size={60} color={theme.colors.brandColor} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={{ paddingVertical: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.text}
            colors={[theme.colors.text || "#fff"]}
            style={{ backgroundColor: theme.colors.background, }}
          />}
      >
        {/* Image */}
        <Card>
          <Image
            source={customsClearanceImage}
            style={styles.image}
          />
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Seamless and compliant customs processing for smooth international
            shipping.
          </Text>
        </Card>

        {/* Service Overview */}
        <Card>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Service Overview
          </Text>
          <Text
            style={[
              styles.sectionContent,
              { color: theme.colors.textSecondary },
            ]}
          >
            Our Customs Clearance service simplifies the complexities of
            international trade by handling all documentation and compliance
            requirements on your behalf.
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.brandColor, marginTop: 16 },
            ]}
          >
            Key Features
          </Text>
          {features.map((feature, idx) => (
            <View style={styles.featureItem} key={idx}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={theme.colors.brandColor}
              />
              <Text
                style={[
                  styles.featureText,
                  { color: theme.colors.textSecondary },
                ]}
              >
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
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: "center",
    resizeMode: "contain"
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
