//Optiomized
import React, { forwardRef } from "react";
import { View, ViewProps } from "react-native";
import { useTheme, type Theme } from "@/theme/ThemeProvider";

export type SpacingValue = boolean | number | "xs" | "sm" | "md" | "lg" | "xl";

export type ThemedViewProps = ViewProps & {
  backgroundColor?: keyof Theme["colors"] | string;

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
};

export const ThemedView = forwardRef<
  React.ElementRef<typeof View>,
  ThemedViewProps
>(function ThemedView(
  {
    style,
    backgroundColor = "background",
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
    ...otherProps
  },
  ref
) {
  const { theme } = useTheme();

  const getSpacingValue = (value?: SpacingValue): number | undefined => {
    if (value === undefined) return undefined;
    if (typeof value === "number") return value;
    if (value === false) return 0;
    if (value === true) return 10;

    const spacingMap = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
    return spacingMap[value];
  };

  const getColorValue = (color: string): string => {
    return Object.keys(theme.colors).includes(color)
      ? theme.colors[color as keyof Theme["colors"]]
      : color;
  };

  const styles = {
    backgroundColor: getColorValue(backgroundColor),
    padding: getSpacingValue(padding),
    paddingHorizontal: getSpacingValue(paddingHorizontal),
    paddingVertical: getSpacingValue(paddingVertical),
    paddingTop: getSpacingValue(paddingTop),
    paddingRight: getSpacingValue(paddingRight),
    paddingBottom: getSpacingValue(paddingBottom),
    paddingLeft: getSpacingValue(paddingLeft),
    margin: getSpacingValue(margin),
    marginHorizontal: getSpacingValue(marginHorizontal),
    marginVertical: getSpacingValue(marginVertical),
    marginTop: getSpacingValue(marginTop),
    marginRight: getSpacingValue(marginRight),
    marginBottom: getSpacingValue(marginBottom),
    marginLeft: getSpacingValue(marginLeft),
  };

  return <View ref={ref} style={[styles, style]} {...otherProps} />;
});

export default ThemedView;
