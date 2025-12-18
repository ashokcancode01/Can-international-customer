import React, { useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface AnimatedTabBarProps extends BottomTabBarProps {
  scrollY: Animated.Value;
}

const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  state,
  descriptors,
  navigation,
  scrollY,
}) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const currentScrollValue = value;
      const scrollDirection =
        currentScrollValue > (scrollY as any)._previousValue ? "down" : "up";

      if (scrollDirection === "down" && currentScrollValue > 100) {
        // Hide tab bar when scrolling down
        Animated.timing(translateY, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (scrollDirection === "up" || currentScrollValue <= 50) {
        // Show tab bar when scrolling up or near top
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }

      (scrollY as any)._previousValue = currentScrollValue;
    });

    return () => {
      scrollY.removeListener(listener);
    };
  }, [scrollY, translateY]);

  const TAB_CONFIG = {
    Home: { focused: "home", unfocused: "home-outline", title: "Home" },
    Categories: {
      focused: "grid",
      unfocused: "grid-outline",
      title: "Categories",
    },
    Favorites: {
      focused: "heart",
      unfocused: "heart-outline",
      title: "Favorites",
    },
    Cart: { focused: "bag", unfocused: "bag-outline", title: "Cart" },
    Account: {
      focused: "person",
      unfocused: "person-outline",
      title: "Account",
    },
    Profile: {
      focused: "person",
      unfocused: "person-outline",
      title: "Profile",
    },
  };

  const styles = getStyles(theme);

  return (
    <Animated.View
      style={[
        styles.tabBarContainer,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];
          const iconName = config
            ? isFocused
              ? config.focused
              : config.unfocused
            : isFocused
            ? "ellipse"
            : "ellipse-outline";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={`tab-${route.name}`}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <View
                style={[
                  styles.tabContent,
                  isFocused && styles.focusedTabContent,
                ]}
              >
                <Ionicons
                  name={iconName as any}
                  size={22}
                  color={
                    isFocused ? theme.colors.brandColor : theme.colors.disabled
                  }
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused
                        ? theme.colors.brandColor
                        : theme.colors.disabled,
                      fontWeight: isFocused ? "600" : "500",
                    },
                  ]}
                >
                  {typeof label === "string"
                    ? label
                    : config?.title || route.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const { width } = Dimensions.get("window");

const getStyles = (theme: any) =>
  StyleSheet.create({
    tabBarContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "transparent",
      paddingBottom: 2,
      paddingHorizontal: 16,
    },
    tabBar: {
      flexDirection: "row",
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      borderRadius: 25,
      marginBottom: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    tabItem: {
      flex: 1,
      paddingVertical: 8,
    },
    tabContent: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 4,
      borderRadius: 20,
    },
    focusedTabContent: {
      backgroundColor: theme.colors.brandColor + "15",
    },
    tabLabel: {
      fontSize: 10,
      fontFamily: "Montserrat-Medium",
      marginTop: 2,
    },
  });

export default AnimatedTabBar;
