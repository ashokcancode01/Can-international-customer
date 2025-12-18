import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { useTheme, type Theme } from "@/theme/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";

export type ThemedIconProps = {
  as?: React.ElementType;
  size?: number;
  style?: ViewStyle;
  color?: keyof Theme["colors"] | string;
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
};

export const ThemedIcon: React.FC<ThemedIconProps> = ({
  as: IconComponent = MaterialIcons,
  size,
  style,
  color = "text",
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
  ...rest
}) => {
  const { theme } = useTheme();

  const computedColor =
    useDefaultIconColor || !color
      ? theme.colors.brandColor
      : theme.colors[color as keyof Theme["colors"]] || color;

  const iconSize = size || iconSizes[type];

  const iconStyle = [
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

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <IconComponent
        size={iconSize}
        color={computedColor}
        style={iconStyle}
        {...rest}
      />
    </TouchableOpacity>
  );
};

export default ThemedIcon;
