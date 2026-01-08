import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
  const progressAnim = useRef(new Animated.Value(0)).current;
  const planeFloat = useRef(new Animated.Value(0)).current;
  const planeTilt = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        // Progress bar animation
        Animated.timing(progressAnim, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),

        // Plane vertical floating
        Animated.sequence([
          Animated.timing(planeFloat, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(planeFloat, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),

        // Plane gentle tilt
        Animated.sequence([
          Animated.timing(planeTilt, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(planeTilt, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [duration, progressAnim, planeFloat, planeTilt]);

  const translateX = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size - dotSize],
  });

  const floatY = planeFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const rotate = planeTilt.interpolate({
    inputRange: [0, 1],
    outputRange: ["-6deg", "6deg"],
  });

  return (
    <View style={styles.container}>
      {/* Animated Plane */}
      <Animated.View
        style={[
          styles.planeWrapper,
          {
            transform: [{ translateY: floatY }, { rotate }],
          },
        ]}
      >
        <MaterialCommunityIcons
          name="airplane-takeoff"
          size={iconSize}
          color={color}
        />
      </Animated.View>

      {/* Progress bar */}
      <View style={[styles.progressBar, { width: size, height: dotSize }]}>
        <View style={[styles.barBackground, { height: dotSize / 3 }]} />

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
    height: 120,
  },
  planeWrapper: {
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
