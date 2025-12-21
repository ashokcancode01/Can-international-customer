import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import ThemedText from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';



const { width } = Dimensions.get("window");

const CLIENT_CARD_WIDTH = width * 0.9;

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
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation<any>();

  const CARD_GRADIENT_COLORS: [ColorValue, ColorValue] = ['#FF4D4D', '#FF9999'];

  const clientFlatListRef = useRef<FlatList>(null);
  const [currentClientIndex, setCurrentClientIndex] = useState(0);

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
        <View style={[styles.headerContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.headerRow}>
            <View style={styles.profileContainer}>
              <Ionicons name="person-circle-outline" size={48} color={theme.colors.brandColor!} />
              <View style={styles.textContainer}>
                <ThemedText style={[styles.greetingText, { color: theme.colors.textSecondary }]}>
                  Good Morning,
                </ThemedText>
                <ThemedText style={[styles.nameText, { color: theme.colors.text }]}>
                  Alex
                </ThemedText>
              </View>
            </View>
            <Ionicons name="notifications-circle" size={36} color={theme.colors.brandColor!} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Tracking Card */}
          <View style={[styles.trackingCard, { backgroundColor: theme.colors.card }]}>
            <ThemedText style={[styles.trackingTitle, { color: theme.colors.text }]}>
              Track Your order
            </ThemedText>
            <ThemedText style={[styles.trackingSubtitle, { color: theme.colors.textSecondary }]}>
              Enter your Order ID below to see the current status and delivery
              timeline.
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
            >
              <ThemedText style={styles.trackButtonText}>Track</ThemedText>

            </ThemedTouchableOpacity>
          </View>

          {/* Our Services */}
          <View style={{ marginHorizontal: 12, marginTop: 30 }}>
            <View style={{ marginHorizontal: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons
                  name="briefcase"
                  size={30}
                  color={theme.colors.brandColor!}
                />
                <ThemedText
                  style={[
                    styles.servicesTitle,
                    { color: theme.colors.text, marginLeft: 8, lineHeight: 30 }
                  ]}
                >
                  Our Services
                </ThemedText>
              </View>
              <ThemedText style={[styles.servicesSubtitle, { color: theme.colors.textSecondary }]}>
                Explore what Nepal Can International offers to customers and businesses.
              </ThemedText>
            </View>

            <View >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
              >
                {QUICK_ACTIONS.map((action, index) => (
                  <View key={index} style={[styles.actionCard, { marginRight: 12 }]}>
                    <ThemedTouchableOpacity style={styles.actionButton}>
                      {action.icon(theme.colors.brandColor!)}
                      <ThemedText style={[styles.actionLabel, { color: theme.colors.text }]}>
                        {action.label}
                      </ThemedText>
                      <ThemedText style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
                        {action.description}
                      </ThemedText>
                    </ThemedTouchableOpacity>
                  </View>
                ))}
              </ScrollView>

            </View>
          </View>

          {/* Why Choose Us */}
          <View style={{ marginHorizontal: 12, marginTop: 30 }}>
            <View style={{ marginHorizontal: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons
                  name="shield-checkmark"
                  size={30}
                  color={theme.colors.brandColor!}
                />
                <ThemedText
                  style={[
                    styles.servicesTitle,
                    { color: theme.colors.text, marginLeft: 8, lineHeight: 30 }
                  ]}
                >
                  Why Choose Us
                </ThemedText>
              </View>
              <ThemedText style={[styles.servicesSubtitle, { color: theme.colors.textSecondary }]}>
                We&apos;re not just a logistics company—we&apos;re your trusted partner in keeping your business moving forward globally.
              </ThemedText>
            </View>

            <View >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
              >
                {WHY_CHOOSE_US.map((item, index) => (
                  <View key={index} style={[styles.whyChooseCard, { width: 160, marginRight: 12 }]}>
                    <ThemedTouchableOpacity style={styles.whyChooseButton}>
                      <ThemedText style={[styles.whyChooseLabel, { color: theme.colors.brandColor! }]}>
                        {item.label}
                      </ThemedText>
                      <ThemedText
                        style={[styles.whyChooseDescription, { color: theme.colors.textSecondary }]}
                      >
                        {item.description}
                      </ThemedText>
                    </ThemedTouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Our Trusted Providers */}
          <View style={{ marginTop: 30, marginBottom: 30 }}>
            <View style={{ marginHorizontal: 12, marginTop: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ marginHorizontal: 5 }}>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="people"
                      size={30}
                      color={theme.colors.brandColor!}
                    />
                    <ThemedText
                      style={[
                        styles.servicesTitle,
                        { color: theme.colors.text, marginLeft: 8, lineHeight: 30 }
                      ]}
                    >
                      Our Trusted Providers
                    </ThemedText>
                  </View>
                </View>

                {/* View All button */}
                <ThemedTouchableOpacity
                  onPress={() => navigation.navigate("OurTrustedProviders")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: theme.colors.brandColor,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                    marginBottom: 8
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: 10,
                      fontFamily: "Montserrat-Bold",
                      color: "#fff",
                      marginRight: 6,
                    }}
                  >
                    View All
                  </ThemedText>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </ThemedTouchableOpacity>
              </View>

              <View style={{ marginHorizontal: 5 }}>
                <ThemedText style={[styles.servicesSubtitle, { color: theme.colors.textSecondary, marginTop: 4 }]}>
                  We collaborate with reliable logistics providers to ensure fast and secure delivery.
                </ThemedText>
              </View>
            </View>
            <View style={[styles.servicesCard, { backgroundColor: theme.colors.card, marginHorizontal: 12 }]}>
              {[
                TRUSTED_PROVIDERS.slice(0, 2),
                TRUSTED_PROVIDERS.slice(2, 4)
              ].map((row, rowIndex) => (
                <View key={rowIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  {row.map((provider, index) => (
                    <ThemedTouchableOpacity key={index} style={[styles.providerButton, { flex: 1, marginHorizontal: 5 }]}>
                      <ThemedView
                        style={[
                          styles.providerInner,
                          {
                            backgroundColor: theme.dark ? theme.colors.brandColor! : theme.colors.card,
                          }
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.providerLabel,
                            { color: theme.dark ? "#fff" : theme.colors.brandColor! },
                          ]}
                        >
                          {provider}
                        </ThemedText>
                      </ThemedView>
                    </ThemedTouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* What Our Clients Say */}
          <View style={{ marginHorizontal: 12, marginTop: 30, marginBottom: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5 }}>
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
  headerContainer: {
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    fontWeight: "700",
  },
  nameText: {
    fontSize: 20,
    fontFamily: "Montserrat-SemiBold",
    fontWeight: "600",
  },
  trackingCard: {
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
    marginHorizontal: 12,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  trackButtonText: {
    color: "#fff",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },
  servicesCard: {
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
    marginHorizontal: 12,
  },
  servicesTitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    marginBottom: 6,
  },
  servicesSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    lineHeight: 18,
    marginBottom: 6,
  },
  actionCard: {
    width: 220,
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    marginTop: 12,
  },
  actionDescription: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  whyChooseCard: {
    width: 160,
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  whyChooseButton: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  whyChooseLabel: {
    fontSize: 18,
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
    marginTop: 8,
  },
  whyChooseDescription: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
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
});

export default DashboardHeader;
