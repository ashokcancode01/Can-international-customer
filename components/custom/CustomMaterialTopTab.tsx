import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

interface TabConfig {
  accStageGroups?: string;
  status?: string;
  count?: number;
  component?: React.ComponentType<any>;
  params?: Record<string, any>;
  label?: string;
  icon?: string;
}

interface CustomMaterialTabsProps {
  tabsConfig: Record<string, TabConfig>;
  screenComponent?: React.ComponentType<any>;
  containerStyle?: object;
  tabBarStyle?: object;
  currentTabSetter?: (tabName: string) => void;
  currentTab?: string;
  isLoading?: boolean;
  isDetailScreen?: boolean;
}

const CustomMaterialTopTab: React.FC<CustomMaterialTabsProps> = ({
  tabsConfig,
  screenComponent,
  containerStyle,
  tabBarStyle,
  currentTabSetter,
  currentTab,
  isLoading,
  isDetailScreen = false,
}) => {
  const { theme } = useTheme();
  const tabEntries = Object.entries(tabsConfig || {});

  if (!tabEntries.length) {
    return (
      <View style={[styles.wrapper, containerStyle, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.brandColor} />
      </View>
    );
  }

  const renderTabScreen = (config: TabConfig, tabName: string) => {
    if (isDetailScreen && config.component) {
      return React.createElement(config.component, {
        ...config.params,
        isLoading,
      });
    }
    if (screenComponent) {
      return React.createElement(screenComponent, {
        status: config.status,
        accStageGroups: config.accStageGroups,
        currentTab: tabName,
        isLoading,
        ...config,
      });
    }
    return <View />;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Tab.Navigator
        initialRouteName={currentTab}
        screenOptions={{
          tabBarStyle: {
            elevation: 4,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            height: 50,
            borderBottomWidth: 0,
            backgroundColor: theme.colors.card,
            ...tabBarStyle,
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.brandColor,
            height: 2,
            borderRadius: 2,
          },
          tabBarLabelStyle: {
            textTransform: "uppercase",
            fontSize: 10,
            fontWeight: "600",
            flexWrap: "nowrap",
            paddingHorizontal: 2,
            marginTop: 0,
            marginBottom: 0,
          },
          tabBarItemStyle: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 8,
            minHeight: 60,
            flexDirection: "row",
          },
          tabBarScrollEnabled: tabEntries.length > 4,
          tabBarActiveTintColor: theme.colors.brandColor,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarPressColor: theme.colors.brandColor + "15",
          lazy: true,
          tabBarShowIcon: true,
        }}
        screenListeners={({ route }) => ({
          focus: () => currentTabSetter?.(route.name),
        })}
      >
        {tabEntries.map(([tabName, config]) => (
          <Tab.Screen
            key={tabName}
            name={tabName}
            options={{
              tabBarLabel:
                config.label ||
                `${tabName}${
                  config.count !== undefined ? ` (${config.count})` : ""
                }`,
              tabBarIcon: ({ focused, color }) => {
                if (config.icon) {
                  return (
                    <Ionicons
                      name={config.icon as any}
                      size={18}
                      color={color}
                    />
                  );
                }
                return <View />;
              },
            }}
            children={() => renderTabScreen(config, tabName)}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  loadingContainer: { justifyContent: "center", alignItems: "center" },
});

export default CustomMaterialTopTab;
