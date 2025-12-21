import React, { useState, useCallback, memo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ViewStyle,
  Modal,
  FlatList,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedTouchableOpacity from "../themed/ThemedTouchableOpacity";
import ThemedText from "../themed/ThemedText";
import ThemedIcon from "../themed/ThemedIcon";
import ThemedView from "../themed/ThemedView";
import { useTheme } from "@/theme/ThemeProvider";

interface Option {
  name: string;
  _id: string | boolean;
  [key: string]: any;
}

interface SelectedValue {
  _id: string | boolean;
  name: string;
  [key: string]: any;
}

interface CustomFormDropdownProps<T extends FieldValues> {
  as?: typeof MaterialIcons | typeof MaterialCommunityIcons | typeof Ionicons;
  iconName?: string;
  options: Option[];
  name: Path<T>;
  label?: string;
  control: Control<T>;
  rules?: object;
  isMultiSelect?: boolean;
  placeholder?: string;
  containerStyle?: ViewStyle;
  searchable?: boolean;
  defaultValue?:
    | string
    | boolean
    | SelectedValue
    | (string | boolean | SelectedValue)[];
  dependentNoOptionText?: string;
  requireSearchToShow?: boolean;
  onAddNewItem?: (searchText: string) => void;
  storeFullObject?: boolean;
  dataRequired?: boolean;
  disabled?: boolean;
  showSelectedBadges?: boolean;
  maxVisibleBadges?: number;
  showOptionsAfterSearch?: boolean;
  onSearch?: (searchText: string) => void;
  isLoading?: boolean;
  searchPromptMessage?: string;
}

const DropdownOption = memo(
  ({
    item,
    isSelected,
    onSelect,
  }: {
    item: Option;
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <ThemedTouchableOpacity
      style={[styles.option, isSelected && styles.selectedOption]}
      onPress={onSelect}
    >
      <ThemedText
        style={[styles.optionText, isSelected && styles.selectedOptionText]}
      >
        {item.name}
      </ThemedText>
      {isSelected && (
        <ThemedIcon
          as={Ionicons}
          name="checkmark"
          type="small"
          color="#2110e5"
        />
      )}
    </ThemedTouchableOpacity>
  )
);

const SelectedBadge = memo(
  ({ item, onRemove }: { item: Option; onRemove: () => void }) => (
    <ThemedView style={styles.selectedBadge}>
      <ThemedText style={styles.selectedBadgeText}>{item.name}</ThemedText>
      <TouchableOpacity onPress={onRemove} style={styles.badgeRemoveButton}>
        <ThemedIcon as={Ionicons} name="close" type="xsmall" color="#1976D2" />
      </TouchableOpacity>
    </ThemedView>
  )
);

const DROPDOWN_MAX_HEIGHT = Platform.select({ ios: 300, android: 400 });
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

function CustomFormDropdownBase<T extends FieldValues>(
  props: CustomFormDropdownProps<T>
) {
  const {
    as,
    iconName,
    options,
    name,
    label,
    control,
    rules,
    isMultiSelect = false,
    placeholder = "Select option",
    containerStyle,
    searchable = true,
    defaultValue,
    requireSearchToShow = false,
    dependentNoOptionText,
    onAddNewItem,
    storeFullObject = false,
    dataRequired = false,
    disabled = false,
    showSelectedBadges = true,
    maxVisibleBadges = 2,
    showOptionsAfterSearch = false,
    onSearch,
    isLoading = false,
    searchPromptMessage,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const placeholderColor = useThemeColor("placeholder");
  const textColor = useThemeColor("text");
  const disabledColor = useThemeColor("disabled");

  const { theme } = useTheme();

  const filteredOptions = useCallback(
    () =>
      options?.filter((option) =>
        option?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
      ),
    [options, searchText]
  );

  const findOptionByValue = useCallback(
    (searchValue: string | boolean | SelectedValue) => {
      if (typeof searchValue === "object" && searchValue !== null) {
        return options?.find(
          (opt) => opt._id === (searchValue as SelectedValue)._id
        );
      }
      return options?.find(
        (opt) =>
          opt._id === searchValue ||
          opt.name.toLowerCase() === String(searchValue).toLowerCase()
      );
    },
    [options]
  );

  const getDisplayValue = useCallback(
    (value: any) => {
      if (!value) {
        if (defaultValue) {
          if (isMultiSelect && Array.isArray(defaultValue)) {
            const selectedOptions = defaultValue
              .map((defaultVal) => findOptionByValue(defaultVal))
              .filter(Boolean) as Option[];
            return selectedOptions.map((opt) => opt.name).join(", ");
          } else {
            const defaultOption = findOptionByValue(
              defaultValue as string | boolean | SelectedValue
            );
            return defaultOption?.name || "";
          }
        }
        return "";
      }

      if (isMultiSelect && Array.isArray(value)) {
        if (storeFullObject) {
          return value.map((v: SelectedValue) => v.name).join(", ");
        }
        const selectedOptions = value
          .map((val) => findOptionByValue(val))
          .filter(Boolean) as Option[];
        return selectedOptions.map((opt) => opt.name).join(", ");
      }

      if (storeFullObject && typeof value === "object") {
        return value.name || "";
      }

      const selectedOption = findOptionByValue(value);
      return selectedOption?.name || "";
    },
    [options, isMultiSelect, defaultValue, findOptionByValue, storeFullObject]
  );

  const getSelectedOptions = useCallback(
    (value: any): Option[] => {
      if (!value) return [];

      if (isMultiSelect && Array.isArray(value)) {
        if (storeFullObject) {
          return value;
        }
        return value
          .map((val) => findOptionByValue(val))
          .filter(Boolean) as Option[];
      }

      if (storeFullObject && typeof value === "object") {
        return [value];
      }

      const selectedOption = findOptionByValue(value);
      return selectedOption ? [selectedOption] : [];
    },
    [findOptionByValue, isMultiSelect, storeFullObject]
  );

  const renderOption = useCallback(
    (
      { item }: { item: Option },
      value: any,
      onChange: (value: any) => void
    ) => {
      const isSelected = isMultiSelect
        ? Array.isArray(value) &&
          value.some((v: any) =>
            storeFullObject ? v._id === item._id : v === item._id
          )
        : storeFullObject
        ? value?._id === item._id
        : value === item._id;

      const handleSelect = () => {
        if (isMultiSelect) {
          const currentValues = Array.isArray(value) ? value : [];
          const newValues = isSelected
            ? currentValues.filter((v: any) =>
                storeFullObject ? v._id !== item._id : v !== item._id
              )
            : [...currentValues, storeFullObject ? { ...item } : item._id];
          onChange(newValues?.length > 0 ? newValues : null);
        } else {
          onChange(storeFullObject ? { ...item } : item._id);
          setIsOpen(false);
        }
        setSearchText("");
      };

      return (
        <DropdownOption
          item={item}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      );
    },
    [isMultiSelect, storeFullObject]
  );

  const renderEmptyList = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchText
            ? "No matching options found"
            : dependentNoOptionText || "No options available"}
        </Text>
        {searchText && onAddNewItem && (
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => {
              onAddNewItem(searchText);
              setSearchText("");
            }}
          >
            <Text style={styles.addNewButtonText}>Add &quot;{searchText}&quot;</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [searchText, dependentNoOptionText, onAddNewItem]
  );

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    onSearch?.(text);
  };

  return (
    <Controller<T>
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue as any}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        useEffect(() => {
          if (!value && defaultValue && options?.length > 0) {
            if (isMultiSelect && Array.isArray(defaultValue)) {
              const defaultValues = defaultValue
                .map((defaultVal) => {
                  const matchingOption = findOptionByValue(defaultVal);
                  if (matchingOption) {
                    return storeFullObject
                      ? { ...matchingOption }
                      : matchingOption._id;
                  }
                  return null;
                })
                .filter(Boolean);

              if (defaultValues?.length > 0) {
                onChange(defaultValues);
              }
            } else {
              const defaultOption = findOptionByValue(
                defaultValue as string | boolean | SelectedValue
              );
              if (defaultOption) {
                onChange(
                  storeFullObject ? { ...defaultOption } : defaultOption._id
                );
              }
            }
          }
        }, [defaultValue, options, value, onChange]);

        const handleClear = (e: any) => {
          e.stopPropagation();
          onChange(null);
        };

        const handleOpen = () => {
          if (!disabled) {
            setIsOpen(true);
          }
        };

        const selectedOptions = getSelectedOptions(value);
        const hasSelectedItems = selectedOptions?.length > 0;

        const visibleBadges = selectedOptions.slice(0, maxVisibleBadges);
        const hiddenCount = selectedOptions?.length - maxVisibleBadges;

        const handleRemoveItem = (itemId: string | boolean) => {
          if (isMultiSelect && Array.isArray(value)) {
            const newValues = value.filter((v: any) =>
              storeFullObject ? v._id !== itemId : v !== itemId
            );
            onChange(newValues?.length > 0 ? newValues : null);
          } else {
            onChange(null);
          }
        };

        return (
          <View style={[styles.container, containerStyle]}>
            {label && (
              <ThemedText
                type="label"
                style={{ marginBottom: 5, color: theme.colors.text }}
              >
                {label}
              </ThemedText>
            )}
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                error && styles.errorBorder,
                isOpen && styles.dropdownButtonFocused,
                disabled && [
                  styles.disabledDropdown,
                  { backgroundColor: disabledColor },
                ],
              ]}
              onPress={handleOpen}
              disabled={disabled}
            >
              {iconName && (
                <ThemedIcon
                  as={as || MaterialIcons}
                  name={iconName}
                  type="small"
                />
              )}

              {(!showSelectedBadges || !hasSelectedItems || !isMultiSelect) && (
                <ThemedText
                  style={[
                    styles.dropdownButtonText,
                    (!value ||
                      (Array.isArray(value) && value?.length === 0)) && {
                      color: disabled ? "#fff" : placeholderColor,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {getDisplayValue(value) || placeholder}
                </ThemedText>
              )}

              {showSelectedBadges && isMultiSelect && hasSelectedItems && (
                <View style={styles.badgesContainer}>
                  {visibleBadges.map((option) => (
                    <SelectedBadge
                      key={String(option._id)}
                      item={option}
                      onRemove={() => handleRemoveItem(option._id)}
                    />
                  ))}
                  {hiddenCount > 0 && (
                    <ThemedView style={styles.countBadge}>
                      <ThemedText style={styles.countBadgeText}>
                        +{hiddenCount}
                      </ThemedText>
                    </ThemedView>
                  )}
                </View>
              )}

              <View style={styles.dropdownButtonIcons}>
                {!disabled &&
                  value &&
                  (!Array.isArray(value) || value?.length > 0) && (
                    <TouchableOpacity
                      onPress={handleClear}
                      style={styles.clearButton}
                    >
                      <ThemedIcon
                        as={Ionicons}
                        name="close-circle"
                        type="xsmall"
                      />
                    </TouchableOpacity>
                  )}
                <ThemedIcon
                  as={Ionicons}
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  type="xsmall"
                />
              </View>
            </TouchableOpacity>

            {error && !disabled && (
              <ThemedText type="error">
                {error?.message || "Required Field"}
              </ThemedText>
            )}

            <Modal
              visible={isOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setIsOpen(false)}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.modalContainer}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => {
                    setIsOpen(false);
                    setSearchText("");
                  }}
                />
                <ThemedView style={styles.modalContent}>
                  {isMultiSelect && (
                    <View style={styles.multiSelectHeader}>
                      <ThemedText style={styles.selectedCountText}>
                        {selectedOptions?.length} selected
                      </ThemedText>
                      <TouchableOpacity
                        style={styles.doneButton}
                        onPress={() => setIsOpen(false)}
                      >
                        <ThemedText style={styles.doneButtonText}>
                          Done
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  )}

                  {searchable && (
                    <ThemedView style={styles.searchContainer}>
                      <ThemedIcon name="search" as={Ionicons} type="small" />
                      <TextInput
                        style={[styles.searchInput, { color: textColor }]}
                        value={searchText}
                        onChangeText={handleSearchChange}
                        placeholder="Search..."
                        placeholderTextColor={placeholderColor}
                        editable={!disabled}
                      />
                      {searchText !== "" && (
                        <TouchableOpacity
                          onPress={() => {
                            setSearchText("");
                            onSearch?.("");
                          }}
                          style={styles.searchClearButton}
                        >
                          <ThemedIcon
                            as={Ionicons}
                            name="close-circle"
                            type="small"
                          />
                        </TouchableOpacity>
                      )}
                    </ThemedView>
                  )}

                  {searchPromptMessage && (
                    <ThemedText style={styles.searchPromptMessage}>
                      {searchPromptMessage}
                    </ThemedText>
                  )}

                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ThemedText style={styles.loadingText}>
                        Searching options...
                      </ThemedText>
                    </View>
                  ) : !requireSearchToShow ||
                    searchText ||
                    !showOptionsAfterSearch ? (
                    <FlatList
                      data={filteredOptions()}
                      renderItem={(props) =>
                        renderOption(props, value, onChange)
                      }
                      keyExtractor={(item) => String(item._id)}
                      style={[
                        styles.optionsList,
                        Platform.OS === "ios" && styles.iosOptionsList,
                      ]}
                      contentContainerStyle={styles.optionsListContent}
                      keyboardShouldPersistTaps="handled"
                      ListEmptyComponent={renderEmptyList}
                    />
                  ) : (
                    <View style={styles.searchPromptContainer}>
                      <Text style={styles.searchPromptText}>
                        Type to search options...
                      </Text>
                    </View>
                  )}
                </ThemedView>
              </KeyboardAvoidingView>
            </Modal>
          </View>
        );
      }}
    />
  );
}

