import React from "react";
import { View, ScrollView, StyleSheet, ViewStyle } from "react-native";
import ThemedText from "@/components/themed/ThemedText";

interface HorizontalSectionProps<T> {
  icon: React.ReactNode;              
  title: string;                       
  subtitle?: string;                
  data: T[];                            
  renderItem: (item: T, index: number) => React.ReactNode; 
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

const HorizontalSection = <T,>({
  icon,
  title,
  subtitle,
  data,
  renderItem,
  containerStyle,
  contentContainerStyle,
}: HorizontalSectionProps<T>) => {
  return (
    <View style={[styles.sectionContainer, containerStyle]}>
      {/* Title & Icon */}
      <View style={{ marginHorizontal: 5, marginBottom: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
          {icon}
          <ThemedText style={[styles.sectionTitle, { marginLeft: 8 }]}>
            {title}
          </ThemedText>
        </View>
        {subtitle && (
          <ThemedText style={styles.sectionSubtitle}>
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
          <View key={index} style={{ marginRight: 12 }}>
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
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#888",
  },
  scrollContainer: {
    paddingLeft: 12,
    paddingRight: 12,
  },
});

export default HorizontalSection;
