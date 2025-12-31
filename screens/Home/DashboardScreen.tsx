import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  ColorValue,
  RefreshControl,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import ThemedText from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import SectionCard from "./components/SectionCard";
import HorizontalSection from "./components/HorizontalSection";
import { useGetTrackOrderQuery } from "@/store/slices/trackorder";

//Get the full screen width
const { width } = Dimensions.get("window");
const CLIENT_CARD_WIDTH = width * 0.9;

// Returns a greeting message based on the current hour of the day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  else if (hour < 17) return "Good Afternoon";
  else return "Good Evening";
};

const QUICK_ACTIONS = [
  {
    label: "Fast & Reliable",
    description: "Experience quick, efficient and dependable shipping every time.",
    icon: (color: string) => <FontAwesome5 name="truck" size={36} color={color} />,
  },
  {
    label: "Worldwide Delivery",
    description: "Delivering to over 200+ destinations around the world.",
    icon: (color: string) => <Entypo name="globe" size={36} color={color} />,
  },
  {
    label: "Business Friendly",
    description: "Tailor-made logistic solutions for professionals and companies.",
    icon: (color: string) => <MaterialIcons name="business-center" size={36} color={color} />,
  },
];

const WHY_CHOOSE_US = [
  {
    label: "50k+",
    description: "Deliveries completed monthly",
  },
  {
    label: "24/7",
    description: "Customer support availability",
  },
  {
    label: "15 yrs",
    description: "Industry experience & expertise",
  },
];

const TRUSTED_PROVIDERS = [
  "Blue Star Express",
  "Curvex",
  "DHL Express",
  "DTDC",
];

const OUR_CLIENTS_SAY = [
  {
    description: "Best international logistics partner. Very fast customs clearance and excellent support.",
    name: "Ramesh Kumar",
    address: "Exporter, Mumbai",
    countryCode: "🇮🇳",
  },
  {
    description: "The cargo arrived on time in perfect condition. Highly trusted service!",
    name: "Sofia Mendes",
    address: "Business Owner, Nepal",
    countryCode: "🇳🇵",
  },
  {
    description: "Professional team and smooth documentation process. Strongly recommend!",
    name: "Jonathan Lee",
    address: "Logistics Head, Denmark",
    countryCode: "🇩🇰",
  },
  {
    description: "Best pricing and reliable tracking updates. Amazing support staff!",
    name: "Shreya Mehta",
    address: "Importer, Delhi",
    countryCode: "🇮🇳",
  },
  {
    description: "Fast and transparent process. Packaging and handling quality is superb.",
    name: "Carlos Martinez",
    address: "Retailer, Spain",
    countryCode: "🇪🇸",
  },
];

