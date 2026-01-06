import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/ThemeProvider";
import Card from "../../Menu/components/Card";
import ThemedText from "@/components/themed/ThemedText";
import { useGetTrackOrderQuery, OrderNote } from "@/store/slices/trackorder";
import LoadingIndicator from "@/components/LoadingIndicator";

const TRACKING_STEPS = [
  { label: "Order Placed", detail: "Your order was created" },
  { label: "Processing", detail: "Inspecting and packaging your order" },
  { label: "International Departure", detail: "Package departed from Origin Country" },
  { label: "International Arrival", detail: "Package arrived in Destination Country" },
  { label: "In Transit", detail: "Your Package Is On The Way" },
  { label: "Delivery Attempted", detail: "We Tried To Deliver Your Package" },
  { label: "Delivered", detail: "Package Received Successfully" },
];

const STATUS_TO_STEP_MAPPING = {
  Created: 0,
  "Branch Dispatched": 1,
  "Arrived at Hub": 1,
  Inspected: 1,
  Packaged: 1,
  "Carrier Dispatched": 2,
  "Arrived at Overseas": 3,
  "Sent for Delivery": 4,
  "On Transit": 4,
  "On Hold": 4,
  "Delivery Attempted": 5,
  Delivered: 6,
};

const RETURN_TRACKING_STEPS = [
  { label: "Return Initiated", detail: "Return process has been started" },
  { label: "Return InProcess", detail: "Return is being processed at branch" },
  { label: "Return Dispatched", detail: "Return package has been dispatched" },
  { label: "Returned to Branch", detail: "Package has returned to the branch" },
  { label: "Return Delivered", detail: "Return successfully delivered" },
];

const RETURN_STATUS_TO_STEP_MAPPING = {
  "Flagged For Return": 0,
  "Return Initiated": 1,
  "Created Partial Return Order": 1,
  "Return Dispatched": 2,
  "Returned to Branch": 3,
  "Return Delivered": 4,
};

