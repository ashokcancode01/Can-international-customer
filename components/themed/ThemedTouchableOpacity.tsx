import React, { useMemo } from "react";
import {
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  Easing,
} from "react-native";
import { useTheme, type Theme } from "@/theme/ThemeProvider";

export type ThemedTouchableOpacityProps = TouchableOpacityProps & {
  backgroundColor?: keyof Theme["colors"] | string;
  activeOpacity?: number;
  animated?: boolean;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  margin?: number;
  borderRadius?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  padding?: number;
};

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const ThemedTouchableOpacity: React.FC<ThemedTouchableOpacityProps> = ({
  style,
  backgroundColor = "cardBackground",
  activeOpacity = 0.7,
  onPress,
  animated = true,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginHorizontal,
  marginVertical,
  borderRadius,
  paddingHorizontal,
  paddingVertical,
  padding,
  margin,
  children,
  ...otherProps
}) => {
  const { theme } = useTheme();
  const scaleAnim = useMemo(() => new Animated.Value(1), []);

  const bgColor =
    theme.colors[backgroundColor as keyof Theme["colors"]] || backgroundColor;

  const handlePressIn = () => {
    if (!animated) return;
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  };

  const handlePressOut = () => {
    if (!animated) return;
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  };

  const touchableStyles = useMemo(
    () => [
      animated && { transform: [{ scale: scaleAnim }] },
      { backgroundColor: bgColor },
      {
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        marginHorizontal,
        marginVertical,
        margin,
        borderRadius,
        paddingHorizontal,
        paddingVertical,
        padding,
      },
      style,
    ],
    [
      animated,
      scaleAnim,
      bgColor,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginHorizontal,
      marginVertical,
      margin,
      borderRadius,
      paddingHorizontal,
      paddingVertical,
      padding,
      style,
    ]
  );

  return (
    <AnimatedTouchableOpacity
      style={touchableStyles}
      activeOpacity={activeOpacity}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...otherProps}
    >
      {children}
    </AnimatedTouchableOpacity>
  );
};

export default ThemedTouchableOpacity;
