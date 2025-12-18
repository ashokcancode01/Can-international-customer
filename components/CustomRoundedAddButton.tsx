import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";

interface CustomRoundedAddButtonProps {
  onPress: () => void;
  size?: number;
  iconSize?: number;
  backgroundColor?: string;
  iconColor?: string;
  borderWidth?: number;
  borderColor?: string;
  elevation?: number;
  position?: "absolute" | "relative";
  right?: number;
  bottom?: number;
  style?: object;
}

const CustomRoundedAddButton: React.FC<CustomRoundedAddButtonProps> = ({
  onPress,
  size = 50,
  iconSize = 24,
  backgroundColor,
  iconColor,
  borderWidth = 0,
  borderColor = "#000",
  elevation = 5,
  position = "absolute",
  right = 20,
  bottom = 110,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor || theme.colors.brandColor,
          borderWidth: borderWidth,
          borderColor: borderColor,
          elevation: elevation,
          position: position,
          right: position === "absolute" ? right : undefined,
          bottom: position === "absolute" ? bottom : undefined,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={iconSize} color={iconColor || "#FFFFFF"} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default CustomRoundedAddButton;
