import {
  View,
  Animated,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import React from "react";
import { useTheme } from "@/theme/ThemeProvider";
import {
  NotificationItem,
  useEditAllNotificationsMutation,
  useEditNotificationMutation,
} from "@/store/slices/notifications";
import ThemedText from "./themed/ThemedText";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface NotificationModalProps {
  notificationModalOpen: boolean;
  setNotificationModalOpen: any;
  notificationsList: any;
  notificationCategory: string;
  setNotificationCategory: any;
}

const NotificationModal = ({
  notificationModalOpen,
  setNotificationModalOpen,
  notificationsList,
  notificationCategory,
  setNotificationCategory,
}: NotificationModalProps) => {
  const { theme } = useTheme();

  const storedUser = useSelector((state: RootState) => state.auth.userData);

  const translateY = React.useRef(new Animated.Value(300)).current;
  const animationConfig = React.useMemo(
    () => ({
      duration: 400,
      friction: 10,
      tension: 60,
      useNativeDriver: true,
    }),
    []
  );

  const navigation = useNavigation();

  const [markAsRead] = useEditNotificationMutation();
  const [markAllAsRead] = useEditAllNotificationsMutation();

  React.useEffect(() => {
    if (notificationModalOpen) {
      Animated.spring(translateY, {
        toValue: 0,
        ...animationConfig,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: 300,
        ...animationConfig,
      }).start();
    }
  }, [notificationModalOpen]);

  const getTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const handleNotificationClick = async (
    notificationId?: string,
    sourceModel?: string,
    sourceRef?: string
  ) => {
    if (!notificationId) return;

    switch (sourceModel) {
      case "User":
        (navigation.navigate as any)("Profile");
    }

    await markAsRead(notificationId);
    setNotificationModalOpen(false);
  };

  const handleReadAllNotifications = async () => {
    await markAllAsRead();
    setNotificationModalOpen(false);
  };

  const renderNotifications = ({
    item,
    index,
  }: {
    item: NotificationItem;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      key={item?._id}
      onPress={() =>
        handleNotificationClick(item?._id, item.sourceModel, item.sourceRef)
      }
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationIconContainer}>
          <Feather
            name={item.sourceModel === "User" ? "user" : "bell"}
            size={20}
            color={theme.colors.brandColor}
          />
        </View>
        <View style={styles.notificationTextContainer}>
          <ThemedText style={styles.notificationText}>
            {item?.message}
          </ThemedText>
          <View style={styles.notificationFooter}>
            <ThemedText style={styles.timeText}>
              {getTimeAgo(item.createdAt)}
            </ThemedText>
            {item?.readBy?.includes(storedUser?._id!) ||
              (!item?.isInReadByField && <View style={styles.unreadDot} />)}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const emptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="bell-off" size={60} color={theme.colors.placeholder} />
      <ThemedText style={styles.emptyText}>No Notifications Yet</ThemedText>
      <ThemedText style={styles.emptySubText}>
        We'll let you know when something new happens!
      </ThemedText>
    </View>
  );

  return (
    <Modal
      transparent={true}
      visible={notificationModalOpen}
      onRequestClose={() => setNotificationModalOpen(false)}
    >
      <TouchableOpacity
        style={styles.modalBackground}
        onPress={() => setNotificationModalOpen(false)}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.background, theme.colors.background + "F2"]}
            style={styles.modalGradient}
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Feather
                  name="bell"
                  size={20}
                  color={theme.colors.brandColor}
                />
                <ThemedText style={styles.headerTitle}>
                  Notifications
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={handleReadAllNotifications}
                disabled={
                  !notificationsList?.data?.filter(
                    (f: any) => !f?.isInReadByField
                  )?.length
                }
                style={styles.markAllButton}
              >
                <LinearGradient
                  colors={
                    notificationsList?.data?.filter(
                      (f: any) => !f?.isInReadByField
                    )?.length
                      ? [
                          theme.colors.brandColor,
                          theme.colors.brandColor + "CC",
                        ]
                      : ["#cccccc", "#cccccc"]
                  }
                  style={styles.markAllGradient}
                >
                  <Feather
                    name="check-circle"
                    size={18}
                    color={
                      notificationsList?.data?.filter(
                        (f: any) => !f?.isInReadByField
                      )?.length
                        ? "#ffffff"
                        : theme.colors.placeholder
                    }
                  />
                  <ThemedText style={styles.markAllText}>
                    Mark All as Read
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.toggleContainer}>
              {["All", "Unread"].map((cat, index) => (
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    {
                      backgroundColor:
                        notificationCategory === cat
                          ? theme.colors.brandColor
                          : "transparent",
                    },
                  ]}
                  onPress={() => setNotificationCategory(cat)}
                  key={index}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    style={[
                      styles.toggleText,
                      {
                        color:
                          notificationCategory === cat
                            ? "#ffffff"
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {cat}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <FlatList
              data={notificationsList?.data}
              renderItem={renderNotifications}
              ListEmptyComponent={emptyComponent}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modal: {
    height: "70%",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  modalGradient: {
    flex: 1,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
  },
  markAllButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  markAllGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  markAllText: {
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 8,
    color: "#fff",
  },
  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 24,
    overflow: "hidden",
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 18,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  notificationItem: {
    marginHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(151, 151, 151, 0.59)",
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 10,
    fontWeight: "500",
  },
  notificationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
    color: "#888",
    fontWeight: "500",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    color: "#666",
  },
  emptySubText: {
    fontSize: 15,
    fontWeight: "400",
    marginTop: 8,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  listContent: {
    paddingBottom: 60,
  },
});
