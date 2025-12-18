import { View, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import ThemedView from "@/components/themed/ThemedView";
import ThemedText from "@/components/themed/ThemedText";
import { useTheme } from "@/theme/ThemeProvider";
import { useSelector } from "react-redux";
import { RootState, store } from "@/store/store";
import ThemedIcon from "@/components/themed/ThemedIcon";
import { MaterialIcons } from "@expo/vector-icons";
import CustomEmptyMessage from "@/components/custom/CustomEmptyMessage";
import { formatDateAndTime, formatDateNameOnly } from "@/utils/dateTime";

const HistorySection = ({
  data,
  onRefresh,
}: {
  data: any;
  onRefresh?: () => Promise<void>;
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();

  const colors = theme.colors;

  const allData = data?.history || data?.comment || data;

  const groupedByMonth = allData?.reduce((acc: any, item: any) => {
    const month = item.createdAt.slice(0, 7);
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(item);
    return acc;
  }, {});

  const sortedData = Object.entries(groupedByMonth)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([month, items]) => [
      month,
      (items as any).sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    ]);

  const handleRefresh = async () => {
    if (!onRefresh) return;

    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  if (!allData.length) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <CustomEmptyMessage
          imageHeight={100}
          imageWidth={100}
          message="No history data to show."
          onRefresh={onRefresh ? handleRefresh : undefined}
        />
      </ThemedView>
    );
  }

  const renderCard = ({ item }: any) => (
    <ThemedView style={{ marginBottom: 10 }}>
      <ThemedText type="cardHeader" style={{ fontSize: theme.fontSizes.sm }}>
        {formatDateNameOnly(new Date(item[0]))}
      </ThemedText>
      <View>
        {item[1].map((i: any, index: number) => (
          <TimelineCard item={i} key={index} />
        ))}
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={sortedData || []}
        renderItem={renderCard}
        style={{ padding: 10 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.brandColor]}
            tintColor={colors.brandColor}
          />
        }
      />
    </ThemedView>
  );
};

export default HistorySection;

const TimelineCard = ({ item }: any) => {
  const { theme } = useTheme();

  const colors = theme.colors;

  const storedUser = useSelector(
    (state: RootState) => state.auth.userData?._id
  );

  const descriptionText = item.comment || "";
  return (
    <ThemedView
      padding={10}
      style={{
        overflow: "hidden",
        flexDirection: "row",
        gap: "10%",
        backgroundColor: colors.background,
      }}
    >
      <ThemedText
        style={{
          maxWidth: "15%",
          color: colors.text,
          fontSize: theme.fontSizes.xs,
        }}
      >
        {formatDateAndTime(new Date(item.createdAt))}
      </ThemedText>
      <View
        style={{
          width: 2,
          height: 100,
          position: "absolute",
          left: "21%",
          top: 0,
          backgroundColor: colors.border,
        }}
      >
        <View
          style={{
            height: 16,
            width: 16,
            borderRadius: 8,
            left: -7,
            top: 10,
            backgroundColor: colors.brandColor,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedIcon
            name="mode-edit-outline"
            as={MaterialIcons}
            color="white"
            size={10}
          />
        </View>
      </View>
      <View style={{ width: "75%" }}>
        {/* <View style={{ flexDirection: "row", gap: 5 }}>
          <ThemedText
            style={{
              color: colors.textSecondary,
              marginBottom: 2,
              fontSize: theme.fontSizes.xs,
              fontStyle: "italic",
            }}
          >
            by {item._id === storedUser ? "You" : item?.createdBy?.name}
          </ThemedText>
        </View> */}
        <ThemedText style={{ fontSize: theme.fontSizes.xs }}>
          {descriptionText.replace(/<[^>]*>/g, "")}
        </ThemedText>
      </View>
    </ThemedView>
  );
};
