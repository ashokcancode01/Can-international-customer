import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
// import {  FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeProvider";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { selectIsAuthenticated } from "../../store/auth/authSlice";
import { useLogoutMutation } from "../../store/auth/authApi";
import {
  useChangeProfileImageMutation,
  useGetProfileByIdQuery,
} from "../../store/slices/profile";
import {
  useDeleteFromDoSpaceMutation,
  useUploadToDoSpaceMutation,
} from "../../store/slices/doSpace";
import { toastManager } from "../../utils/toastManager";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../types/publicTypes";


type MenuScreenNavigationProp = NativeStackNavigationProp<PublicStackParamList>;

const MenuScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const {
    data: profileRes,
    refetch: refetchProfile,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useGetProfileByIdQuery();

  const [uploadDoSpace] = useUploadToDoSpaceMutation();
  const [deleteDoSpace] = useDeleteFromDoSpaceMutation();
  const [updateProfile] = useChangeProfileImageMutation();


  const isInitialLoading = isProfileFetching || isProfileLoading;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetchProfile();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchProfile]);

  const handleUpdateImage = useCallback(
    async (profileImage: any) => {
      if (!profileImage) return;
      try {
        setIsUpdatingImage(true);

        const uploadRes = await uploadDoSpace({
          file: {
            uri: profileImage?.uri,
            name: profileImage?.name || "Profile-image",
            type: profileImage?.mimeType,
          },
          accountId: "Customer",
          filePath: `${profileRes?.typeRef}/user`,
        }).unwrap();

        await updateProfile({
          _id: profileRes?._id || "",
          avatar: {
            ...uploadRes,
            url: uploadRes?.url,
            type: uploadRes?.type || profileImage?.type,
          },
        }).unwrap();

        if (profileRes?.avatar?.publicId) {
          await deleteDoSpace({
            accountId: "Customer",
            publicId: profileRes?.avatar.publicId,
          }).unwrap();
        }

        toastManager.success("Success", "Profile photo updated successfully");
      } catch (err) {
        console.error("Update image error:", err);
        toastManager.error("Error", "Failed to update profile photo");
      } finally {
        setIsUpdatingImage(false);
      }
    },
    [profileRes, deleteDoSpace, uploadDoSpace, updateProfile]
  );

  const pickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toastManager.error(
        "Permission",
        "Permission to access media library is required"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      handleUpdateImage(result.assets[0]);
    }
  }, [handleUpdateImage]);

  const handleLogisticsNavigation = (title: string) => {
    switch (title) {
      case "Track Order":
        navigation.navigate("QRScanner");
        break;
      case "Switch Theme":
        navigation.navigate("Appearance");
        break;
      case "About Us":
        navigation.navigate("AboutUs");
        break;
      case "Our Branches":
        navigation.navigate("OurBranches");
        break;
      case "FAQs":
        navigation.navigate("FAQs");
        break;
      case "Why Choose Us":
        navigation.navigate("WhyChooseUs");
        break;
      case "Career":
        Linking.openURL("https://bayupayu.com/vacancy/NCG?page=1").catch(err =>
        console.error("Failed to open URL:", err)
      );
        break;
      case "Terms & Conditions":
        navigation.navigate("TermsAndConditions");
        break;
      default:
    }
  };


  const submenuNavigationMap: Record<string, string> = {
    "Air Freight": "AirFreight",
    "Ocean Freight": "OceanFreight",
    "Land Transport": "LandTransport",
    "Customs Clearance": "CustomsClearance",
    "24/7 Customer Support": "CustomerSupport",
    "Real-Time Tracking": "RealTimeTracking",
  };

  // const handleSignInPress = () => navigation.getParent()?.navigate("Auth");
  // const handleRegisterPress = () => navigation.getParent()?.navigate("Auth");

  const handleSignOut = async () => {
    try {
      await logout().unwrap();
      toastManager.success("Logged Out", "Successfully signed out");
    } catch (err) {
      console.error("Logout error:", err);
      toastManager.error("Error", "Failed to sign out");
    }
  };

  if (isInitialLoading && isAuthenticated) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.brandColor}
          style={styles.loader}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.brandColor || "#dc1e3e"]}
            tintColor={theme.colors.brandColor || "#dc1e3e"}
          />
        }
      >
        {/* Welcome */}
        {/* <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeSubtitle, { color: theme.colors.textSecondary }]}>
            Hello, Welcome to CAN International!
          </Text>
        </View> */}

        {/* Auth Buttons */}
        {/* <View style={styles.authSection}>
          <View style={styles.authButtonsRow}>
            <TouchableOpacity
              style={[styles.authButton, { backgroundColor: theme.colors.brandColor }]}
              onPress={handleSignInPress}
            >
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authButton, { borderWidth: 1, borderColor: theme.colors.brandColor }]}
              onPress={handleRegisterPress}
            >
              <Text style={[styles.registerButtonText, { color: theme.colors.brandColor }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}
        {/* Profile Card */}
        {/* <View style={[styles.profileCard, { backgroundColor: theme.colors.card, marginTop: 12 }]}>
          <View style={styles.profileRow}>
            <View style={[styles.profileIconContainer, { backgroundColor: theme.colors.brandColor + "20" }]}>
              <Ionicons name="person-outline" size={30} color=theme.colors.brandColor />
            </View>

            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>Alex Johnson</Text>
              <Text style={[styles.profileSubtitle, { color: theme.colors.textSecondary }]}>Verified customer</Text>
            </View>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: theme.colors.brandColor }]}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Accounts & Activity Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.card, marginTop: 12 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Accounts & Activity
          </Text>
          {[
            // { title: "Profile Settings", subtitle: "Address, Payment, Security", icon: "person-outline", color: theme.colors.brandColor },
            { title: "Track Order", subtitle: "Track your orders using QR codes", icon: "qr-code-outline", color: theme.colors.brandColor},
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionItem, { backgroundColor: theme.colors.card }]}
              onPress={() => handleLogisticsNavigation(item.title)}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: item.color + "12" }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{item.title}</Text>
                <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
              </View>
              <View style={[styles.chevronContainer, { backgroundColor: theme.colors.background + "50" }]}>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.text} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Features Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.card, marginTop: 12 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Other Features
          </Text>
          {[
            { title: "Switch Theme", subtitle: "Change app appearance", icon: "moon-outline", color: theme.colors.brandColor },
            { title: "About Us", subtitle: "Company overview and mission", icon: "information-circle-outline", color: theme.colors.brandColor },
            { title: "Our Branches", subtitle: null, icon: "location-outline", color: theme.colors.brandColor },
            { title: "Our Services", subtitle: null, icon: "briefcase-outline", color: theme.colors.brandColor, isDropdown: true },
            { title: "FAQs", subtitle: null, icon: "help-circle-outline", color: theme.colors.brandColor },
            { title: "Why Choose Us", subtitle: null, icon: "shield-checkmark-outline", color: theme.colors.brandColor },
            { title: "Career", subtitle: null, icon: "briefcase-outline", color: theme.colors.brandColor },
            { title: "Terms & Conditions", subtitle: null, icon: "document-text-outline", color: theme.colors.brandColor },

          ].map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={[styles.actionItem, { backgroundColor: theme.colors.card }]}
                onPress={() => {
                  if (item.isDropdown) {
                    setServicesDropdownOpen(prev => !prev);
                  } else {
                    handleLogisticsNavigation(item.title);
                  }
                }}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: item.color + "12" }]}>
                  <Ionicons name={item.icon as any} size={18} color={item.color} />
                </View>
                <View style={[styles.actionContent, !item.subtitle && { justifyContent: "center" }]}>
                  <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{item.title}</Text>
                  {item.subtitle && (
                    <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
                  )}
                </View>
                <View style={[styles.chevronContainer, { backgroundColor: theme.colors.background + "50" }]}>
                  <Ionicons
                    name={item.isDropdown ? (servicesDropdownOpen ? "chevron-up" : "chevron-down") : "chevron-forward"}
                    size={16}
                    color={theme.colors.text}
                  />
                </View>
              </TouchableOpacity>

              {/* Dropdown submenu */}
              {item.isDropdown && servicesDropdownOpen && (
                <View style={{ marginBottom: 8, paddingLeft: 10 }}>
                  {[
                    { title: "Air Freight", subtitle: null, icon: "airplane-outline", color: theme.colors.brandColor },
                    { title: "Ocean Freight", subtitle: null, icon: "water-outline", color: theme.colors.brandColor },
                    { title: "Land Transport", subtitle: null, icon: "bus-outline", color: theme.colors.brandColor },
                    { title: "Customs Clearance", subtitle: null, icon: "document-text-outline", color: theme.colors.brandColor },
                    { title: "24/7 Customer Support", subtitle: null, icon: "headset-outline", color: theme.colors.brandColor },
                    { title: "Real-Time Tracking", subtitle: null, icon: "locate-outline", color: theme.colors.brandColor},
                  ].map((subItem, subIndex) => {
                    const screenName = submenuNavigationMap[subItem.title]; 
                    return (
                      <TouchableOpacity
                        key={subIndex}
                        style={[styles.actionItem, { backgroundColor: theme.colors.card }]}
                        onPress={() => {
                          if (screenName) navigation.navigate<any>(screenName);
                        }}
                      >
                        <View style={[styles.actionIconContainer, { backgroundColor: subItem.color + "12" }]}>
                          <Ionicons name={subItem.icon as any} size={18} color={subItem.color} />
                        </View>
                        <View style={styles.actionContent}>
                          <Text style={[styles.actionTitle, { color: theme.colors.text }]}>{subItem.title}</Text>
                        </View>
                        <View style={[styles.chevronContainer, { backgroundColor: theme.colors.background + "50" }]}>
                          <Ionicons name="chevron-forward" size={16} color={theme.colors.text} />
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}


            </View>
          ))}

        </View>

        {/* Logout */}
        {/* <TouchableOpacity
          style={[styles.logoutCard, { backgroundColor: theme.colors.brandColor, marginTop: 12 }]}
          onPress={() =>
            Alert.alert(
              "Log out Confirmation",
              "Are you sure you want to log out?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Log out", onPress: handleSignOut, style: "destructive" },
              ],
              { cancelable: true }
            )
          }
          disabled={isLoggingOut}
        >
          <View style={styles.logoutContent}>
            <Text style={[styles.logoutTitle, { color: "#fff" }]}><Ionicons name="log-out-outline" size={20} color="#fff" />  Log out</Text>
          </View>
        </TouchableOpacity> */}

        {/* Footer Section */}
        {/* <View style={styles.footerContainer}>
          <FontAwesome5 name="truck" size={25} color={theme.colors.textSecondary} />
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            CAN International Logistic
          </Text>
          <Text style={[styles.footerVersion, { color: theme.colors.textSecondary }]}>
            Version 21.0
          </Text>
        </View> */}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    fontWeight: "700",
  },
  authSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  authButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  authButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  authButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
    fontWeight: "600",
  },
  registerButtonText: {
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
    fontWeight: "600",
  },
  profileCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    fontWeight: "700",
  },
  profileSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Montserrat-SemiBold",
    fontWeight: "600",
  },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Montserrat-Bold",
    fontWeight: "700",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginBottom: 8,
  },
  actionIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
    fontWeight: "600",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 11,
    fontFamily: "Montserrat-Medium",
    fontWeight: "500",
  },
  chevronContainer: {
    width: 25,
    height: 25,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSpacer: {
    height: 20,
  },
  logoutCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF572220",
  },
  logoutContent: {
    flex: 1,
    alignItems: "center"
  },
  logoutTitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    fontWeight: "700",
    marginBottom: 2,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 10,
    fontFamily: "Montserrat-Medium",
    marginTop: 6,
  },
  footerVersion: {
    fontSize: 8,
    fontFamily: "Montserrat-Medium",
    marginTop: 2,
  },

});

export default MenuScreen;
