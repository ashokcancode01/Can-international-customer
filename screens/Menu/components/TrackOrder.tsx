import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PublicStackParamList } from "../../../types/publicTypes";
import ThemedText from "@/components/themed/ThemedText";

type TrackOrderNavigationProp = NativeStackNavigationProp<PublicStackParamList>;

const TrackOrderScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<TrackOrderNavigationProp>();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ThemedText style={{ color: theme.colors.text }}>
        QR Scanner Screen
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TrackOrderScreen;
