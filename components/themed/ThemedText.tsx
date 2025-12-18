import React from "react";
import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export type ThemedTextType =
  | "auth"
  | "authSub"
  | "authButton"
  | "buttonText"
  | "error"
  | "label"
  | "default"
  | "cardHeader"
  | "cardLabel"
  | "cardData"
  | "linkv1";

export interface ThemedTextProps extends TextProps {
  type?: ThemedTextType;
  isDefaultText?: boolean;
  capital?: boolean;
  style?: StyleProp<TextStyle>;
  color?: string;
  dataColor?: string;
  textDecorationLine?:
    | "none"
    | "underline"
    | "line-through"
    | "underline line-through";
}

export default function ThemedText({
  type = "default",
  isDefaultText = false,
  capital = false,
  style,
  color,
  dataColor,
  textDecorationLine,
  children,
  ...rest
}: ThemedTextProps) {
  const { theme } = useTheme();

  const variants: Record<ThemedTextType, TextStyle> = {
    auth: {
      textAlign: "center",
      fontSize: theme.fontSizes.xl,
      fontFamily: theme.fonts.regular,
      color: theme.colors?.text,
    },
    authSub: {
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
    },
    authButton: {
      textDecorationLine: "underline",
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.brandColor,
    },
    buttonText: {
      color: "white",
      fontFamily: theme.fonts.bold,
      fontSize: theme.fontSizes.md,
    },
    error: {
      fontSize: theme.fontSizes.xs1,
      fontFamily: theme.fonts.regular,
      color: theme.colors?.error,
      marginTop: 5,
      marginLeft: 30,
    },
    label: {
      marginBottom: 5,
      fontSize: theme.fontSizes.sm1,
      fontFamily: theme.fonts.regular,
    },
    default: {
      fontSize: theme.fontSizes.sm1,
      fontFamily: theme.fonts.regular,
      color: theme.colors?.text,
    },
    cardHeader: {
      marginBottom: 5,
      fontSize: theme.fontSizes.sm1,
      fontFamily: theme.fonts.bold,
      color: theme.colors?.text,
    },
    cardLabel: {
      fontSize: theme.fontSizes.xs,
      fontFamily: theme.fonts.regular,
      color: theme.colors?.textSecondary,
    },
    cardData: {
      fontFamily: theme.fonts.regular,
      color: theme.colors?.text,
    },
    linkv1: {
      fontFamily: theme.fonts.regular,
      color: theme.colors.brandColor,
      textDecorationLine: "underline",
    },
  };

  const variantKey: ThemedTextType = isDefaultText ? "default" : type;
  const baseStyle = variants[variantKey] ?? variants.default;

  const getFinalColor = () => {
    if (color) return color;
    if (dataColor) return dataColor;
    return baseStyle.color;
  };

  const finalStyle: TextStyle = {
    ...baseStyle,
    color: getFinalColor(),
    ...(textDecorationLine && { textDecorationLine }),
  };

  const displayContent =
    typeof children === "object" && children !== null && "orderId" in children
      ? capital
        ? String(children.orderId).toUpperCase()
        : String(children.orderId)
      : capital && typeof children === "string"
      ? children.toUpperCase()
      : children;

  return (
    <Text style={[finalStyle, style]} {...rest}>
      {displayContent}
    </Text>
  );
}
