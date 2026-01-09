import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import ThemedText from "../themed/ThemedText";
import { useTheme } from "@/theme/ThemeProvider";

interface ThemedButtonProps {
  style?: any;
  height?: number;
  isLoading: boolean;
  loadingText: string;
  buttonName: string;
  disabled?: boolean;
  onPress?: () => void;
}

const ThemedButton = ({
  style,
  height = 40,
  isLoading = false,
  loadingText,
  buttonName,
  disabled,
  onPress,
  ...rest
}: ThemedButtonProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        ,
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
        <ThemedText type="buttonText">{buttonName.toUpperCase()}</ThemedText>
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