export const CustomFormDropdown = memo(
  CustomFormDropdownBase
) as typeof CustomFormDropdownBase;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
  },
  dropdownButton: {
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonFocused: {
    borderColor: "#0066cc",
  },
  disabledDropdown: {
    borderColor: "#ddd",
    opacity: 0.7,
  },
  errorBorder: {
    borderColor: "#ff4444",
  },
  dropdownButtonText: {
    fontSize: 11,
    marginLeft: 5,
    flex: 1,
  },
  dropdownButtonIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: "100%",
    maxHeight: SCREEN_HEIGHT * 0.7,
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionsList: {
    maxHeight: DROPDOWN_MAX_HEIGHT,
  },
  iosOptionsList: {
    flexGrow: 0,
  },
  optionsListContent: {
    flexGrow: 1,
  },
  option: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    marginLeft: 8,
    padding: 0,
    height: Platform.OS === "ios" ? 20 : "auto",
  },
  searchClearButton: {
    padding: 4,
  },
  selectedOption: {
    backgroundColor: "#e6f3ff",
  },
  optionText: {
    fontSize: 11,
    flex: 1,
  },
  selectedOptionText: {
    color: "#0066cc",
  },
  clearButton: {
    marginRight: 8,
    padding: 2,
  },
  emptyContainer: {
    padding: 10,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  addNewButton: {
    padding: 8,
    backgroundColor: "#0066cc",
    borderRadius: 4,
    marginTop: 8,
  },
  addNewButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  searchPromptContainer: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  searchPromptText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  badgesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginLeft: 5,
  },
  selectedBadge: {
    backgroundColor: "#e6f3ff",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 4,
    marginBottom: 4,
  },
  selectedBadgeText: {
    fontSize: 10,
    color: "#0066cc",
    marginRight: 4,
  },
  badgeRemoveButton: {
    padding: 2,
  },
  countBadge: {
    backgroundColor: "#0066cc",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  countBadgeText: {
    fontSize: 10,
    color: "#ffffff",
  },
  multiSelectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedCountText: {
    fontSize: 11,
  },
  doneButton: {
    backgroundColor: "#0066cc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  searchPromptMessage: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    marginVertical: 8,
  },
  loadingContainer: {
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  loadingText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
});
