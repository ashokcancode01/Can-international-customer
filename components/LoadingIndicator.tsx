import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface PlaneLoaderProps {
  size?: number;       
  dotSize?: number;     
  duration?: number;    
  color?: string;       
  iconSize?: number;   
}

const PlaneLoader: React.FC<PlaneLoaderProps> = ({
  size = 200,
  dotSize = 12,
  duration = 2000,
  color = "#007AFF",
  iconSize = 40,
}) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, [animation, duration]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size - dotSize],
  });

  return (
    <View style={styles.container}>
      {/* plane icon */}
      <MaterialCommunityIcons
        name="airplane-takeoff"
        size={iconSize}
        color={color}
        style={styles.plane}
      />

      {/* Progress bar container */}
      <View style={[styles.progressBar, { width: size, height: dotSize }]}>
        {/* Background bar */}
        <View style={[styles.barBackground, { height: dotSize / 3 }]} />

        {/* Animated moving dot */}
        <Animated.View
          style={[
            styles.dot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: color,
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    position: "relative",
  },
  plane: {
    marginBottom: 15,
  },
  progressBar: {
    position: "relative",
    justifyContent: "center",
  },
  barBackground: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: 10,
    top: "50%",
    transform: [{ translateY: -0.5 }],
  },
  dot: {
    position: "absolute",
    top: 0,
  },
});

export default PlaneLoader;
