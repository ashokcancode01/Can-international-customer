import { ThemedView } from '@/components/themed/ThemedView';
import { useTheme } from '@/theme/ThemeProvider';
import { useRoute, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Linking, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useGetBranchByIdQuery } from '@/store/slices/branches';
import { ThemedTouchableOpacity } from '@/components/themed/ThemedTouchableOpacity';
import Foundation from '@expo/vector-icons/Foundation';
import BranchMapView from './BranchMapView';

const BranchesDetails = () => {
    const { theme, isDark } = useTheme();
    const navigation = useNavigation<any>();
    const brandColor = theme.colors.brandColor || "#dc2f54";
    const route = useRoute<any>();
    const screenWidth = Dimensions.get("window").width;
    const { branchId } = route.params as { branchId: string };
    const { data: branchResponse, isLoading, isError } = useGetBranchByIdQuery(branchId);
    const branch = branchResponse?.data;

    const hasWorkingHours = !!branch?.workingHours && branch.workingHours.length > 0;
    const services = branchResponse?.services ?? [];
    const hasServices = services.length > 0;

    const coordinates = branch?.coordinates;
    const lat = coordinates?.lat;
    const long = coordinates?.long;

    const hasLocation =
        typeof lat === "number" &&
        typeof long === "number";

    // Map branch working hours to include open/close times and whether the branch is open
    const workingHours = branch?.workingHours?.map((wh) => ({
        day: wh.day,
        openTime: wh.startsAt,
        closeTime: wh.closesAt,
        isOpen: !!(wh.startsAt && wh.closesAt),
    })) ?? [];

    if (isLoading) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
                <Text style={{ fontFamily: "Montserrat-Medium", color: theme.colors.text }}>Loading branch data...</Text>
            </ThemedView>
        );
    }

    if (isError || !branch) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
                <Text style={{ fontFamily: "Montserrat-Medium", color: theme.colors.text }}>No branch data found</Text>
            </ThemedView>
        );
    }

    const iconMap: Record<string, keyof typeof FontAwesome.glyphMap> = {
        'Branch Code': 'hashtag',
        Phone: 'phone',
        'Areas Covered': 'map-marker',
        Province: 'building',
        District: 'map',
        Municipality: 'university',
    };

    const InfoCard = ({ label, value }: { label: string; value: string }) => (
        <View style={[styles.infoCard, isDark && { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.iconLabelRow}>
                <FontAwesome name={iconMap[label]} size={20} color={brandColor} />
                <Text style={[styles.infoLabel, { color: brandColor, fontFamily: "Montserrat-Medium" }]}>{label}</Text>
            </View>
            <Text style={[styles.infoValue, { fontFamily: "Montserrat-medium", color: isDark ? theme.colors.text : "#000" }]}>{value}</Text>
        </View>
    );

    //prefill the message box when navigated from branch details
    const handlePlaceOrder = () => {
        navigation.navigate("PublicTabs", {
            screen: "Contact",
            params: { prefillMessage: `I want to inquire about sending parcel abroad from ${branch.name}` },
        });
    };
    const handleCall = (phoneNumber: string) => {
        const url = `tel:${phoneNumber}`;
        Linking.canOpenURL(url)
            .then((supported) => { if (supported) Linking.openURL(url); })
            .catch((err) => console.error("Error opening dialer", err));
    };

    //Helper because api is returning HTML inisde a string
    const stripHtml = (text?: string) => {
        if (!text) return "";
        return text.replace(/<[^>]+>/g, "").trim();
    };

    return (
        <ThemedView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Header Card */}
                <View style={[styles.headerCard, { width: screenWidth - 24, alignSelf: "center", backgroundColor: brandColor }]}>
                    <Text style={[styles.branchLabel, { fontFamily: "Montserrat-Medium" }]}>Branch #{branch.code}</Text>
                    <Text style={[styles.branchName, { fontFamily: "Montserrat-Bold", color: isDark ? theme.colors.text : "#fff" }]}>{branch.name}</Text>
                    <View style={styles.headerRow}>
                        <Ionicons name="location-outline" size={14} color={isDark ? theme.colors.text : "#fff"} />
                        <Text style={[styles.headerText, { fontFamily: "Montserrat-Regular", color: isDark ? theme.colors.textSecondary : "#fff" }]}>{branch.address}</Text>

                        <Ionicons name="call-outline" size={14} color={isDark ? theme.colors.text : "#fff"} style={{ marginLeft: 16 }} />
                        <TouchableOpacity onPress={() => handleCall(branch.phone)}>
                            <Text style={[styles.headerText, { fontFamily: "Montserrat-Regular", color: isDark ? theme.colors.textSecondary : "#fff" }]}>{branch.phone}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Branch Information */}
                <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: "Montserrat-Bold" }]}>Branch Information</Text>
                <Text style={[styles.sectionSubTitle, { color: theme.colors.secondaryText, fontFamily: "Montserrat-Regular" }]}>Contact details and coverage area</Text>
                <View style={{ width: screenWidth - 24, alignSelf: "center", flexWrap: "wrap", flexDirection: "row", gap: 10 }}>
                    <InfoCard label="Branch Code" value={branch.code} />
                    <InfoCard label="Phone" value={branch.phone} />
                    <InfoCard label="Province" value={branch.province?.name || "-"} />
                    <InfoCard label="District" value={branch.district?.name || "-"} />
                    <InfoCard label="Municipality" value={branch.municipality?.name || "-"} />
                    <InfoCard label="Areas Covered" value={branch.areasCovered || "-"} />
                </View>

                {/* Working Hours */}
                {hasWorkingHours && (
                    <View style={{ width: screenWidth - 24, alignSelf: "center", marginTop: 24 }}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: "Montserrat-Bold", marginLeft: 6 }]}>
                            Working Hours
                        </Text>
                        <Text style={[styles.sectionSubTitle, { fontFamily: "Montserrat-Regular", marginLeft: 6, color: isDark ? theme.colors.textSecondary : theme.colors.secondaryText }]}>
                            Our weekly schedule
                        </Text>

                        <View style={{ flexDirection: "column", gap: 10 }}>
                            {workingHours.map((item) => {
                                const today = new Date().toLocaleString("en-US", { weekday: "long" }) === item.day;
                                const isSaturday = item.day === "Saturday";
                                return (
                                    <View
                                        key={item.day}
                                        style={[
                                            styles.workingHourCard,
                                            {
                                                width: screenWidth - 24,
                                                backgroundColor: isDark ? theme.colors.card : "#fff",
                                                borderColor: today ? "#fecaca" : isDark ? theme.colors.border : "#f1f1f1",
                                            },
                                        ]}
                                    >
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                            <View
                                                style={[
                                                    styles.statusDot,
                                                    { backgroundColor: isSaturday ? "#a1a1aa" : "#22c55e" },
                                                ]}
                                            />
                                            <Text style={[styles.dayText, { color: today ? "#dc2f54" : isDark ? theme.colors.text : "#000" }]}>
                                                {item.day}
                                            </Text>
                                            {today && <Text style={styles.todayBadge}>Today</Text>}
                                        </View>

                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                                            <Ionicons name="time-outline" size={14} color={isDark ? theme.colors.textSecondary : "#6b7280"} />
                                            <Text style={[styles.timeText, { color: isDark ? theme.colors.textSecondary : "#374151" }]}>
                                                {!item.isOpen ? "Closed" : `${item.openTime} - ${item.closeTime}`}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}

                        </View>
                    </View>
                )}

                {/* Services Available */}
                {hasServices && (
                    <View style={{ width: screenWidth - 24, alignSelf: "center", marginTop: 24 }}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: "Montserrat-Bold", marginLeft: 6 }]}>
                            Services Available
                        </Text>
                        <Text style={[styles.sectionSubTitle, { fontFamily: "Montserrat-Regular", marginLeft: 6, color: isDark ? theme.colors.textSecondary : theme.colors.secondaryText }]}>
                            What we offer at this location
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                        >
                            {services.map((service, index) => (
                                <View
                                    key={service.code || index}
                                    style={[
                                        styles.serviceCard,
                                        {
                                            width: screenWidth * 0.7,
                                            marginRight: index === services.length - 1 ? 0 : 10,
                                            backgroundColor: isDark ? theme.colors.card : "#fff",
                                            borderColor: isDark ? theme.colors.border : "#f1f1f1",
                                        },
                                    ]}
                                >
                                    <View style={styles.topRightPriceTag}>
                                        <Foundation name="price-tag" size={14} color={brandColor} />
                                        <Text style={[styles.priceTagText, { color: brandColor }]}>{service.code}</Text>
                                    </View>
                                    <View style={styles.serviceIcon}>
                                        <Ionicons name="briefcase-outline" size={22} color={brandColor} />
                                    </View>
                                    <Text style={[styles.serviceTitle, { color: isDark ? theme.colors.text : "#000" }]} numberOfLines={1}>
                                        {service.name}
                                    </Text>
                                    <Text style={[styles.serviceDesc, { color: isDark ? theme.colors.textSecondary : "#6b7280" }]} numberOfLines={3}>
                                        Type: {service.type?.name || "-"}
                                    </Text>
                                    <Text style={[styles.serviceDesc, { color: isDark ? theme.colors.textSecondary : "#6b7280" }]} numberOfLines={3}>
                                        {stripHtml(service.description)}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Shipping Card */}
                <View style={[styles.shippingCard, { width: screenWidth - 24, alignSelf: "center", backgroundColor: isDark ? theme.colors.card : "#fff", borderColor: isDark ? theme.colors.border : "#eee" }]}>
                    <View style={styles.shippingHeader}>
                        <View style={[styles.iconBackground, { backgroundColor: brandColor }]}>
                            <Ionicons name="cube-outline" size={24} color="#fff" />
                        </View>
                        <Text style={[styles.shippingTitle, { color: isDark ? theme.colors.text : "#000", fontFamily: "Montserrat-Bold" }]}>Ready to Ship?</Text>
                    </View>
                    <Text style={[styles.shippingSubtitle, { fontFamily: "Montserrat-Regular", color: isDark ? theme.colors.textSecondary : "#333" }]}>
                        Send your parcels abroad from <Text style={{ fontWeight: "700", color: brandColor, fontFamily: "Montserrat-Bold" }}>{branch.name}</Text>
                    </Text>
                    <View style={styles.shippingFeatures}>
                        <View style={styles.featureItem}>
                            <MaterialCommunityIcons name="truck-outline" size={16} color={brandColor} />
                            <Text style={[styles.featureText, { color: brandColor, fontFamily: "Montserrat-Medium" }]}>Fast Delivery</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="time-outline" size={16} color={brandColor} />
                            <Text style={[styles.featureText, { color: brandColor, fontFamily: "Montserrat-Medium" }]}>Track Anytime</Text>
                        </View>
                    </View>
                    <ThemedTouchableOpacity style={[styles.orderButton, { backgroundColor: brandColor }]} onPress={handlePlaceOrder}>
                        <Text style={[styles.orderButtonText, { fontFamily: "Montserrat-Bold" }]}>Place Your Order Now →</Text>
                    </ThemedTouchableOpacity>
                </View>

                {/* Location */}
                {hasLocation && (
                    <View style={{ width: screenWidth - 24, alignSelf: "center", marginTop: 24 }}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: "Montserrat-Bold", marginLeft: 6 }]}>
                            Our Location
                        </Text>

                        <View
                            style={[
                                styles.shippingCard,
                                {
                                    backgroundColor: isDark ? theme.colors.card : "#fff",
                                    borderColor: isDark ? theme.colors.border : "#eee",
                                    marginTop: 0,
                                },
                            ]}
                        >
                            <View style={{ height: 250, borderRadius: 12, overflow: "hidden" }}>
                                <BranchMapView branch={branch} />
                            </View>
                            <View style={styles.locationFooter}>
                                <View style={styles.locationCoords}>
                                    <Ionicons name="location-outline" size={16} color={isDark ? theme.colors.textSecondary : "#555"} />
                                    <Text
                                        style={[
                                            styles.locationCoordsText,
                                            { color: isDark ? theme.colors.textSecondary : "#555" },
                                        ]}
                                    >
                                        {lat.toFixed(6)}, {long.toFixed(6)}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={[styles.locationButton, { backgroundColor: brandColor }]}
                                    onPress={() => {
                                        Linking.openURL(
                                            `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`
                                        );
                                    }}
                                >
                                    <Ionicons name="navigate-outline" size={16} color="#fff" />
                                    <Text style={styles.locationButtonText}>Get Directions</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    );
};

