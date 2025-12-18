import React, { useState, useCallback, memo, useEffect, useRef } from "react";
import {
  RefreshControl,
  StyleSheet,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  ScrollView,
  View,
  Animated,
  Easing,
} from "react-native";

interface CustomEmptyMessageProps {
  message?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageSource?: ImageSourcePropType;
  onRefresh?: () => Promise<void> | void;
  containerStyle?: StyleProp<ViewStyle>;
  messageStyle?: StyleProp<TextStyle>;
  isEmpty?: boolean;
  showRefresh?: boolean;
  refreshColors?: string[];
  fallbackMessages?: { empty: string; search: string };
}

const useCartBounce = () => {
  const bounceY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceY, {
          toValue: -5,
          duration: 600,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.timing(bounceY, {
          toValue: 0,
          duration: 600,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceY]);

  return bounceY;
};

const FallingItem: React.FC<{
  delay: number;
  icon: string;
  index: number;
  targetX: number;
}> = memo(({ delay, icon, index, targetX }) => {
  const translateY = useRef(new Animated.Value(-80)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(-80);
      translateX.setValue(0);
      opacity.setValue(0);
      scale.setValue(0.5);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          // Y movement with bounce at end
          Animated.timing(translateY, {
            toValue: 20,
            duration: 1200,
            easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
            useNativeDriver: true,
          }),
          // Arc motion
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: targetX * 0.6,
              duration: 600,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: targetX,
              duration: 600,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.delay(800),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => {
        setTimeout(animate, 3000);
      });
    };

    animate();
  }, [delay, translateY, translateX, opacity, scale, index, targetX]);

  return (
    <Animated.Text
      style={[
        styles.fallingItem,
        {
          transform: [{ translateY }, { translateX }, { scale }],
          opacity,
        },
      ]}
    >
      {icon}
    </Animated.Text>
  );
});

// Search Magnifier Animation
const SearchMagnifier: React.FC = memo(() => {
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.15,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [scale, rotate]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["-10deg", "10deg"],
  });

  return (
    <Animated.View
      style={[
        styles.magnifierContainer,
        {
          transform: [{ scale }, { rotate: rotation }],
        },
      ]}
    >
      <View style={styles.magnifierGlass} />
      <View style={styles.magnifierHandle} />
    </Animated.View>
  );
});