const DashboardHeader = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation<any>();
  const CARD_GRADIENT_COLORS: [ColorValue, ColorValue] = ['#FF4D4D', '#FF9999'];
  const clientFlatListRef = useRef<FlatList>(null);
  const [currentClientIndex, setCurrentClientIndex] = useState(0);
  const [submittedId, setSubmittedId] = useState<string | undefined>(undefined);

  //Refresh Handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);


  // For trackOrder
  const { data: TrackOrder, isLoading, isError } = useGetTrackOrderQuery(submittedId!, { skip: !submittedId });

  // Reset tracking-related states when screen is focused
  useFocusEffect(
    useCallback(() => {
      setSubmittedId(undefined);
      setTrackingNumber("");
      setIsFocused(false);
    }, [])
  );

  // For auto Scroll of what our client says
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentClientIndex + 1) % OUR_CLIENTS_SAY.length;
      setCurrentClientIndex(nextIndex);
      clientFlatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [currentClientIndex]);


  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemedView style={[styles.flex, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.topHeader, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.headerRow, { marginLeft: 16 }]}>
            <View style={styles.profileContainer}>
              <Ionicons name="person-circle-outline" size={48} color={theme.colors.brandColor!} />
              <View style={styles.textContainer}>
                <ThemedText style={[styles.greetingText, { color: theme.colors.textSecondary }]}>
                  {getGreeting()},
                </ThemedText>
                <ThemedText style={[styles.nameText, { color: theme.colors.text }]}>
                  TestUser
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.brandColor}
            />
          }
        >
          {/* Welcome Section */}
          <View style={styles.welcomeContainer}>
            <ThemedText style={[styles.WelcomeTitle, { color: theme.colors.text }]}>
              Welcome to{" "}
              <ThemedText style={[styles.WelcomeTitle, { color: theme.colors.brandColor! }]}>
                Nepal Can International
              </ThemedText>
            </ThemedText>
          </View>

          {/* Tracking Card */}
          <SectionCard>
            <ThemedText style={[styles.trackingTitle, { color: theme.colors.text }]}>
              Track Your Order
            </ThemedText>
            <ThemedText style={[styles.trackingSubtitle, { color: theme.colors.textSecondary }]}>
              Enter your Order ID below to see the current status and delivery timeline.
            </ThemedText>
            <ThemedTouchableOpacity
              style={[
                styles.inputContainer,
                {
                  borderColor: isFocused ? theme.colors.brandColor! : "#613b3b33",
                  backgroundColor: isFocused ? "#FFFFFF20" : "#FFFFFF1A",
                },
              ]}
              activeOpacity={1}
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
              <Ionicons name="qr-code-outline" size={20} color="#888" />
            </ThemedTouchableOpacity>
            <ThemedTouchableOpacity
              style={[styles.trackButton, { backgroundColor: theme.colors.brandColor! }]}
              onPress={() => setSubmittedId(trackingNumber.trim())}
            >
              <ThemedText style={styles.trackButtonText}>Track</ThemedText>
            </ThemedTouchableOpacity>
            {isLoading && (
              <ThemedText style={{ marginTop: 12, textAlign: "center" }}>
                Loading...
              </ThemedText>
            )}
            {isError && (
              <ThemedText
                style={{
                  marginTop: 12,
                  textAlign: "center",
                  color: "red",
                }}
              >
                Order not found or cancelled
              </ThemedText>
            )}
            {TrackOrder?.message && (
              <ThemedText
                style={{
                  marginTop: 12,
                  textAlign: "center",
                  color: theme.colors.textSecondary,
                }}
              >
                {TrackOrder.message}
              </ThemedText>
            )}
          </SectionCard>

          {/* Our Services */}
<HorizontalSection
  icon={<Ionicons name="briefcase" size={30} color={theme.colors.brandColor!} />}
  title="Our Services"
  subtitle="Explore what Nepal Can International offers to customers and businesses."
  data={QUICK_ACTIONS}
  renderItem={(action) => (
    <ThemedTouchableOpacity style={[styles.horizontalCard, { backgroundColor: theme.colors.card }]}>
      {action.icon(theme.colors.brandColor!)}
      <ThemedText style={[styles.cardTitle, { color: theme.colors.text }]}>{action.label}</ThemedText>
      <ThemedText style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>{action.description}</ThemedText>
    </ThemedTouchableOpacity>
  )}
  cardStyle={styles.horizontalCardWrapper}
/>


          {/* Why Choose Us */}
 <View style={{ marginTop: 20 }}>
  <HorizontalSection
    icon={<Ionicons name="shield-checkmark" size={30} color={theme.colors.brandColor!} />}
    title="Why Choose Us"
    subtitle="We’re not just a logistics company—we’re your trusted partner in keeping your business moving forward globally."
    data={WHY_CHOOSE_US}
    renderItem={(item) => (
      <ThemedTouchableOpacity style={[styles.horizontalCard, { backgroundColor: theme.colors.card }]}>
        <ThemedText style={[styles.cardTitle, { color: theme.colors.brandColor! }]}>{item.label}</ThemedText>
        <ThemedText style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>{item.description}</ThemedText>
      </ThemedTouchableOpacity>
    )}
    cardStyle={styles.horizontalCardWrapper}
  />
