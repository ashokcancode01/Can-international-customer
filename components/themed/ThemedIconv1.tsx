import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme, type Theme } from "@/theme/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";

export type ThemedIconv1Props = {
  as?: React.ElementType;
  size?: number;
  style?: ViewStyle;
  color?: keyof Theme["colors"] | string;
  backgroundColor?: keyof Theme["colors"] | string;
  useDefaultIconColor?: boolean;
  type?: keyof typeof iconSizes;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  margin?: number;
  onPress?: () => void;
  containerSize?: number;
  borderRadius?: number;
  [key: string]: any;
};

const iconSizes = {
  tiny: 8,
  xtiny: 9,
  xxtiny: 10,
  small: 11,
  xsmall: 12,
  xxsmall: 13,
  medium: 14,
  xmedium: 15,
  xxmedium: 16,
  default: 16,
  large: 20,
  xlarge: 24,
};

export const ThemedIconv1: React.FC<ThemedIconv1Props> = ({
  as: IconComponent = MaterialIcons,
  size,
  style,
  color = "text",
  backgroundColor,
  useDefaultIconColor = false,
  type = "default",
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginHorizontal,
  marginVertical,
  margin,
  onPress,
  containerSize,
  borderRadius = 5,
  ...rest
}) => {
  const { theme } = useTheme();
  const iconSize = size || iconSizes[type];
  const computedContainerSize = containerSize || iconSize + 12;

  // FIXED: Better color computation logic
  let computedIconColor: string;

  if (useDefaultIconColor) {
    // Only use primary when explicitly requested
    computedIconColor = theme.colors.brandColor;
  } else if (typeof color === "string" && color.startsWith("#")) {
    // Direct hex color - use as is
    computedIconColor = color;
  } else if (
    typeof color === "string" &&
    theme.colors[color as keyof Theme["colors"]]
  ) {
    // Theme color key exists
    computedIconColor = theme.colors[color as keyof Theme["colors"]];
  } else {
    // Fallback: use the color as-is (could be any valid color string)
    computedIconColor = color as string;
  }

  // FIXED: Better background color computation
  let computedBackgroundColor: string | undefined;

  if (backgroundColor) {
    if (
      typeof backgroundColor === "string" &&
      backgroundColor.startsWith("#")
    ) {
      // Direct hex color
      computedBackgroundColor = backgroundColor;
    } else if (theme.colors[backgroundColor as keyof Theme["colors"]]) {
      // Theme color key
      computedBackgroundColor =
        theme.colors[backgroundColor as keyof Theme["colors"]];
    } else {
      // Use as-is
      computedBackgroundColor = backgroundColor as string;
    }
  }

  const containerStyle = [
    style,
    {
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginHorizontal,
      marginVertical,
      margin,
    },
  ];

  const iconContainerStyle = {
    width: computedContainerSize,
    height: computedContainerSize,
    borderRadius,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: computedBackgroundColor,
  };

  const IconContent = (
    <View style={iconContainerStyle}>
      <IconComponent size={iconSize} color={computedIconColor} {...rest} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={containerStyle}>
        {IconContent}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{IconContent}</View>;
};

export default ThemedIconv1;
