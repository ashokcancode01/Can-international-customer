import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { NavigationProp } from "@react-navigation/native";
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  AntDesign,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import ThemedText from "@/components/themed/ThemedText";

interface DashboardScreenProps {
  navigation: NavigationProp<any>;
}

const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} />}
        >
          <ThemedText>
            
          </ThemedText>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 10,
  },
});

export default DashboardScreen;
