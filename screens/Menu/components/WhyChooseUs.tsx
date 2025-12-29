import React from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import ThemedText from "@/components/themed/ThemedText";
import Card from "./Card";

const GlobalNetworkImage = require("../../../assets/app/global-network.png");

const WhyChooseUS = () => {
  const { theme } = useTheme();

  const renderPoint = (title: string, description: string) => (
    <View style={styles.point}>
      <View style={styles.pointRow}>
        <View style={[styles.bullet, { backgroundColor: theme.colors.brandColor }]} />
        <ThemedText style={[styles.subheading, { color: theme.colors.brandColor }]}>
          {title}
        </ThemedText>
      </View>
      <ThemedText style={[styles.text, { color: theme.colors.textSecondary, marginLeft: 18 }]}>
        {description}
      </ThemedText>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 20 }}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <Card>
        <Image source={GlobalNetworkImage} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.headingRow}>
          <ThemedText style={[styles.heading, { color: theme.colors.brandColor }]}>
            Connected Globally, Responsive Locally
          </ThemedText>
        </View>
        <ThemedText style={[styles.text, { color: theme.colors.text }]}>
          With distribution centers across six continents and partnerships with leading carriers, we provide seamless logistics solutions wherever your business takes you.
        </ThemedText>

        {renderPoint("Strategic Partnerships", "Collaborating with 500+ trusted logistics partners worldwide")}
        {renderPoint("Local Expertise", "Local teams understanding regional regulations and customs")}
        {renderPoint("Technology-Driven", "AI-powered optimization for faster and cheaper shipments")}
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
