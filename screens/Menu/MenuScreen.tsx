import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeProvider";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { selectIsAuthenticated } from "../../store/auth/authSlice";
import { useLogoutMutation } from "../../store/auth/authApi";
import {
  useChangeProfileImageMutation,
  useGetCustomerByIdQuery,
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

  // State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  // RTK Query hooks for profile data
  const {
    data: profileRes,
    refetch: refetchProfile,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useGetProfileByIdQuery();

  const { data: customerRes, isLoading: isCustomerLoading } =
    useGetCustomerByIdQuery(profileRes?.typeRef || "", {
      skip: !profileRes?.typeRef,
    });

  const [uploadDoSpace] = useUploadToDoSpaceMutation();
  const [deleteDoSpace] = useDeleteFromDoSpaceMutation();
  const [updateProfile] = useChangeProfileImageMutation();

  const defaultAvatarPath = require("../../assets/images/defaultUser.png");

  const isInitialLoading =
    isProfileFetching ||
    isRefreshing ||
    isProfileLoading ||
    (profileRes?.typeRef && isCustomerLoading);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetchProfile();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchProfile]);

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

  const handleUpdateImage = async (profileImage: any) => {
    if (!profileImage) return;

    try {
      setIsUpdatingImage(true);
      if (profileRes?.avatar) {
        await deleteDoSpace({
          accountId: "Customer",
          publicId: profileRes?.avatar?.publicId,
        }).unwrap();
      }

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

      toastManager.success("Success", "Profile photo updated successfully");
    } catch (error) {
      console.error("Update image error:", error);
      toastManager.error("Error", "Failed to update profile photo");
    } finally {
      setIsUpdatingImage(false);
    }
  };

  // Navigation handlers
  const handleLogisticsNavigation = (title: string) => {
    switch (title) {
      case "Track Order":
        navigation.navigate("QRScanner");
        break;
      case "Logistic Order":
        navigation.navigate("Appearance");
        break;
    }
  };

  const handleSignInPress = () => {
    navigation.getParent()?.navigate("Auth");
  };
  const handleRegisterPress = () => {
    navigation.getParent()?.navigate("Auth");
  };

  const handleSignOut = async () => {
    try {
      await logout().unwrap();
      toastManager.success("Logged Out", "Successfully signed out");
    } catch (error) {
      toastManager.success("Logged Out", "Successfully signed out");
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
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
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
      <View style={styles.welcomeSection}>
        <Text
          style={[
            styles.welcomeSubtitle,
            { color: theme.colors.textSecondary },
          ]}
        >
          Hello, Welcome to CAN International !
        </Text>
      </View>

      <View style={styles.authSection}>
        <View style={styles.authButtonsRow}>
          <TouchableOpacity
            style={[
              styles.authButton,
              { backgroundColor: theme.colors.brandColor },
            ]}
            onPress={handleSignInPress}
          >
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.authButton,
              {
                borderWidth: 1,
                borderColor: theme.colors.brandColor,
              },
            ]}
            onPress={handleRegisterPress}
          >
            <Text
              style={[
                styles.registerButtonText,
                {
                  color: theme.colors.brandColor,
                },
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.featuresSection}>
        <View style={styles.actionsList}>
          {[
            {
              title: "Track Order",
              subtitle: "Track your orders using QR codes",
              icon: "qr-code-outline",
              color: "#9C27B0",
            },
            {
              title: "Switch Theme",
              subtitle: "Change app appearance",
              icon: "moon-outline",
              color: "#9C27B0",
              actionType: "Switch Theme",
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionItem,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: "rgba(0, 0, 0, 0.05)",
                },
              ]}
              onPress={() => handleLogisticsNavigation(item.title)}
            >
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: item.color + "12" },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={item.color}
                />
              </View>
              <View style={styles.actionContent}>
                <Text
                  style={[styles.actionTitle, { color: theme.colors.text }]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    styles.actionSubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {item.subtitle}
                </Text>
              </View>
              <View
                style={[
                  styles.chevronContainer,
                  { backgroundColor: theme.colors.background + "50" },
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={theme.colors.text}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={[styles.logoutCard, { backgroundColor: theme.colors.card }]}
          onPress={() => {
            Alert.alert(
              "Log out Confirmation",
              "Are you sure you want to log out?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Log out",
                  onPress: handleSignOut,
                  style: "destructive",
                },
              ],
              { cancelable: true }
            );
          }}
          disabled={isLoggingOut}
        >
          <View
            style={[
              styles.logoutIconContainer,
              { backgroundColor: "#FF5722" + "15" },
            ]}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF5722" />
          </View>
          <View style={styles.logoutContent}>
            <Text style={[styles.logoutTitle, { color: "#FF5722" }]}>
              Log out
            </Text>
            <Text
              style={[
                styles.logoutSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Sign out of your account
            </Text>
          </View>
          <View
            style={[
              styles.chevronContainer,
              { backgroundColor: theme.colors.background + "50" },
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.text}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingTop: 20,
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
  featuresSection: {
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: "Montserrat-Medium",
    fontWeight: "500",
    marginBottom: 16,
  },
  actionsList: {
    gap: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
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
  // Logout section styles
  logoutSection: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    marginTop: 10,
  },
  logoutCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF572220",
  },
  logoutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoutContent: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    fontWeight: "700",
    marginBottom: 2,
  },
  logoutSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    fontWeight: "500",
  },
});

export default MenuScreen;
