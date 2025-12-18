import React from "react";
import { Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { useLogoutMutation } from "../store/auth/authApi";
import { toastManager } from "../utils/toastManager";

interface LogoutButtonProps {
  label?: string;
  style?: object;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  label = "Logout",
  style,
}) => {
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toastManager.success(
        "Logged Out",
        "You have been successfully logged out"
      );
    } catch (error) {
      // Logout always succeeds locally even if API fails
      toastManager.success(
        "Logged Out",
        "You have been successfully logged out"
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.logoutButton, style]}
      onPress={handleLogout}
      disabled={isLoading}
    >
      <Text style={styles.logoutButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: "#d9534f",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LogoutButton;
