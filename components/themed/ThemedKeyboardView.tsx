import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface ThemedKeyboardViewProps {
  children: React.ReactNode;
  centerContent?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
  scrollEnabled?: boolean;
}

const ThemedKeyboardView: React.FC<ThemedKeyboardViewProps> = ({
  children,
  centerContent = false,
  backgroundColor,
  style,
  scrollEnabled = true,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const defaultBackgroundColor = backgroundColor || colors.background;

  const containerStyle = [
    styles.container,
    { backgroundColor: defaultBackgroundColor },
    style,
  ];

  const contentStyle = [
    styles.content,
    centerContent && styles.centeredContent,
  ];

  return (
    <KeyboardAvoidingView
      style={[containerStyle, styles.keyboardView]}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {scrollEnabled ? (
        <ScrollView
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  centeredContent: {
    justifyContent: "center",
  },
});

export default ThemedKeyboardView;
