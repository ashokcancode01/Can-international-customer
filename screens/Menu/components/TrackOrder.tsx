import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ScrollView, Image, Text, RefreshControl } from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import Card from "../components/Card";
import ThemedText from "@/components/themed/ThemedText";
import { FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useGetTrackOrderQuery, TrackOrderResponse, OrderNote } from "@/store/slices/trackorder";
import ThemedButton from "@/components/themedComponent/ThemedButton";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";
import ThemedView from "@/components/themed/ThemedView";


// Tracking steps
const TRACKING_STEPS = [
  { label: "Order Placed", detail: "Your order was created" },
  { label: "Processing", detail: "Inspecting and packaging your order" },
  { label: "International Departure", detail: "Package departed from Origin Country" },
  { label: "International Arrival", detail: "Package arrived in Destination Country" },
  { label: "In Transit", detail: "Your Package Is On The Way" },
  { label: "Delivery Attempted", detail: "We Tried To Deliver Your Package" },
  { label: "Delivered", detail: "Package Received Successfully" },
];

// Status to step mapping
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

// Return tracking steps
const RETURN_TRACKING_STEPS = [
  { label: "Return Initiated", detail: "Return process has been started" },
  { label: "Return InProcess", detail: "Return is being processed at branch" },
  { label: "Return Dispatched", detail: "Return package has been dispatched" },
  { label: "Returned to Branch", detail: "Package has returned to the branch" },
  { label: "Return Delivered", detail: "Return successfully delivered" },
];

// Return status to step mapping
const RETURN_STATUS_TO_STEP_MAPPING = {
  "Flagged For Return": 0,
  "Return Initiated": 1,
  "Created Partial Return Order": 1,
  "Return Dispatched": 2,
  "Returned to Branch": 3,
  "Return Delivered": 4,
};

type OrderStatus = keyof typeof STATUS_TO_STEP_MAPPING;
type ReturnStatus = keyof typeof RETURN_STATUS_TO_STEP_MAPPING;

const TrackOrderScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [submittedId, setSubmittedId] = useState<string | undefined>(undefined);
  const [isFocused, setIsFocused] = useState(false);
  const [orderData, setOrderData] = useState<TrackOrderResponse | null>(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return d
      .toLocaleString("en-US", options)
      .replace(",", "")
      .toUpperCase();
  };

  const isReturnStatus = (orderStatus: string) => {
    return Object.keys(RETURN_STATUS_TO_STEP_MAPPING).includes(orderStatus);
  };

  const { data: TrackOrder, isLoading, error } = useGetTrackOrderQuery(submittedId!, {
    skip: !submittedId,
  });

  useEffect(() => {
    if (TrackOrder) setOrderData(TrackOrder);
  }, [TrackOrder]);

  const stripHtml = (text?: string) => {
    if (!text) return "";
    return text.replace(/<[^>]+>/g, "").trim();
  };

  const getActiveStepFromOrderStatus = (orderStatus: OrderStatus) => {
    return STATUS_TO_STEP_MAPPING[orderStatus] ?? 0;
  };

  const getReturnActiveStep = (returnStatus: ReturnStatus) => {
    return RETURN_STATUS_TO_STEP_MAPPING[returnStatus] ?? 0;
  };

  // Reset the screen whenever it comes into focus
  useFocusEffect(
    useCallback(() => {
      setTrackingNumber("");
      setSubmittedId(undefined);
      setOrderData(null);
      setIsFocused(false);
    }, [])
  );

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={[styles.HeaderBackground, { backgroundColor: theme.colors.cardBackground }]}>
        <Image
          source={require("../../../assets/app/appBar.png")}
          resizeMode="cover"
          style={styles.HeaderImage}
        />
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.brandColor}
              progressViewOffset={60}
            />
          }
        >
          {/* TRACKING CARD */}
          <Card>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.brandColor + "20" }]}>
              <FontAwesome5 name="truck" size={36} color={theme.colors.brandColor} />
            </View>

            <ThemedText type="cardHeader" style={{ fontSize: 18, textAlign: "center", marginBottom: 8 }}>
              Track Your Order
            </ThemedText>

            <ThemedText type="cardLabel" style={{ fontSize: 12, textAlign: "center", marginBottom: 16, color: theme.colors.textSecondary }}>
              Enter your Order ID below to see the current status and delivery timeline.
            </ThemedText>

            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: isFocused ? theme.colors.brandColor : "#613b3b33",
                  backgroundColor: isFocused ? "#FFFFFF20" : "#FFFFFF1A",
                },
              ]}
            >
              <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="e.g. C42EQEX6NFQP"
                placeholderTextColor="#888"
                value={trackingNumber}
                onChangeText={setTrackingNumber}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <ThemedTouchableOpacity onPress={() => navigation.navigate("ScannerScreen")} style={{ backgroundColor: "transparent" }}>
                <Ionicons name="qr-code-outline" size={20} color="#888" />
              </ThemedTouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                const trimmed = trackingNumber.trim();
                if (trimmed) {
                  setSubmittedId(trimmed);
                }
              }}
            >
              {/* TRACK BUTTON */}
              <ThemedButton
                buttonName="Track"
                loadingText="Tracking..."
                isLoading={isLoading}
                disabled={isLoading || !trackingNumber.trim()}
                onPress={() => {
                  const trimmed = trackingNumber.trim();
                  if (trimmed) setSubmittedId(trimmed);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.colors.brandColor,
                  paddingVertical: 12,
                  borderRadius: 10,
                  marginTop: 12,
                }}
              />
            </TouchableOpacity>

            {error && (
              <ThemedText style={{ marginTop: 12, textAlign: "center", color: theme.colors.brandColor }}>
                Order not found or cancelled
              </ThemedText>
            )}

            {orderData && !isLoading && !error && (
              <ThemedText
                style={{
                  marginTop: 12,
                  textAlign: "center",
                  color: theme.colors.green,
                  fontFamily: "Montserrat-bold"
                }}
              >
                {orderData.OrderStatus}
              </ThemedText>
            )}
          </Card>

          {/* ORDER DETAILS */}
          {orderData && !isLoading && !error && (
            <View style={{ marginTop: 20 }}>
              {/* Header with Order ID and Flags */}
              <Card style={{ backgroundColor: theme.colors.brandColor, paddingVertical: 20, alignItems: "center" }}>
                <Text style={[styles.orderIdText, { color: "#fff" }]}>ORDER ID: {orderData.orderId}</Text>

                {/* Flags Row */}
                <View style={styles.flagsRow}>
                  <View style={{ alignItems: "center" }}>
                    <View style={[styles.flagContainer, { borderColor: "#fff" }]}>
                      <Image source={{ uri: orderData.senderCountry.flagUrl.png }} style={styles.flagImage} />
                    </View>
                    <Text style={styles.flagLabel}>{orderData.senderCountry.name}</Text>
                  </View>

                  {/* Airplane Icon */}
                  <MaterialCommunityIcons name="airplane-takeoff" size={28} color="white" style={{ marginHorizontal: 20 }} />
                  <View style={{ alignItems: "center" }}>
                    <View style={[styles.flagContainer, { borderColor: "#fff" }]}>
                      <Image source={{ uri: orderData.receiverCountry.flagUrl.png }} style={styles.flagImage} />
                    </View>
                    <Text style={styles.flagLabel}>{orderData.receiverCountry.name}</Text>
                  </View>
                </View>
              </Card>

              {/* Live Tracking Card */}
              <Card style={{ marginTop: 20, padding: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                  {isReturnStatus(orderData.OrderStatus) ? (
                    <MaterialIcons
                      name="assignment-return"
                      size={22}
                      color={theme.colors.brandColor}
                      style={{ marginRight: 8 }}
                    />
                  ) : (
                    <FontAwesome5
                      name="truck"
                      size={20}
                      color={theme.colors.brandColor}
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <ThemedText
                    type="cardHeader"
                    style={{
                      fontSize: 18,
                      color: theme.colors.text,
                      marginTop: 4,
                      fontFamily: "Montserrat-Bold",
                    }}
                  >
                    {isReturnStatus(orderData.OrderStatus) ? "Return Status" : "Live Tracking"}
                  </ThemedText>
                </View>

                {/* Tracking Steps */}
                {isReturnStatus(orderData.OrderStatus)
                  ? RETURN_TRACKING_STEPS.map((step, index) => {
                    const activeStep = getReturnActiveStep(orderData.OrderStatus as ReturnStatus);
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;
                    const isLastStep = index === RETURN_TRACKING_STEPS.length - 1;

                    return (
                      <View key={step.label} style={styles.trackingStepVertical}>
                        <View style={styles.iconColumn}>
                          <View style={styles.iconWrapper}>
                            <FontAwesome5
                              name={isActive ? "dot-circle" : "check-circle"}
                              size={18}
                              color={isCompleted || isActive ? theme.colors.brandColor : "#ccc"}
                            />
                          </View>
                          {!isLastStep && <View style={styles.verticalLine} />}
                        </View>
                        <View style={styles.stepTextVertical}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <ThemedText style={[styles.stepTitle, { color: theme.colors.text }]}>
                              {step.label}
                            </ThemedText>
                            <ThemedText style={[styles.stepDate, { color: theme.colors.textSecondary }]}>
                              {formatDate(orderData.orderProcess[index]?.createdAt || "")}
                            </ThemedText>
                          </View>

                          <ThemedText
                            style={[
                              styles.stepDescriptionVertical,
                              {
                                marginLeft: 0,
                                marginTop: 10,
                                marginBottom: 8,
                                color: theme.colors.textSecondary,
                              },
                            ]}
                          >
                            {step.detail}
                          </ThemedText>
                        </View>
                      </View>
                    );
                  })
                  : TRACKING_STEPS.map((step, index) => {
                    const activeStep = getActiveStepFromOrderStatus(orderData.OrderStatus as OrderStatus);
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;
                    const isLastStep = index === TRACKING_STEPS.length - 1;
                    return (
                      <View key={step.label} style={styles.trackingStepVertical}>
                        <View style={styles.iconColumn}>
                          <View style={styles.iconWrapper}>
                            <FontAwesome5
                              name={isActive ? "dot-circle" : "check-circle"}
                              size={18}
                              color={isCompleted || isActive ? theme.colors.brandColor : "#ccc"}
                            />
                          </View>
                          {!isLastStep && <View style={styles.verticalLine} />}
                        </View>
                        <View style={styles.stepTextVertical}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <ThemedText style={[styles.stepTitle, { color: theme.colors.text }]}>
                              {step.label}
                            </ThemedText>
                            <ThemedText style={[styles.stepDate, { color: theme.colors.textSecondary }]}>
                              {formatDate(orderData.orderProcess[index]?.createdAt || "")}
                            </ThemedText>
                          </View>

                          <ThemedText
                            style={[
                              styles.stepDescriptionVertical,
                              {
                                marginLeft: 0,
                                marginTop: 10,
                                marginBottom: 8,
                                color: theme.colors.textSecondary,
                              },
                            ]}
                          >
                            {step.detail}
                          </ThemedText>
                        </View>
                      </View>
                    );
                  })}
              </Card>

              {/* Notes For You */}
              {orderData.orderNotes.map((note: OrderNote) => (
                <Card
                  key={note._id}
                  style={{
                    marginHorizontal: 16,
                    marginBottom: 12,
                    padding: 14,
                    borderRadius: 14,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    {/* Icon */}
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
                      <MaterialIcons
                        name="note-add"
                        size={20}
                        color={theme.colors.brandColor}
                      />
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <ThemedText
                          style={{
                            fontSize: 14,
                            fontFamily: "Montserrat-semibold",
                            color: theme.colors.text,
                          }}
                        >
                          Notes For You
                        </ThemedText>
                        <ThemedText
                          style={{
                            fontSize: 8,
                            color: theme.colors.textSecondary,
                            fontFamily: "Montserrat-Regular",
                          }}
                        >
                          {formatDate(note.createdAt)}
                        </ThemedText>
                      </View>

                      <ThemedText
                        style={{
                          fontSize: 13,
                          lineHeight: 18,
                          color: theme.colors.textSecondary,
                          fontFamily: "Montserrat-Regular",
                        }}
                      >
                        {stripHtml(note.content)}
                      </ThemedText>
                    </View>
                  </View>
                </Card>
              ))}

            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 80
  },
  HeaderBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 10,
  },
  HeaderImage: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
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
    marginLeft: 12,
  },
  verticalLine: {
    position: "absolute",
    top: 25,
    width: 1,
    height: "70%",
    backgroundColor: "#ddd",
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
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 50,
    borderWidth: 2,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 5,
    backgroundColor: 'white',
  },
  flagImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  flagLabel: {
    fontSize: 12,
    color: "white",
    marginTop: 4,
    fontFamily: "Montserrat-semibold",
  },
});

export default TrackOrderScreen;
