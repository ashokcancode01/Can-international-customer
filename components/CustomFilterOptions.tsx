import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";

interface FilterOption {
  label: string;
  value: string;
}

interface CustomFilterOptionsProps {
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  title?: string;
  containerStyle?: object;
  optionStyle?: object;
  activeOptionStyle?: object;
  visible: boolean;
  onClose: () => void;
}

const CustomFilterOptionsModal: React.FC<CustomFilterOptionsProps> = ({
  options,
  selectedValue,
  onSelect,
  title = "Sort By",
  containerStyle,
  optionStyle,
  activeOptionStyle,
  visible,
  onClose,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.container,
                { backgroundColor: theme.colors.card },
                containerStyle,
              ]}
            >
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  {title}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  accessibilityLabel="Close filter options"
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.options}>
                {options?.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      selectedValue === option.value && [
                        styles.activeOption,
                        { backgroundColor: theme.colors.brandColor },
                      ],
                      optionStyle,
                      selectedValue === option.value && activeOptionStyle,
                    ]}
                    onPress={() => {
                      onSelect(option.value);
                      onClose();
                    }}
                    accessibilityLabel={option.label}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            selectedValue === option.value
                              ? "#FFF"
                              : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    marginHorizontal: 6,
    padding: 8,
    borderRadius: 8,
    elevation: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
  options: {
    flexDirection: "column",
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: 4,
  },
  activeOption: {
    borderColor: "transparent",
  },
  optionText: {
    fontSize: 12,
  },
});

export default CustomFilterOptionsModal;
