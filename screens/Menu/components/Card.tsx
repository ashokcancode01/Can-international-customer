import React, { ReactNode } from "react";
import { View, StyleSheet, Dimensions, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

const screenWidth = Dimensions.get("window").width;

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Card: React.FC<CardProps> = ({ children, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          width: screenWidth - 24,
          alignSelf: "center",
          backgroundColor: theme.colors.card,
          borderColor: theme.dark
            ? "rgba(0,0,0,0.05)"
            : "rgba(0,0,0,0.05)",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
});