// Ripple Effect for Search
const SearchRipple: React.FC<{ delay: number }> = memo(({ delay }) => {
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animate = () => {
      scale.setValue(0.3);
      opacity.setValue(0.8);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 2,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animate());
    };

    animate();
  }, [scale, opacity, delay]);

  return (
    <Animated.View
      style={[
        styles.ripple,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
});

// Floating Dots Animation
const FloatingDot: React.FC<{ delay: number; direction: number }> = memo(
  ({ delay, direction }) => {
    const translateY = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.sequence([
              Animated.timing(translateY, {
                toValue: -25,
                duration: 1500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(translateY, {
                toValue: 0,
                duration: 1500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(translateX, {
                toValue: direction * 15,
                duration: 1500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(translateX, {
                toValue: 0,
                duration: 1500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 1,
                duration: 1500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0.4,
                duration: 1500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
          ]),
        ])
      ).start();
    }, [translateY, translateX, opacity, delay, direction]);

    return (
      <Animated.View
        style={[
          styles.floatingDot,
          {
            transform: [{ translateY }, { translateX }],
            opacity,
          },
        ]}
      />
    );
  }
);

const CustomEmptyMessage: React.FC<CustomEmptyMessageProps> = memo(
  ({
    message,
    imageWidth = 120,
    imageHeight = 120,
    isEmpty = true,
    imageSource,
    onRefresh,
    containerStyle,
    messageStyle,
    showRefresh = true,
    refreshColors = ["#dc1e3e"],
    fallbackMessages = {
      empty: "No items available",
      search: "No results found for your search",
    },
  }) => {
    const [refreshing, setRefreshing] = useState(false);
    const bounceY = useCartBounce();

    const handleRefresh = useCallback(async () => {
      if (!onRefresh || !showRefresh) return;

      setRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        // Error handled silently
      } finally {
        setRefreshing(false);
      }
    }, [onRefresh, showRefresh]);

    const displayMessage =
      message || (isEmpty ? fallbackMessages.empty : fallbackMessages.search);
    const displayImageSource =
      imageSource ||
      (isEmpty
        ? require("../../assets/empty.png")
        : require("../../assets/emptySearch.png"));

    const refreshControl =
      onRefresh && showRefresh ? (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={refreshColors}
          tintColor={refreshColors[0]}
        />
      ) : undefined;

    // Shopping items for cart animation
    const shoppingItems = [
      { icon: "🛒", targetX: -20 },
      { icon: "🛍️", targetX: -10 },
      { icon: "📦", targetX: 0 },
      { icon: "🎁", targetX: 10 },
      { icon: "👕", targetX: 20 },
      { icon: "👟", targetX: -15 },
      { icon: "💻", targetX: 15 },
      { icon: "📱", targetX: -5 },
      { icon: "📚", targetX: 5 },
      { icon: "🎧", targetX: -25 },
      { icon: "⌚", targetX: 25 },
      { icon: "👜", targetX: -30 },
    ];

    return (
      <ScrollView
        contentContainerStyle={[styles.container, containerStyle]}
        style={styles.scrollView}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        bounces={!!refreshControl}
      >
        <View style={styles.animationContainer}>
          {isEmpty && (
            <>
              <View style={styles.fallingItemsContainer}>
                {shoppingItems.map((item, index) => (
                  <FallingItem
                    key={index}
                    icon={item.icon}
                    delay={index * 400}
                    index={index}
                    targetX={item.targetX}
                  />
                ))}
              </View>

              <Animated.View
                style={[
                  styles.cartContainer,
                  { transform: [{ translateY: bounceY }] },
                ]}
              >
                <Image
                  style={[
                    styles.image,
                    { width: imageWidth, height: imageHeight },
                  ]}
                  source={displayImageSource}
                  resizeMode="contain"
                />
              </Animated.View>
            </>
          )}

          {!isEmpty && (
            <>
              <View style={styles.searchAnimationContainer}>
                <SearchRipple delay={0} />
                <SearchRipple delay={700} />
                <SearchRipple delay={1400} />
              </View>

              <View style={styles.floatingDotsContainer}>
                <FloatingDot delay={0} direction={1} />
                <FloatingDot delay={500} direction={-1} />
                <FloatingDot delay={1000} direction={1} />
              </View>

              <SearchMagnifier />

              <Image
                style={[
                  styles.image,
                  { width: imageWidth, height: imageHeight },
                ]}
                source={displayImageSource}
                resizeMode="contain"
                accessibilityLabel="No search results illustration"
              />
            </>
          )}
        </View>

        <Text
          style={[styles.message, messageStyle]}
          accessibilityLabel={displayMessage}
          testID="empty-message-text"
        >
          {displayMessage}
        </Text>
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
    paddingHorizontal: 20,
  },
  animationContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
  },
  fallingItemsContainer: {
    position: "absolute",
    top: -80,
    left: 0,
    right: 0,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  fallingItem: {
    position: "absolute",
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cartContainer: {
    position: "relative",
    zIndex: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  // Search Animation Styles
  searchAnimationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  ripple: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#dc1e3e",
    backgroundColor: "transparent",
  },
  magnifierContainer: {
    position: "absolute",
    width: 60,
    height: 60,
    zIndex: 3,
    top: 20,
    right: 30,
  },
  magnifierGlass: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 3,
    borderColor: "#dc1e3e",
    backgroundColor: "rgba(220, 30, 62, 0.1)",
  },
  magnifierHandle: {
    position: "absolute",
    width: 3,
    height: 25,
    backgroundColor: "#dc1e3e",
    bottom: -5,
    right: 5,
    transform: [{ rotate: "45deg" }],
    borderRadius: 2,
  },
  floatingDotsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  floatingDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#dc1e3e",
  },
  image: { opacity: 0.85, zIndex: 4 },
  message: {
    color: "#dc1e3e",
    fontFamily: "montserrat-medium",
    fontSize: 18,
    textAlign: "center",
    marginTop: -30,
  },
});

FallingItem.displayName = "FallingItem";
SearchMagnifier.displayName = "SearchMagnifier";
SearchRipple.displayName = "SearchRipple";
FloatingDot.displayName = "FloatingDot";
CustomEmptyMessage.displayName = "CustomEmptyMessage";

export default CustomEmptyMessage;
