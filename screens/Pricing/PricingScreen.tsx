import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, RefreshControl, Modal, Pressable } from "react-native";
import { useForm } from "react-hook-form";
import { useTheme } from "../../theme/ThemeProvider";
import ThemedText from "@/components/themed/ThemedText";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedCard } from "@/components/themed/ThemedCard";
import ThemedButton from "@/components/themedComponent/ThemedButton";
import ThemedTextField from "@/components/themedComponent/ThemedTextField";
import { CustomFormDropdown } from "@/components/themedComponent/CustomFormDropdown";
import { useGetCountryListQuery } from "@/store/slices/dropdown";
import { getServiceTypeOptions, ShipmentType } from "@/constants/dropdowns";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useGetPricingMutation } from "@/store/slices/pricing";
import { Ionicons } from "@expo/vector-icons";

type FormData = {
    origin: string;
    destination: { _id?: string; name: string; value: string } | null;
    shipmentType: { _id: string; name: string } | null;
    serviceType: { _id: string; name: string } | null;
    weight: string;
};

const PricingScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<any>();
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pricingResult, setPricingResult] = useState<any>(null);
    const {
        control,
        handleSubmit,
        watch,
        reset,
    } = useForm<FormData>({
        defaultValues: {
            origin: "Nepal",
            destination: { name: "Afghanistan", value: "Afghanistan" },
            shipmentType: null,
            serviceType: null,
            weight: "",
        },
    });
    const selectedShipmentType = watch("shipmentType");
    const serviceOptions = getServiceTypeOptions(selectedShipmentType);
    const { data: countryList } = useGetCountryListQuery();
    const [getPricing, { isLoading }] = useGetPricingMutation();

    // Submit handler
    const onSubmit = async (formData: FormData) => {
        const safeToLower = (str?: string) => (str ? str.toLowerCase() : "");

        if (!formData.weight || Number(formData.weight) <= 0) return;
        if (!formData.destination?.name) return;
        if (!formData.shipmentType?.name) return;
        if (!formData.serviceType?.name) return;

        try {
            const result = await getPricing({
                payload: {
                    destination: formData.destination.value,
                    type: safeToLower(formData.shipmentType?.name),
                    service: safeToLower(formData.serviceType?.name),
                    weight: Number(formData.weight),
                },
            }).unwrap();

            setPricingResult(result);
        } catch (error: any) {
            setErrorMessage(
                error?.data?.message ||
                "An error occurred while calculating rate. Please try again."
            );
        }
    };

    // Helper: Country code to emoji
    const countryCodeToEmoji = (cca2?: string) => {
        if (!cca2) return "";
        return cca2
            .toUpperCase()
            .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
    };

    const mappedCountries =
        countryList?.map((item) => ({
            _id: item._id,
            name: `${item.cca2 ? countryCodeToEmoji(item.cca2) + " " : ""}${item.name}`,
            value: item.name,
            cca2: item.cca2,
            flagUrl: item.flagUrl,
        })) || [];

    // Refresh handler
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

    // Reset form on screen focus
    useFocusEffect(
        useCallback(() => {
            return () => {
                reset({
                    origin: "Nepal",
                    destination: { name: "Afghanistan", value: "Afghanistan" },
                    shipmentType: null,
                    serviceType: null,
                    weight: "",
                });
                setPricingResult(null);
            };
        }, [reset])
    );

    // Prefill contact message
    const handleOrder = () => {
        const destination = watch("destination")?.value || "";
        const serviceType = watch("serviceType")?.name || "";
        const weight = watch("weight") || "";
        const estimatedPrice = pricingResult?.data?.finalRate || "";

        const message = `I am sending my parcel from Nepal to ${destination}, Service: ${serviceType}, Weight: ${weight}kg, Estimated Price: NPR ${estimatedPrice}`;

        navigation.navigate("PublicTabs", {
            screen: "Contact",
            params: {
                screen: "ContactScreen",
                prefillMessage: message,
            },
        });
    };

    return (
        <ThemedView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.brandColor} />}
            >
                <ThemedText style={[styles.title, { color: theme.colors.brandColor }]}>International Courier Pricing</ThemedText>

                <ThemedCard
                    isCard
                    borderColor={theme.dark ? "transparent" : theme.colors.brandColor}
                    borderWidth={1}
                    radius
                    shadow="md"
                    padding="md"
                >
                    {/* ORIGIN */}
                    <ThemedTextField
                        control={control}
                        name="origin"
                        label="Origin"
                        value="Nepal"
                        editable={false}
                        containerStyle={{
                            borderWidth: 1,
                            borderColor: theme.dark ? "#FFFFFF" : theme.colors.border,
                            backgroundColor: "transparent",
                        }}
                        inputStyle={{ color: theme.dark ? "#FFFFFF" : "#000000" }}
                        placeholder="Nepal"
                        placeholderTextColor={theme.dark ? "#FFFFFF" : "#999999"}
                    />

                    {/* DESTINATION */}
                    <CustomFormDropdown
                        control={control}
                        name="destination"
                        label="Destination Country"
                        storeFullObject
                        options={mappedCountries}
                        placeholder="Select country name"
                        rules={{ required: "Please select a destination country" }}
                    />
                    {/* SHIPMENT TYPE */}
                    <CustomFormDropdown
                        control={control}
                        name="shipmentType"
                        label="Shipment Type"
                        options={ShipmentType}
                        storeFullObject
                        placeholder="Select Shipment Type"
                        rules={{ required: "Please select a shipment type" }}
                    />
                    <ThemedText style={{ color: theme.colors.textSecondary, marginBottom: 12, fontSize: 10 }}>
                        Choose what are you sending
                    </ThemedText>

                    {/* SERVICE TYPE */}
                    <CustomFormDropdown
                        control={control}
                        name="serviceType"
                        label="Service Type"
                        options={serviceOptions}
                        storeFullObject
                        placeholder="Select Service Type"
                        disabled={!selectedShipmentType}
                        rules={{ required: "Please select a service type" }}
                    />
                    <ThemedText style={{ color: theme.colors.textSecondary, marginBottom: 12, fontSize: 10 }}>
                        {selectedShipmentType ? "Choose delivery speed" : "Select Shipment Type first"}
                    </ThemedText>

                    {/* WEIGHT */}
                    <ThemedTextField
                        control={control}
                        name="weight"
                        label="Weight (Kg)"
                        placeholder="Enter Weight in Kg"
                        isNumber
                        min={0.5}
                        step={0.5}
                        rules={{
                            required: "Weight is required",
                        }}
                    />

                    {/* BUTTON */}
                    <ThemedButton
                        buttonName="Calculate Price"
                        loadingText="Calculating..."
                        isLoading={isLoading}
                        disabled={isLoading}
                        onPress={handleSubmit(onSubmit)}
                    />
                </ThemedCard>

                {/* RESULT MODAL */}
                <Modal visible={!!pricingResult?.success} transparent animationType="fade">
                    <Pressable style={styles.overlay} onPress={() => setPricingResult(null)}>
                        <Pressable
                            style={[
                                styles.rateCard,
                                { backgroundColor: theme.colors.card, borderWidth: theme.dark ? 1 : 0, borderColor: theme.dark ? "#FFFFFF20" : "transparent" },
                            ]}
                            onPress={() => { }}
                        >
                            {/* CLOSE */}
                            <Pressable style={styles.closeButton} onPress={() => setPricingResult(null)}>
                                <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
                            </Pressable>

                            {/* PRICE */}
                            <ThemedText style={[styles.cardTitle, { color: theme.colors.secondaryText }]}>TOTAL ESTIMATED RATE</ThemedText>
                            <ThemedText style={[styles.totalPrice, { color: theme.colors.text }]}>₹ {pricingResult?.data?.finalRate}</ThemedText>

                            {/* INFO */}
                            <ThemedView style={[styles.infoBox, { backgroundColor: theme.dark ? "#1F2933" : "#F3F4F6" }]}>
                                <Ionicons name="information-circle-outline" size={16} color={theme.colors.textSecondary} />
                                <ThemedText style={[styles.infoText, { color: theme.colors.secondaryText }]}>
                                    Additional surcharges, remote area fees, or customs duties may apply based on destination.
                                </ThemedText>
                            </ThemedView>

                            {/* SEND ORDER */}
                            <ThemedButton buttonName="Send Your Order →" style={[
                                styles.orderButton,
                                { backgroundColor: theme.colors.brandColor }]}
                                onPress={handleOrder} isLoading={false} loadingText="" />
                        </Pressable>
                    </Pressable>
                </Modal>

                {/* ERROR MODAL */}
                <Modal visible={!!errorMessage} transparent animationType="fade">
                    <Pressable
                        style={styles.overlay}
                        onPress={() => setErrorMessage(null)}
                    >
                        <Pressable
                            style={[
                                styles.rateCard,
                                {
                                    backgroundColor: theme.colors.card,
                                    borderWidth: theme.dark ? 1 : 0,
                                    borderColor: theme.dark ? "#FFFFFF20" : "transparent",
                                    alignItems: "center",
                                },
                            ]}
                            onPress={() => { }}
                        >
                            {/* CLOSE */}
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setErrorMessage(null)}
                            >
                                <Ionicons
                                    name="close"
                                    size={20}
                                    color={theme.colors.textSecondary}
                                />
                            </Pressable>

                            {/* ERROR ICON */}
                            <Ionicons
                                name="alert-circle-outline"
                                size={26}
                                color="#DC2626"
                                style={{ marginBottom: 10, marginTop: 12 }}
                            />

                            {/* ERROR TEXT */}
                            <ThemedText
                                style={{
                                    fontSize: 14,
                                    lineHeight: 20,
                                    color: theme.colors.text,
                                    fontFamily: "Montserrat-Medium",
                                    textAlign: "center",
                                    paddingHorizontal: 12,
                                }}
                            >
                                {errorMessage}
                            </ThemedText>
                        </Pressable>
                    </Pressable>
                </Modal>


            </ScrollView>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: "Montserrat-Bold",
        marginBottom: 20,
        textAlign: "center",
        marginTop: 20,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    rateCard: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
    },
    closeButton: {
        position: "absolute",
        top: 14,
        right: 14,
        zIndex: 10,
    },
    cardTitle: {
        fontSize: 11,
        textAlign: "center",
        letterSpacing: 1,
        marginBottom: 8,
        fontFamily: "Montserrat-Medium",
    },
    totalPrice: {
        fontSize: 32,
        fontFamily: "Montserrat-Bold",
        textAlign: "center",
        marginBottom: 12,
    },
    infoBox: {
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        padding: 10,
        borderRadius: 10,
        marginBottom: 16,
        gap: 8,
    },
    infoText: {
        fontSize: 11,
        flex: 1,
    },
    orderButton: {
        marginTop: 14,
        borderRadius: 12,
        padding: 5,
    },

});


export default PricingScreen;  