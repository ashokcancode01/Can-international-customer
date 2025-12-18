//Optimized
import React, { forwardRef, useMemo } from "react";
import { View, ViewProps, Platform } from "react-native";
import { useTheme, type Theme } from "@/theme/ThemeProvider";

export type SpacingValue = boolean | number | "xs" | "sm" | "md" | "lg" | "xl";

export type ThemedCardProps = ViewProps & {
  isCard?: boolean;

  backgroundColor?: keyof Theme["colors"] | string;

  borderColor?: keyof Theme["colors"] | string;
  borderWidth?: number;
  radius?: boolean | number;
  shadow?: boolean | "sm" | "md" | "lg" | "xl";

  padding?: SpacingValue;
  paddingHorizontal?: SpacingValue;
  paddingVertical?: SpacingValue;
  paddingTop?: SpacingValue;
  paddingRight?: SpacingValue;
  paddingBottom?: SpacingValue;
  paddingLeft?: SpacingValue;

  margin?: SpacingValue;
  marginHorizontal?: SpacingValue;
  marginVertical?: SpacingValue;
  marginTop?: SpacingValue;
  marginRight?: SpacingValue;
  marginBottom?: SpacingValue;
  marginLeft?: SpacingValue;

  flex?: number;
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
};

export const ThemedCard = forwardRef<
  React.ElementRef<typeof View>,
  ThemedCardProps
>(function ThemedCard(
  {
    style,
    isCard = true,
    backgroundColor,
    borderColor,
    borderWidth,
    radius,
    shadow,

    padding,
    paddingHorizontal,
    paddingVertical,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,

    margin,
    marginHorizontal,
    marginVertical,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,

    flex,
    flexDirection,
    justifyContent,
    alignItems,

    ...otherProps
  },
  ref
) {
  const { theme } = useTheme();

  const getSpacing = (value?: SpacingValue): number | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === "number") return value;
    if (value === false) return 0;
    if (value === true) return 10;

    const spacingMap = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
    return spacingMap[value];
  };

  const getRadius = (value?: boolean | number): number | undefined => {
    if (value === undefined) return isCard ? 12 : undefined;
    if (typeof value === "number") return value;
    return value ? 12 : 0;
  };

  const getBorderWidth = (): number => {
    if (borderWidth !== undefined) return borderWidth;
    // No default border needed now with better colors
    return 0;
  };

  const getShadow = (value?: boolean | string) => {
    const applyShadow = value !== undefined ? value : isCard;
    if (!applyShadow) return {};

    // Better shadow for both themes
    const shadowIntensity = theme.dark ? 0.5 : 0.15;
    const shadowSizes = {
      sm: {
        height: 1,
        radius: 2,
        opacity: shadowIntensity * 0.8,
        elevation: 2,
      },
      md: {
        height: 2,
        radius: 4,
        opacity: shadowIntensity,
        elevation: 4,
      },
      lg: {
        height: 4,
        radius: 6,
        opacity: shadowIntensity * 1.2,
        elevation: 8,
      },
      xl: {
        height: 6,
        radius: 8,
        opacity: shadowIntensity * 1.4,
        elevation: 12,
      },
    };

    const shadowType = typeof value === "string" ? value : "md";
    const size =
      shadowSizes[shadowType as keyof typeof shadowSizes] || shadowSizes.md;

    return Platform.select({
      ios: {
        shadowColor: theme.dark ? "#000000" : "#000000",
        shadowOffset: { width: 0, height: size.height },
        shadowOpacity: size.opacity,
        shadowRadius: size.radius,
      },
      android: { elevation: size.elevation },
      default: {},
    });
  };

  const getColor = (color?: string, defaultKey?: keyof Theme["colors"]) => {
    if (!color && !defaultKey) return undefined;
    const colorValue = color || defaultKey;
    if (!colorValue) return undefined;

    return Object.keys(theme.colors).includes(colorValue)
      ? theme.colors[colorValue as keyof Theme["colors"]]
      : colorValue;
  };

  // Smart defaults based on theme
  const getBackgroundColor = () => {
    if (backgroundColor) {
      return getColor(backgroundColor as string);
    }
    return isCard ? theme.colors.cardBackground : theme.colors.background;
  };

  const getBorderColor = () => {
    if (borderColor) {
      return getColor(borderColor as string);
    }
    return theme.colors.borderColor;
  };

  const styles = useMemo(
    () => ({
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
      borderWidth: getBorderWidth(),
      borderRadius: getRadius(radius),
      ...getShadow(shadow),

      padding: getSpacing(padding),
      paddingHorizontal: getSpacing(paddingHorizontal),
      paddingVertical: getSpacing(paddingVertical),
      paddingTop: getSpacing(paddingTop),
      paddingRight: getSpacing(paddingRight),
      paddingBottom: getSpacing(paddingBottom),
      paddingLeft: getSpacing(paddingLeft),

      margin: getSpacing(margin),
      marginHorizontal: getSpacing(marginHorizontal),
      marginVertical: getSpacing(marginVertical),
      marginTop: getSpacing(marginTop),
      marginRight: getSpacing(marginRight),
      marginBottom: getSpacing(marginBottom),
      marginLeft: getSpacing(marginLeft),

      flex,
      flexDirection,
      justifyContent,
      alignItems,
    }),
    [
      isCard,
      backgroundColor,
      borderColor,
      borderWidth,
      radius,
      shadow,
      padding,
      paddingHorizontal,
      paddingVertical,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      margin,
      marginHorizontal,
      marginVertical,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      flex,
      flexDirection,
      justifyContent,
      alignItems,
      theme,
    ]
  );

  return <View ref={ref} style={[styles, style]} {...otherProps} />;
});

export default ThemedCard;
