import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import ThemedIcon from "../themed/ThemedIcon";
import { Controller, FieldValues } from "react-hook-form";
import ThemedText from "../themed/ThemedText";

interface CustomTextFieldProps<T extends FieldValues = any>
  extends TextInputProps {
  leftIcon?: {
    name: string;
    size?: number;
    color?: string;
    onPress?: () => void;
  };
  rightIcon?: {
    name: string;
    size?: number;
    color?: string;
    onPress?: () => void;
  };
  clearButton?: boolean;
  onClear?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  label?: string;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  isNumber?: boolean;
  control: any;
  name: string;
  rules?: any;
  min?: number;
  max?: number;
  step?: number;
  multiline?: boolean;
  height?: number;
  leftIconName?: string;
}

export default function ThemedTextField<T extends FieldValues = any>({
  leftIcon,
  rightIcon,
  clearButton = true,
  onClear,
  containerStyle,
  inputStyle,
  label,
  labelStyle,
  errorStyle,
  placeholder,
  secureTextEntry,
  isNumber = false,
  control,
  name,
  rules,
  min,
  max,
  step = 1,
  editable = true,
  multiline = false,
  height = 40,
  leftIconName,
  ...restProps
}: CustomTextFieldProps<T>) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [secureEntry, setSecureEntry] = useState(!!secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const toggleSecureEntry = () => setSecureEntry(!secureEntry);

  const handleIncrement = (
    value: string,
    onChange: (value: string) => void
  ) => {
    const current = parseFloat(value) || 0;
    if (max === undefined || current < max) {
      onChange(String(current + step));
    }
  };

  const handleDecrement = (
    value: string,
    onChange: (value: string) => void
  ) => {
    const current = parseFloat(value) || 0;
    if (min === undefined || current > min) {
      onChange(String(current - step));
    }
  };

  const handleClear = (onChange: (value: string) => void) => {
    onChange("");
    if (onClear) onClear();
  };

  const getDisabledColor = () => {
    return theme.colors.disabled;
  };

  const getDisabledBackgroundColor = () => {
    return theme.colors.disabled + "30";
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: editable
        ? theme.colors.cardBackground
        : theme.dark
          ? "#1E1E1E"
          : getDisabledBackgroundColor(),
      borderWidth: 1,
      borderRadius: 5,
      flexDirection: multiline ? "column" : "row",
      alignItems: multiline ? "flex-start" : "center",
      height: multiline ? undefined : height,
      minHeight: multiline ? 100 : height,
      paddingLeft: 10,
      paddingRight: isNumber ? 0 : 10,
      paddingVertical: multiline ? 8 : 0,
      opacity: editable ? 1 : 1,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      flex: 1,
      color: editable
        ? inputStyle?.color || theme.colors.text
        : theme.dark
          ? "#FFFFFF"
          : getDisabledColor(),
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.md,
      paddingHorizontal: multiline ? 0 : 10,
      paddingVertical: multiline ? 5 : 0,
      ...(multiline && { minHeight: 80, height: undefined, width: "100%" }),
      textAlignVertical: multiline ? "top" : "center",
    },
    numberBox: {
      borderLeftWidth: 1,
      height: 40,
      width: 30,
      marginLeft: 10,
      opacity: editable ? 1 : 0.5,
    },
    numberHalf: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainer: {
      paddingHorizontal: 5,
      position: "absolute",
      right: 0,
      top: 30,
    },
  });
  const inputColor = !editable
    ? theme.dark
      ? "#FFFFFF"   // white text in dark mode
      : getDisabledColor()
    : inputStyle?.color || theme.colors.text;

  const placeholderColor = !editable
    ? theme.dark
      ? "#FFFFFF"   // white placeholder in dark mode
      : getDisabledColor()
    : theme.colors.textSecondary;

  return (
    <Controller
      control={control}
      name={name as any}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }: any) => {
        const borderColor = !editable
          ? getDisabledColor()
          : isFocused
            ? theme.colors.brandColor
            : error
              ? theme.colors.error
              : theme.colors.border;

        const iconColor = editable ? undefined : getDisabledColor();

        return (
          <View style={{ marginBottom: 15 }}>
            {label && (
              <ThemedText
                type="label"
                style={[
                  {
                    color: !editable
                      ? theme.dark
                        ? "#FFFFFF"
                        : getDisabledColor()
                      : isFocused
                        ? theme.colors.brandColor
                        : theme.colors.text,
                    marginBottom: 5,
                  },
                  labelStyle,
                ]}
              >
                {label}
              </ThemedText>

            )}

            <View style={[styles.container, { borderColor }, containerStyle]}>
              {multiline ? (
                <>
                  {(leftIcon ||
                    rightIcon ||
                    (editable && clearButton && value) ||
                    secureTextEntry !== undefined) && (
                      <View style={styles.topRow}>
                        {leftIcon && (
                          <View style={styles.iconContainer}>
                            <ThemedIcon
                              name={leftIcon.name}
                              size={leftIcon.size || 20}
                              color={iconColor || leftIcon.color}
                              onPress={editable ? leftIcon.onPress : undefined}
                            />
                          </View>
                        )}

                        <View style={{ flex: 1 }} />

                        {editable && clearButton && value && (
                          <TouchableOpacity
                            onPress={() => handleClear(onChange)}
                            style={styles.iconContainer}
                          >
                            <ThemedIcon name="close" size={20} />
                          </TouchableOpacity>
                        )}

                        {secureTextEntry !== undefined && (
                          <TouchableOpacity
                            onPress={editable ? toggleSecureEntry : undefined}
                            style={styles.iconContainer}
                            disabled={!editable}
                          >
                            <ThemedIcon
                              name={secureEntry ? "visibility-off" : "visibility"}
                              size={20}
                              color={iconColor}
                            />
                          </TouchableOpacity>
                        )}

                        {rightIcon && (
                          <View style={styles.iconContainer}>
                            <ThemedIcon
                              name={rightIcon.name}
                              size={rightIcon.size || 20}
                              color={iconColor || rightIcon.color}
                              onPress={editable ? rightIcon.onPress : undefined}
                            />
                          </View>
                        )}
                      </View>
                    )}

                  <TextInput
                    style={[styles.input, inputStyle, { color: inputColor }]}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderColor}
                    value={String(value || "")}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      handleBlur();
                    }}
                    onFocus={handleFocus}
                    secureTextEntry={secureEntry}
                    keyboardType={isNumber ? "numeric" : restProps.keyboardType}
                    editable={editable}
                    multiline={multiline}        
                    scrollEnabled={multiline}
                    {...restProps}
                  />


                </>
              ) : (
                <>
                  {leftIcon && (
                    <ThemedIcon
                      name={leftIcon.name}
                      size={leftIcon.size || 20}
                      color={iconColor || leftIcon.color}
                      onPress={editable ? leftIcon.onPress : undefined}
                    />
                  )}

                  {leftIconName && (
                    <ThemedIcon
                      name={leftIconName}
                      size={20}
                      color={iconColor || theme.colors.textSecondary}
                    />
                  )}

                  <TextInput
                    style={[styles.input, inputStyle, { color: inputColor }]}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderColor}
                    value={String(value || "")}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      handleBlur();
                    }}
                    onFocus={handleFocus}
                    secureTextEntry={secureEntry}
                    keyboardType={isNumber ? "numeric" : restProps.keyboardType}
                    editable={editable}
                    {...restProps}
                  />


                  {editable && clearButton && value && (
                    <TouchableOpacity onPress={() => handleClear(onChange)}>
                      <ThemedIcon name="close" size={20} />
                    </TouchableOpacity>
                  )}

                  {secureTextEntry !== undefined && (
                    <TouchableOpacity
                      onPress={editable ? toggleSecureEntry : undefined}
                      style={{ marginLeft: 10 }}
                      disabled={!editable}
                    >
                      <ThemedIcon
                        name={secureEntry ? "visibility-off" : "visibility"}
                        size={20}
                        color={iconColor}
                      />
                    </TouchableOpacity>
                  )}

                  {isNumber && (
                    <View
                      style={[
                        styles.numberBox,
                        { borderLeftColor: borderColor },
                      ]}
                    >
                      <TouchableOpacity
                        style={[
                          styles.numberHalf,
                          {
                            borderBottomWidth: 1,
                            borderBottomColor: borderColor,
                          },
                        ]}
                        onPress={() =>
                          editable &&
                          handleIncrement(String(value || "0"), onChange)
                        }
                        disabled={!editable}
                      >
                        <ThemedIcon
                          name="arrow-drop-up"
                          size={16}
                          color={iconColor}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.numberHalf,
                          {
                            borderTopWidth: 1,
                            borderTopColor: borderColor,
                          },
                        ]}
                        onPress={() =>
                          editable &&
                          handleDecrement(String(value || "0"), onChange)
                        }
                        disabled={!editable}
                      >
                        <ThemedIcon
                          name="arrow-drop-down"
                          size={16}
                          color={iconColor}
                        />
                      </TouchableOpacity>
                    </View>
                  )}

                  {rightIcon && (
                    <ThemedIcon
                      name={rightIcon.name}
                      size={rightIcon.size || 20}
                      color={iconColor || rightIcon.color}
                      onPress={editable ? rightIcon.onPress : undefined}
                    />
                  )}
                </>
              )}
            </View>

            {error && (
              <ThemedText type="error" style={[{ marginTop: 4 }, errorStyle]}>
                {error.message || error}
              </ThemedText>
            )}
          </View>
        );
      }}
    />
  );
}
