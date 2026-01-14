import React from "react";
import { View, ScrollView, StyleSheet, ViewStyle } from "react-native";
import ThemedText from "@/components/themed/ThemedText";
import { useTheme } from "../../../theme/ThemeProvider";

interface HorizontalSectionProps<T> {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  cardStyle?: ViewStyle;
}

const HorizontalSection = <T,>({
  icon,
  title,
  subtitle,
  data,
  renderItem,
  containerStyle,
  contentContainerStyle,
  cardStyle,
}: HorizontalSectionProps<T>) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.sectionContainer, containerStyle]}>
      {/* Title & Icon */}
      <View style={{ marginHorizontal: 5, marginBottom: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
          {icon}
          <ThemedText style={[styles.sectionTitle, { marginLeft: 8, color: theme.colors.text }]}>
            {title}
          </ThemedText>
        </View>
        {subtitle && (
          <ThemedText style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </ThemedText>
        )}
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, contentContainerStyle]}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.dark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
              },
              cardStyle
            ]}
          >
            {renderItem(item, index)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginHorizontal: 12,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
  },
  scrollContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 5,
  },
  card: {
    width: 280,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    justifyContent: "flex-start",
    position: "relative",
    borderColor: "rgba(0,0,0,0.05)",
  },
});

export default HorizontalSection;
