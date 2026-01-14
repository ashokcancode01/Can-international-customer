import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import React from "react";
import ThemedText from "../themed/ThemedText";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedIcon } from "../themed/ThemedIcon";
interface ThemedButtonProps {
  style?: any;
  height?: number;
  isLoading: boolean;
  loadingText: string;
  buttonName: string;
  disabled?: boolean;
  leftIcon?: { name: string; color?: string; size?: number };
  rightIcon?: { name: string; color?: string; size?: number };
  onPress?: () => void;
}

const ThemedButton = ({
  style,
  height = 40,
  isLoading = false,
  loadingText,
  buttonName,
  disabled,
  leftIcon,
  rightIcon,
  onPress,
  ...rest
}: ThemedButtonProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.colors.brandColor },
        style,
      ]}
      disabled={disabled || isLoading}
      onPress={onPress}
      {...rest}
    >
      {isLoading ? (
        <>
          <ActivityIndicator size="small" color="white" />
          {loadingText && (
            <ThemedText type="buttonText" style={[{ marginLeft: 10 }]}>
              {loadingText}
            </ThemedText>
          )}
        </>
      ) : (
        <>
          {leftIcon && (
            <View style={{ marginRight: 8 }}>
              <ThemedIcon
                name={leftIcon.name}
                size={leftIcon.size || 20}
                color={leftIcon.color || "white"}
              />
            </View>
          )}
          <ThemedText type="buttonText">{buttonName.toUpperCase()}</ThemedText>
          {rightIcon && (
            <View style={{ marginLeft: 8 }}>
              <ThemedIcon
                name={rightIcon.name}
                size={rightIcon.size || 20}
                color={rightIcon.color || "white"}
              />
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
    width: "100%",
  },
});
