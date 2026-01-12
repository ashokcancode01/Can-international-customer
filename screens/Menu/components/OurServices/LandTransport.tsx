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

const LandTransport = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const features = [
    "Wide range of vehicle and load options",
    "Domestic and cross-border transport",
    "Real-time tracking and route optimization",
    "Safe and secure cargo handling",
    "Flexible pickup and delivery schedules",
  ];

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
            tintColor={theme.colors.brandColor}
          />
        }
      >
        {/* Image */}
        <Card>
          <View style={styles.imageWrapper}></View>

          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Efficient domestic and cross-border road transport for all types of
            goods.
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
            Our Land Transport service ensures smooth movement of cargo through
            a well-managed fleet and strategic route planning. Whether for
            domestic distribution or cross-border deliveries, we provide
            reliable trucking solutions.
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

export default LandTransport;