export default BranchesDetails;

const styles = StyleSheet.create({
    headerCard: {
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
    },
    branchLabel: {
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        fontSize: 12,
        opacity: 0.9,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: "hidden",
        alignSelf: "flex-start",
    },
    branchName: {
        fontSize: 22,
        marginVertical: 6,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        marginTop: 4,
    },
    headerText: {
        fontSize: 13,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    sectionSubTitle: {
        fontSize: 13,
        marginBottom: 12,
    },
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },
    infoCard: {
        width: "48%",
        backgroundColor: "#fff",
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 12,
    },
    iconLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 12,
        color: "#dc2f54",
    },
    infoValue: {
        fontSize: 12,
        color: "#000",
    },
    shippingCard: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        marginTop: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    shippingHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },
    iconBackground: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    shippingTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    shippingSubtitle: {
        fontSize: 12,
        marginBottom: 16,
        color: "#333",
    },
    shippingFeatures: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    featureText: {
        fontSize: 12,
    },
    orderButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    orderButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    workingHourCard: {
        width: "48%",
        borderWidth: 1,
        borderColor: "#f1f1f1",
        borderRadius: 12,
        padding: 14,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    todayCard: {
        borderColor: "#fecaca",
        backgroundColor: "#fff5f5",
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dayText: {
        fontSize: 13,
        fontFamily: "Montserrat-Medium",
    },
    todayBadge: {
        backgroundColor: "#dc2f54",
        color: "#fff",
        fontSize: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 6,
        overflow: "hidden",
        fontFamily: "Montserrat-Bold",
    },
    timeText: {
        fontSize: 12,
        color: "#374151",
        fontFamily: "Montserrat-Regular",
    },
    serviceCard: {
        borderWidth: 1,
        borderColor: "#f1f1f1",
        borderRadius: 14,
        padding: 16,
        backgroundColor: "#fff",
        height: 170,
        justifyContent: "flex-start",
        position: "relative",
    },
    topRightPriceTag: {
        position: "absolute",
        top: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    priceTagText: {
        fontSize: 12,
        fontFamily: "Montserrat-SemiBold",
    },
    serviceIcon: {
        marginBottom: 10,
    },
    serviceTitle: {
        fontSize: 14,
        fontFamily: "Montserrat-Bold",
        marginBottom: 6,
    },
    serviceDesc: {
        fontSize: 12,
        color: "#6b7280",
        fontFamily: "Montserrat-Regular",
        marginTop: 6,
    },
    locationMapWrapper: {
        width: "100%",
        height: 250,
        overflow: "hidden",
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    locationFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    locationCoords: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    locationCoordsText: {
        fontSize: 13,
        fontFamily: 'Montserrat-Regular',
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
    },
    locationButtonText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Montserrat-Bold',
    },
});