export default function ScannedOrderDetails() {
  const { theme } = useTheme();
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };

  const { data: orderData, isLoading, error } = useGetTrackOrderQuery(orderId);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return d.toLocaleString("en-US", options).replace(",", "").toUpperCase();
  };

  const stripHtml = (text?: string) => (text ? text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00A0/g, " ")
    .trim() : "");

  const isReturnStatus = (status: string) => {
    return Object.keys(RETURN_STATUS_TO_STEP_MAPPING).includes(status);
  };

  const getActiveStep = (status: string) => {
    return STATUS_TO_STEP_MAPPING[status as keyof typeof STATUS_TO_STEP_MAPPING] ?? 0;
  };

  const getReturnActiveStep = (status: string) => {
    return RETURN_STATUS_TO_STEP_MAPPING[status as keyof typeof RETURN_STATUS_TO_STEP_MAPPING] ?? 0;
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingIndicator size={60} color={theme.colors.brandColor} />
      </View>
    );
  }

  if (error || !orderData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#666",
            textAlign: "center",
          }}
        >
          We couldn’t find the order you’re looking for.
        </Text>
      </View>
    );
  }


  const activeStep = isReturnStatus(orderData.OrderStatus)
    ? getReturnActiveStep(orderData.OrderStatus)
    : getActiveStep(orderData.OrderStatus);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* HEADER */}
      <Card style={{ backgroundColor: theme.colors.brandColor, paddingVertical: 20, alignItems: "center" }}>
        <Text style={[styles.orderIdText, { color: "#fff" }]}>ORDER ID: {orderData.orderId}</Text>

        <View style={styles.flagsRow}>
          <View style={{ alignItems: "center" }}>
            <View style={[styles.flagContainer, { borderColor: "#fff" }]}>
              <Image source={{ uri: orderData.senderCountry.flagUrl.png }} style={styles.flagImage} />
            </View>
            <Text style={styles.flagLabel}>{orderData.senderCountry.name}</Text>
          </View>

          <MaterialCommunityIcons name="airplane-takeoff" size={28} color="white" style={{ marginHorizontal: 20 }} />

          <View style={{ alignItems: "center" }}>
            <View style={[styles.flagContainer, { borderColor: "#fff" }]}>
              <Image source={{ uri: orderData.receiverCountry.flagUrl.png }} style={styles.flagImage} />
            </View>
            <Text style={styles.flagLabel}>{orderData.receiverCountry.name}</Text>
          </View>
        </View>
      </Card>

      {/* LIVE TRACKING */}
      <Card style={{ marginTop: 20, padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          {isReturnStatus(orderData.OrderStatus) ? (
            <MaterialIcons name="assignment-return" size={22} color={theme.colors.brandColor} style={{ marginRight: 8 }} />
          ) : (
            <FontAwesome5 name="truck" size={20} color={theme.colors.brandColor} style={{ marginRight: 8 }} />
          )}
          <ThemedText type="cardHeader" style={{ fontSize: 18, color: theme.colors.text, fontFamily: "Montserrat-Bold" }}>
            {isReturnStatus(orderData.OrderStatus) ? "Return Status" : "Live Tracking"}
          </ThemedText>
        </View>

        {(isReturnStatus(orderData.OrderStatus) ? RETURN_TRACKING_STEPS : TRACKING_STEPS).map((step, index) => {
          const stepActive = isReturnStatus(orderData.OrderStatus)
            ? index === getReturnActiveStep(orderData.OrderStatus)
            : index === getActiveStep(orderData.OrderStatus);
          const stepCompleted = index < activeStep;
          const isLastStep = index === (isReturnStatus(orderData.OrderStatus) ? RETURN_TRACKING_STEPS.length - 1 : TRACKING_STEPS.length - 1);

          return (
            <View key={step.label} style={styles.trackingStepVertical}>
              <View style={styles.iconColumn}>
                <View style={styles.iconWrapper}>
                  <FontAwesome5
                    name={stepActive ? "dot-circle" : "check-circle"}
                    size={18}
                    color={stepCompleted || stepActive ? theme.colors.brandColor : "#ccc"}
                  />
                </View>
                {!isLastStep && <View style={styles.verticalLine} />}
              </View>
              <View style={styles.stepTextVertical}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <ThemedText style={[styles.stepTitle, { color: theme.colors.text }]}>{step.label}</ThemedText>
                  <ThemedText style={[styles.stepDate, { color: theme.colors.textSecondary }]}>
                    {formatDate(orderData.orderProcess[index]?.createdAt)}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.stepDescriptionVertical, { color: theme.colors.textSecondary }]}>{step.detail}</ThemedText>
              </View>
            </View>
          );
        })}
      </Card>

      {/* NOTES */}
      {orderData.orderNotes.map((note: OrderNote) => (
        <Card key={note._id} style={{ marginHorizontal: 16, marginBottom: 12, padding: 14, borderRadius: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.colors.brandColor + "15",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <MaterialIcons name="note-add" size={20} color={theme.colors.brandColor} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <ThemedText style={{ fontSize: 14, fontFamily: "Montserrat-semibold", color: theme.colors.text }}>
                  Notes For You
                </ThemedText>
                <ThemedText style={{ fontSize: 8, color: theme.colors.textSecondary, fontFamily: "Montserrat-Regular" }}>
                  {formatDate(note.createdAt)}
                </ThemedText>
              </View>
              <ThemedText style={{ fontSize: 13, lineHeight: 18, color: theme.colors.textSecondary, fontFamily: "Montserrat-Regular" }}>
                {stripHtml(note.content)}
              </ThemedText>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  orderIdText: {
    fontSize: 12,
    fontFamily: "Montserrat-semibold",
  },
  flagsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  flagContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 50,
    borderWidth: 2,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 5,
    backgroundColor: "white",
  },
  flagImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  flagLabel: {
    fontSize: 12,
    color: "white",
    marginTop: 4,
    fontFamily: "Montserrat-semibold",
  },
  trackingStepVertical: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconColumn: {
    width: 24,
    alignItems: "center",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  stepTextVertical: {
    flex: 1,
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 12,
    fontFamily: "Montserrat-semibold",
  },
  stepDate: {
    fontSize: 8,
    fontFamily: "Montserrat-medium",
  },
  stepDescriptionVertical: {
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
    marginTop: 4,
  },
  verticalLine: {
    position: "absolute",
    top: 25,
    width: 1,
    height: "70%",
    backgroundColor: "#ddd",
  },
});
