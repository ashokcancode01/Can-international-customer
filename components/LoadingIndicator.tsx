import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";

interface LoadingIndicatorProps {
  size?: number;       
  duration?: number;   
  dotCount?: number;  
  color?: string;      
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 80,
  duration = 4000,
  dotCount = 15,
  color = "#000",
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation, duration]);

  const radius = size / 2 - 10;

  const dots = [];
  for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * 2 * Math.PI;
    const x = radius + radius * Math.cos(angle) - 4; 
    const y = radius + radius * Math.sin(angle) - 4;
    dots.push(
      <View
        key={i}
        style={{
          position: "absolute" as const,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
          top: y,
          left: x,
          opacity: 1 - i / dotCount, 
        }}
      />
    );
  }

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], 
  });

  return (
    <View style={styles.screenCenter}>
      <Animated.View
        style={{
          width: size,
          height: size,
          transform: [{ rotate: rotateInterpolate }],
        }}
      >
        {dots}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingIndicator;
