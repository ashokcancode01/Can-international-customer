import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, View, Image, RefreshControl } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedView } from "@/components/themed/ThemedView";
import ThemedText from "@/components/themed/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "./Card";
import LoadingIndicator from "@/components/LoadingIndicator";

const AboutUsImage1 = require("../../../assets/app/AboutUs.png");
const AboutUsImage2 = require("../../../assets/app/AboutUs1.png");

const AboutUs = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading 
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  //Refresh Handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);


  const renderPoint = (title: string, description: string) => (
    <View style={styles.point}>
      <View style={styles.pointRow}>
        <View style={[styles.bullet, { backgroundColor: theme.colors.brandColor }]} />
        <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>{title}</ThemedText>
      </View>
      <ThemedText style={[styles.text, { color: theme.colors.textSecondary, marginLeft: 18 }]}>{description}</ThemedText>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.fullScreenLoader, { backgroundColor: theme.colors.background }]}>
        <LoadingIndicator size={60} color={theme.colors.brandColor} />
      </View>
    );
  }

  return (
    <ThemedView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.brandColor}
          />
        }
      >
        {/* Company Overview */}
        <Card>
          <Image source={AboutUsImage1} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.headingRow}>
            <MaterialIcons name="business" size={22} color={theme.colors.brandColor} />
            <ThemedText style={[styles.heading, { color: theme.colors.brandColor }]}>
              Company Overview
            </ThemedText>
          </View>
          <ThemedText style={[styles.text, { color: theme.colors.text }]}>
            Can International is a global logistics and shipping company dedicated to making international trade seamless, secure, and accessible.
          </ThemedText>
          {renderPoint("Global Presence", "Serving clients across 150+ countries with extensive logistics capabilities.")}
          {renderPoint("Reliable Operations", "Built on transparency, technology, and trusted international partnerships.")}
        </Card>

        {/* Our Mission */}
        <Card>
          <Image source={AboutUsImage2} style={styles.cardImage} resizeMode="cover" />
          <View style={styles.headingRow}>
            <MaterialIcons name="emoji-objects" size={22} color={theme.colors.brandColor} />
            <ThemedText style={[styles.heading, { color: theme.colors.brandColor }]}>
              Our Mission
            </ThemedText>
          </View>
          <ThemedText style={[styles.text, { color: theme.colors.text }]}>
            We revolutionize international logistics by combining cutting-edge technology with human expertise. Our mission is to make global shipping accessible, affordable, and reliable for businesses of all sizes.
          </ThemedText>
          {renderPoint("Real-time Tracking", "Complete visibility into every shipment across 150+ countries.")}
          {renderPoint("24/7 Support", "Multilingual support team ready to assist anytime.")}
          {renderPoint("Competitive Rates", "Best rates negotiated directly with carriers worldwide.")}
        </Card>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 20,
  },
  cardImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  heading: {
    fontSize: 15,
    fontWeight: "600",
  },
  subheading: {
    fontSize: 14,
    fontWeight: "500",
  },
  text: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 20,
    marginBottom: 10,
  },
  point: {
    marginTop: 12,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AboutUs;
