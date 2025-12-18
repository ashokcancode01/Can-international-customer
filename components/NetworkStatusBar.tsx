import React, { useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const NetworkStatusBar: React.FC = () => {
  const insets = useSafeAreaInsets();

  // Animation refs
  const slideAnim = useRef(new Animated.Value(-120)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide down animation
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Pulsing glow effect
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    // Icon pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    // Wave animation for background
    const waveAnimation = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    );

    // Floating dots animation
    const dotsAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(dotsAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );

    // Shimmer effect
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      })
    );

    glowAnimation.start();
    pulseAnimation.start();
    waveAnimation.start();
    dotsAnimation.start();
    shimmerAnimation.start();

    return () => {
      glowAnimation.stop();
      pulseAnimation.stop();
      waveAnimation.stop();
      dotsAnimation.stop();
      shimmerAnimation.stop();
    };
  }, []);

  const topPosition = useMemo(() => {
    const statusBarHeight =
      Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0;
    return statusBarHeight + (Platform.OS === "ios" ? insets.top : 0);
  }, [insets.top]);

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        top: topPosition,
        transform: [{ translateY: slideAnim }],
      },
    ],
    [topPosition, slideAnim]
  );

  const glowStyle = useMemo(
    () => ({
      opacity: glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
      }),
    }),
    [glowAnim]
  );

  const waveStyle = useMemo(
    () => ({
      transform: [
        {
          translateX: waveAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
          }),
        },
      ],
    }),
    [waveAnim]
  );

  const shimmerStyle = useMemo(
    () => ({
      opacity: shimmerAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0],
      }),
      transform: [
        {
          translateX: shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, SCREEN_WIDTH + 100],
          }),
        },
      ],
    }),
    [shimmerAnim]
  );

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={[styles.waveBackground, waveStyle]} />

      <Animated.View style={[styles.glowOverlay, glowStyle]} />

      <Animated.View style={[styles.shimmer, shimmerStyle]} />

      <View style={styles.glassBackground} />

      <View style={styles.mainContent}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.iconGlow} />
          <MaterialIcons name="signal-wifi-off" size={24} color="#FF6B6B" />
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.mainText}>No Internet Connection</Text>
          <Text style={styles.subText}>
            {" "}
            Check your connection and try again ...
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["20%", "80%"],
              }),
            },
          ]}
        />
      </View>

      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: `${15 + index * 12}%`,
                transform: [
                  {
                    translateY: dotsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -5 - index * 2],
                    }),
                  },
                  {
                    scale: dotsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
                opacity: dotsAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 1, 0.3],
                }),
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.cornerAccentLeft} />
      <View style={styles.cornerAccentRight} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    zIndex: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    overflow: "hidden",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  waveBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1a252f",
    opacity: 0.9,
  },
  glowOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FF6B6B",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: -100,
    width: 100,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: [{ skewX: "-20deg" }],
  },
  glassBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(44, 62, 80, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },

  iconContainer: {
    position: "relative",
    padding: 8,
  },
  iconGlow: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    opacity: 0.2,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    alignItems: "flex-start",
  },
  mainText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  subText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 11,
    fontWeight: "500",
  },

  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF6B6B",
    borderRadius: 1,
  },
  particlesContainer: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    height: 8,
  },
  particle: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  cornerAccentLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 30,
    height: 2,
    backgroundColor: "#FF6B6B",
  },
  cornerAccentRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 2,
    backgroundColor: "#4ECDC4",
  },
});
