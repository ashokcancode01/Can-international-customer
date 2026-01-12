import React, { useState, useCallback } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "@/components/themed/ThemedText";
import { useTheme } from "@/theme/ThemeProvider";

const THEME_OPTIONS = [
  {
    key: "light",
    label: "Light Mode",
    icon: "sunny-outline" as const,
    description: "Clean and bright interface",
  },
  {
    key: "dark",
    label: "Dark Mode",
    icon: "moon-outline" as const,
    description: "Easy on the eyes",
  },
  {
    key: "system",
    label: "System Default",
    icon: "phone-portrait-outline" as const,
    description: "Follows device settings",
  },
] as const;

const AppearanceScreen = () => {
  const { theme, themeMode, setTheme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const colors = theme.colors;
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTheme, setLoadingTheme] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  //Refresh Handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500)
  }, [])

  const getSuccessMessage = (selectedMode: string) => {
    switch (selectedMode) {
      case "light":
        return "Light mode activated!";
      case "dark":
        return "Dark mode activated!";
      case "system":
        return "System default mode activated!";
      default:
        return "Theme updated successfully!";
    }
  };

  const handleThemeSelect = useCallback(
    async (selectedMode: string) => {
      if (selectedMode === themeMode || isLoading) return;

      setIsLoading(true);
      setLoadingTheme(selectedMode);
      setSuccessMessage(null);

      try {
        setTheme(selectedMode as any);

        setTimeout(() => {
          setSuccessMessage(getSuccessMessage(selectedMode));
        }, 50);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 3050);
      } catch (error) {
      } finally {
        setTimeout(() => {
          setIsLoading(false);
          setLoadingTheme(null);
        }, 100);
      }
    },
    [setTheme, themeMode, isLoading]
  );

  const renderThemeOption = (
    option: (typeof THEME_OPTIONS)[number],
    index: number
  ) => {
    const isSelected = themeMode === option.key;
    const isCurrentLoading = loadingTheme === option.key;

    return (
      <TouchableOpacity
        key={option.key}
        style={[
          styles.themeOption,
          {
            backgroundColor: colors.cardBackground,
            borderColor: isSelected
              ? colors.brandColor + "40"
              : colors.border + "30",
          },
          isSelected && styles.selectedOption,
        ]}
        onPress={() => handleThemeSelect(option.key)}
        activeOpacity={0.7}
        disabled={isLoading}
      >
        <View style={styles.themeOptionLeft}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isSelected
                  ? colors.brandColor + "20"
                  : colors.textSecondary + "10",
              },
            ]}
          >
            <Ionicons
              name={option.icon}
              size={24}
              color={isSelected ? colors.brandColor : colors.textSecondary}
            />
          </View>
          <View style={styles.textContainer}>
            <ThemedText
              style={[
                styles.themeOptionText,
                {
                  color: isSelected ? colors.brandColor : colors.text,
                  fontWeight: isSelected ? "600" : "500",
                },
              ]}
            >
              {option.label}
            </ThemedText>
            <ThemedText
              style={[
                styles.themeOptionDescription,
                { color: colors.textSecondary },
              ]}
            >
              {option.description}
            </ThemedText>
          </View>
        </View>
        <View style={styles.themeOptionRight}>
          {isCurrentLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.brandColor} />
            </View>
          ) : isSelected ? (
            <View
              style={[
                styles.checkmarkContainer,
                { backgroundColor: colors.brandColor },
              ]}
            >
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
          ) : (
            <View
              style={[
                styles.uncheckedContainer,
                { borderColor: colors.border },
              ]}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.dark ? "#fff" : "#000"}
          style={{ backgroundColor: theme.colors.background }}
        />}
    >
      <View style={styles.sectionHeader}>
        <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
          Theme Preference
        </ThemedText>
        <ThemedText
          style={[styles.headerSubtitle, { color: colors.textSecondary }]}
        >
          Customize how the app looks and feels
        </ThemedText>
      </View>
      <View style={styles.optionsContainer}>
        {THEME_OPTIONS?.map(renderThemeOption)}
      </View>
      {successMessage && (
        <View
          style={[
            styles.successContainer,
            {
              backgroundColor: "#10B981" + "15",
              borderColor: "#10B981" + "40",
            },
          ]}
        >
          <View
            style={[
              styles.successIconContainer,
              { backgroundColor: "#10B981" + "20" },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
          <ThemedText style={[styles.successText, { color: "#10B981" }]}>
            {successMessage}
          </ThemedText>
        </View>
      )}
      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border + "30",
          },
        ]}
      >
        <View
          style={[
            styles.infoIconContainer,
            { backgroundColor: colors.brandColor + "15" },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colors.brandColor}
          />
        </View>
        <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
          System default automatically adjusts the app appearance based on your
          device&apos;s current theme settings.
        </ThemedText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "400",
    opacity: 0.8,
    marginBottom: 10,
  },
  sectionHeader: {
    marginBottom: 4,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 10,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  selectedOption: {
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  themeOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  themeOptionText: {
    fontSize: 15,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  themeOptionDescription: {
    fontSize: 12,
    opacity: 0.8,
  },
  themeOptionRight: {
    marginLeft: 10,
  },
  loadingContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  uncheckedContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  successIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  successText: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  infoCard: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
});

export default AppearanceScreen;
