import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from "react-native";
import ThemedView from "../themed/ThemedView";

interface ButtonProps {
  text: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onPress: () => void;
  type: "primary" | "secondary";
}

interface CustomButtonGroupProps {
  actionType: "add" | "update" | "delete" | "save" | "change";
  isLoading: boolean;
  paddingHorizontal?: number;
  isActionDisabled?: boolean;
  onCancel: () => void;
  onAction: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  isLoading = false,
  isDisabled = false,
  onPress,
  type,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isPrimary = type === "primary";

  const getColors = () => {
    if (isPrimary) {
      if (isDisabled) {
        return {
          backgroundColor: "#f3f4f6",
          textColor: "#9ca3af",
          borderColor: "#e5e7eb",
          shadowColor: "transparent",
        };
      }
      return {
        backgroundColor: "#dc1e3e",
        textColor: "#ffffff",
        borderColor: "#dc1e3e",
        shadowColor: "#dc1e3e50",
      };
    } else {
      if (isDisabled) {
        return {
          backgroundColor: "transparent",
          textColor: "#9ca3af",
          borderColor: "#e5e7eb",
          shadowColor: "transparent",
        };
      }
      return {
        backgroundColor: "#ffffff",
        textColor: "#374151",
        borderColor: "#d1d5db",
        shadowColor: "#6b7280",
      };
    }
  };

  const colors = getColors();

  const buttonStyle: ViewStyle = {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.backgroundColor,
    borderColor: colors.borderColor,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: isPrimary ? 4 : 2,
    },
    shadowOpacity: isPrimary ? 0.15 : 0.1,
    shadowRadius: isPrimary ? 6 : 4,
    elevation: isPrimary ? 6 : 3,
    ...(isPrimary &&
      !isDisabled && {
        shadowColor: "#dc1e3e",
        shadowOpacity: 0.25,
      }),
    minHeight: 40,
  };

  const textStyle: TextStyle = {
    color: colors.textColor,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
    textTransform: "uppercase",
  };

  const loadingIndicatorColor = isPrimary ? "#ffffff" : "#dc1e3e";

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={buttonStyle}
        disabled={isDisabled || isLoading}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ActivityIndicator
              size="small"
              color={loadingIndicatorColor}
              style={{ marginRight: 8 }}
            />
            <Text style={[textStyle, { opacity: 0.8 }]}>Loading...</Text>
          </View>
        ) : (
          <Text style={textStyle}>{text}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const CustomButtonGroup: React.FC<CustomButtonGroupProps> = ({
  actionType,
  isLoading,
  paddingHorizontal = 20,
  isActionDisabled = false,
  onCancel,
  onAction,
}) => {
  const actionButtonProps = {
    add: { text: "Add" },
    update: { text: "Update" },
    delete: { text: "Delete" },
    save: { text: "Save" },
    change: { text: "Change" },
  }[actionType];

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 10,
    // borderWidth: 1,
    backgroundColor: "transparent",
  };

  return (
    <ThemedView style={containerStyle}>
      <Button
        text="Cancel"
        type="secondary"
        isLoading={false}
        onPress={onCancel}
      />
      <View style={{ width: 16 }} />
      <Button
        text={actionButtonProps.text}
        type="primary"
        isLoading={isLoading}
        isDisabled={isActionDisabled}
        onPress={onAction}
      />
    </ThemedView>
  );
};

export default CustomButtonGroup;
