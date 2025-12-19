import React, { useState } from "react";
import { View, ScrollView, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from "react-native";

interface DotIndicatorProps {
  children: React.ReactNode[];
  cardWidth: number;      
  activeColor: string;
  inactiveColor?: string;
}

const DotIndicator: React.FC<DotIndicatorProps> = ({ children, cardWidth, activeColor, inactiveColor = "#ccc" }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    setActiveIndex(index);
  };

  return (
    <View style={{ marginTop: 10 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {children.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { backgroundColor: index === activeIndex ? activeColor : inactiveColor }]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default DotIndicator;