</View>


          {/* Our Trusted Providers */}
          <SectionCard
            icon={<Ionicons name="people" size={30} color={theme.colors.brandColor!} style={{ marginLeft: 8 }} />}
            title="Our Trusted Providers"
            viewAll
            onViewAllPress={() => navigation.navigate("OurTrustedProviders")}
            viewAllIcon={<Ionicons name="arrow-forward" size={16} color="#fff" />}
          >
            {[TRUSTED_PROVIDERS.slice(0, 2), TRUSTED_PROVIDERS.slice(2, 4)].map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginLeft: 12 }}
              >
                {row.map((provider, index) => (
                  <ThemedTouchableOpacity
                    key={index}
                    style={[styles.providerButton, { flex: 1, marginHorizontal: 5 }]}
                  >
                    <ThemedView
                      style={[
                        styles.providerInner,
                        { backgroundColor: theme.dark ? theme.colors.brandColor! : theme.colors.card },
                      ]}
                    >
                      <ThemedText
                        style={[styles.providerLabel, { color: theme.dark ? "#fff" : theme.colors.brandColor! }]}
                      >
                        {provider}
                      </ThemedText>
                    </ThemedView>
                  </ThemedTouchableOpacity>
                ))}
              </View>
            ))}
          </SectionCard>

          {/* What Our Clients Say */}
          <View style={{ marginHorizontal: 12, marginTop: 20, marginBottom: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
              <Ionicons
                name="chatbubbles"
                size={30}
                color={theme.colors.brandColor!}
                style={{ marginRight: 8 }}
              />
              <ThemedText
                style={[styles.servicesTitle, { color: theme.colors.text, lineHeight: 30 }]}
              >
                What Our Clients Say
              </ThemedText>
            </View>
            <FlatList
              ref={clientFlatListRef}
              data={OUR_CLIENTS_SAY}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              decelerationRate="fast"
              snapToInterval={CLIENT_CARD_WIDTH + 10}
              contentContainerStyle={{ paddingLeft: 0, paddingRight: 10 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={[styles.clientCard, { width: CLIENT_CARD_WIDTH, marginRight: 10 }]}>
                  <ThemedTouchableOpacity style={styles.clientCardButton}>
                    <LinearGradient
                      colors={CARD_GRADIENT_COLORS}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.gradientBackground}
                    >
                      <ThemedText style={[styles.clientDescription, { color: '#000', textAlign: 'center' }]}>
                        &quot;{item.description}&quot;
                      </ThemedText>
                      <View style={{ alignItems: 'center', marginTop: 12 }}>
                        <ThemedText style={[styles.clientName, { color: '#000', textAlign: 'center' }]}>
                          - {item.name}
                        </ThemedText>
                        <ThemedText style={[styles.clientAddress, { color: '#000', textAlign: 'center' }]}>
                          {item.countryCode} {item.address}
                        </ThemedText>
                      </View>
                    </LinearGradient>
                  </ThemedTouchableOpacity>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topHeader: {
    paddingBottom: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    fontWeight: "700",
  },
  nameText: {
    fontSize: 16,
    fontFamily: "Montserrat-SemiBold",
    fontWeight: "600",
  },
  welcomeContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  WelcomeTitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    lineHeight: 26,
  },
  trackingTitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    marginBottom: 6,
  },
  trackingSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  trackButton: {
    flexDirection: "row",
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  trackButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },
  servicesTitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    marginBottom: 6,
  },
  providersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  providerButton: {
    width: 140,
    height: 50,
    borderRadius: 16,
    marginVertical: 6,
    backgroundColor: "transparent",
  },
  providerInner: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  providerLabel: {
    fontSize: 12,
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
  },
  clientCard: {
    borderRadius: 16,
    overflow: "hidden",
    padding: 12,
  },
  clientCardButton: {
    flex: 1,
    borderRadius: 16,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  clientDescription: {
    fontSize: 14,
    fontFamily: "Montserrat-Medium",
    lineHeight: 18,
  },
  clientName: {
    fontSize: 12,
    fontFamily: "Montserrat-Bold",
    marginTop: 4,
  },
  clientAddress: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    marginTop: 2
  },
  horizontalCardWrapper: {
    width: 280,
    height: 150,
    marginRight: 12,
  },
  horizontalCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Montserrat-Bold",
    marginTop: 12,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    marginTop: 6,
    textAlign: "center",
  },
});

export default DashboardHeader;
