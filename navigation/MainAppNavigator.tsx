import React, { useState, useCallback, useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/auth/authSlice";
import { StorageService } from "../utils/storageService";
import { tabCountManager } from "../utils/tabCountManager";
import { PublicStackParamList, PublicTabParamList } from "../types/publicTypes";
import DashboardScreen from "@/screens/Home/DashboardScreen";
import MenuScreen from "@/screens/Menu/MenuScreen";

const Tab = createBottomTabNavigator<PublicTabParamList>();
const Stack = createNativeStackNavigator<PublicStackParamList>();

const TAB_CONFIG = {
  Home: { focused: "home", unfocused: "home-outline", title: "Home" },
  Pricing: {
    focused: "pricetag",
    unfocused: "pricetag-outline",
    title: "Pricing",
  },
  TrackOrder: {
    focused: "time",
    unfocused: "time-outline",
    title: "Track Order",
  },
  Menu: {
    focused: "menu",
    unfocused: "menu-outline",
    title: "Menu",
  },
};

const MainTabNavigator = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  // Fixed tabs: Home, Pricing, TrackOrder, Menu
  const visibleTabs = ["Home", "Pricing", "TrackOrder", "Menu"];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const config = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];

          // Use favicon for Home tab
          if (route.name === "Home") {
            return (
              <Image
                source={require("../assets/app/favicon.png")}
                style={{ width: size, height: size, tintColor: color }}
                resizeMode="contain"
              />
            );
          }

          const iconName = focused ? config.focused : config.unfocused;
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: theme.colors.cardBackground,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 2,
          paddingTop: 3,
          height: 55,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "500" },
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brandColor,
        tabBarInactiveTintColor: theme.colors.disabled,
      })}
    >
      {visibleTabs.map((name) => {
        const config = TAB_CONFIG[name as keyof typeof TAB_CONFIG];

        return (
          <Tab.Screen
            key={name}
            name={name as keyof PublicTabParamList}
            component={
              name === "Home"
                ? DashboardScreen
                : name === "Pricing"
                ? DashboardScreen
                : name === "TrackOrder"
                ? DashboardScreen
                : name === "Menu"
                ? MenuScreen
                : DashboardScreen
            }
            options={{
              title: config.title,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const MainAppNavigator = () => {
  const { theme } = useTheme();
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "red" },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { fontWeight: "600", fontSize: 15 },
          header: ({ navigation, route, options, back }) => (
            <View
              style={{
                height: 50,
                backgroundColor: theme.colors.cardBackground,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                justifyContent: "flex-start",
                borderBottomWidth: 0.5,
                borderBottomColor: theme.colors.border,
              }}
            >
              <TouchableOpacity
                style={{
                  height: "100%",
                  justifyContent: "center",

                  width: 30,
                  alignItems: "center",
                }}
                onPress={() => navigation.goBack()}
              >
                <AntDesign name="arrow-left" size={16} color="black" />
              </TouchableOpacity>
              <Text style={{ fontWeight: "500", fontSize: 15 }}>
                {options.title ?? route.name}
              </Text>
            </View>
          ),
        }}
      >
        <Stack.Screen
          name="PublicTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="CampaignDetail"
          component={CampaignDetailScreen}
          options={({ route }: any) => ({
            title: route.params?.campaignTitle || "Campaign Details",
          })}
        />
        <Stack.Screen
          name="TrackOrder"
          component={ProductDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PriceList"
          component={AllReviews}
          options={{ headerShown: true }}
        /> */}
      </Stack.Navigator>
    </>
  );
};

export default MainAppNavigator;
