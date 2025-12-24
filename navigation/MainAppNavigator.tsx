// import React, { useState, useCallback, useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
// import { useNavigation, } from "@react-navigation/native";
// import { useSelector } from "react-redux";
// import { selectIsAuthenticated } from "../store/auth/authSlice";
// import { StorageService } from "../utils/storageService";
// import { tabCountManager } from "../utils/tabCountManager";
import { PublicStackParamList, PublicTabParamList } from "../types/publicTypes";
import DashboardScreen from "@/screens/Home/DashboardScreen";
import MenuScreen  from "@/screens/Menu/MenuScreen";
import AppearanceScreen from "@/screens/Menu/components/AppearanceScreen";
// import QRScannerScreen from "@/screens/Menu/components/TrackOrder";
import TrackOrderScreen from "@/screens/Menu/components/TrackOrder";
import TrustedProvidersScreen from "@/screens/Home/components/TrustedProviders";
import PricingScreen from "@/screens/Pricing/PricingScreen";
import AboutUs from "@/screens/Menu/components/AboutUs";
import FAQs from "@/screens/Menu/components/FAQs";
import AirFreight from "@/screens/Menu/components/OurServices/AirFreight";
import OceanFreight from "@/screens/Menu/components/OurServices/OceanFreight";
import LandTransport from "@/screens/Menu/components/OurServices/LandTransport";
import CustomsClearance from "@/screens/Menu/components/OurServices/CustomsClearance";
import CustomerSupport from "@/screens/Menu/components/OurServices/CustomerSupport";
import RealTimeTracking from "@/screens/Menu/components/OurServices/RealTimeTracking";
import ContactScreen from "@/screens/Contact/ContactScreen";
import More from "@/screens/Menu/components/More";

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
  Contact: {
    focused: "call",
    unfocused: "call-outline",
    title: "Contact",
  },
  Menu: {
    focused: "menu",
    unfocused: "menu-outline",
    title: "Menu",
  },
};

const MainTabNavigator = () => {
  const { theme } = useTheme();
  // const navigation = useNavigation();

  // Fixed tabs: Home, Pricing, TrackOrder, Menu
  const visibleTabs = ["Home", "Pricing", "TrackOrder", "Contact","Menu"];

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
                ? PricingScreen
                : name === "TrackOrder"
                ? TrackOrderScreen
                : name === "Menu"
                ? MenuScreen
                : name === "Contact"
                ? ContactScreen
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
          headerStyle: { backgroundColor: theme.colors.cardBackground },
          headerTintColor: theme.dark ? "#fff" : theme.colors.text,
          headerTitleStyle: { fontWeight: "600", fontSize: 15, color: theme.dark ? "#fff" : theme.colors.text },
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
                {/* Back icon adjusts for dark theme */}
                <AntDesign name="arrow-left" size={16} color={theme.dark ? "#fff" : "black"} />
              </TouchableOpacity>
              <Text style={{ fontWeight: "500", fontSize: 15, color: theme.dark ? "#fff" : theme.colors.text }}>
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
        <Stack.Screen
          name="Appearance"
          component={AppearanceScreen}
          options={{ title: "Appearance" }}
        />
        <Stack.Screen
          name="QRScanner"
          component={TrackOrderScreen}
          options={{ title: "Track Order"}}
        />
        <Stack.Screen
          name="OurTrustedProviders"
          component={TrustedProvidersScreen}
          options={{ title: "Our Trusted Providers"}}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{ title: "About Us"}}
        />
        <Stack.Screen
          name="FAQs"
          component={FAQs}
          options={{ title: "FAQs"}}
        />
        <Stack.Screen
          name="AirFreight"
          component={AirFreight}
          options={{ title: "Air Freight"}}
        />
        <Stack.Screen
          name="OceanFreight"
          component={OceanFreight}
          options={{ title: "Ocean Freight"}}
        />
        <Stack.Screen
          name="LandTransport"
          component={LandTransport}
          options={{ title: "Land Transport"}}
        />
        <Stack.Screen
          name="CustomsClearance"
          component={CustomsClearance}
          options={{ title: "Customs Clearance"}}
        />
        <Stack.Screen
          name="CustomerSupport"
          component={CustomerSupport}
          options={{ title: " 24/7 Customer Support"}}
        />
        <Stack.Screen
          name="RealTimeTracking"
          component={RealTimeTracking}
          options={{ title: "Real-Time Tracking"}}
        />
        <Stack.Screen
          name="More"
          component={More}
          options={{ title: "Why Choose Us"}}
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
