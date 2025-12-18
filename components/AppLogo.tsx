import React from "react";
import { View, Image, StyleSheet, ImageStyle, ViewStyle } from "react-native";

interface AppLogoProps {
  size?: number;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 280, style, imageStyle }) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require("../assets/app/canLogo4.png")}
        style={[styles.logo, { width: size, height: size }, imageStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 280,
    height: 100,
  },
});

export default AppLogo;
