import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import ThemedText from "@/components/themed/ThemedText";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedTouchableOpacity }from "@/components/themed/ThemedTouchableOpacity";


interface SectionCardProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  viewAll?: boolean;
  onViewAllPress?: () => void;
  viewAllIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  subtitle,
  children,
  viewAll = false,
  onViewAllPress,
  viewAllIcon,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      {(icon || title) && (
        <View style={styles.headerWrapper}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              {icon && <View>{icon}</View>}
              {title && (
                <ThemedText style={[styles.title, { color: theme.colors.text, marginLeft: 8 }]}>
                  {title}
                </ThemedText>
              )}
            </View>
            {viewAll && (
              <ThemedTouchableOpacity
                onPress={onViewAllPress}
                style={[styles.viewAllButton, { backgroundColor: theme.colors.brandColor! }]}
              >
                <ThemedText style={styles.viewAllText}>View All</ThemedText>
                {viewAllIcon}
              </ThemedTouchableOpacity>
            )}
          </View>

          {/* Subtitle */}
          {subtitle && (
            <ThemedText style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      )}

      {/* Card / Content */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 30,
    marginBottom: 30,
  },
  headerWrapper: {
    marginBottom: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 16,
  },
  viewAllText: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    fontSize: 10,
    marginRight: 6,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default SectionCard;
