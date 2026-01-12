import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  RefreshControl,
} from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import ThemedText from "@/components/themed/ThemedText";
import Card from "./Card";
import LoadingIndicator from "@/components/LoadingIndicator";

const WhyChooseUS = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const renderPoint = (title: string, description: string) => (
    <View style={styles.point}>
      <View style={styles.pointRow}>
        <View
          style={[styles.bullet, { backgroundColor: theme.colors.brandColor }]}
        />
        <ThemedText
          style={[styles.subheading, { color: theme.colors.brandColor }]}
        >
          {title}
        </ThemedText>
      </View>
      <ThemedText
        style={[
          styles.text,
          { color: theme.colors.textSecondary, marginLeft: 18 },
        ]}
      >
        {description}
      </ThemedText>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 20 }}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.brandColor}
        />
      }
    >
      <Card>
        <View style={styles.headingRow}>
          <ThemedText
            style={[styles.heading, { color: theme.colors.brandColor }]}
          >
            Connected Globally, Responsive Locally
          </ThemedText>
        </View>
        <ThemedText style={[styles.text, { color: theme.colors.text }]}>
          With distribution centers across six continents and partnerships with
          leading carriers, we provide seamless logistics solutions wherever
          your business takes you.
        </ThemedText>

        {renderPoint(
          "Strategic Partnerships",
          "Collaborating with 500+ trusted logistics partners worldwide"
        )}
        {renderPoint(
          "Local Expertise",
          "Local teams understanding regional regulations and customs"
        )}
        {renderPoint(
          "Technology-Driven",
          "AI-powered optimization for faster and cheaper shipments"
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});

export default WhyChooseUS;
