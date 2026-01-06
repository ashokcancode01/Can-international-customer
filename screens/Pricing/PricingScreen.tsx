import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
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


type FormData = {
    origin: string;
    destination: any;
    shipmentType: { _id: string; name: string } | null;
    serviceType: { _id: string; name: string } | null;
    weight: string;
};

const PricingScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<any>();
    const [refreshing, setRefreshing] = useState(false);
    const [pricingResult, setPricingResult] = useState<any>(null);
    const { control, handleSubmit, watch, reset } = useForm<FormData>({
        defaultValues: {
            origin: "Nepal",
            destination: { name: "Afghanistan" },
            shipmentType: null,
            serviceType: null,
            weight: "",
        },
    });

    const selectedShipmentType = watch("shipmentType");

    // Change the service type dropdowm dynamically for shipment type document and parcel
    const serviceOptions = getServiceTypeOptions(selectedShipmentType);

    const { data: countryList } = useGetCountryListQuery();

    const [getPricing, { isLoading }] = useGetPricingMutation();

    const onSubmit = async (formData: FormData) => {
        const safeToLower = (str?: string) => (str ? str.toLowerCase() : "");

        if (!formData.weight || Number(formData.weight) <= 0) {
            return;
        }
        if (!formData.destination?.name) {
            return;
        }
        if (!formData.shipmentType?.name) {
            return;
        }
        if (!formData.serviceType?.name) {
            return;
        }

        try {
            const result = await getPricing({
                destination: formData.destination.value,
                shipmentType: safeToLower(formData.shipmentType.name),
                serviceType: safeToLower(formData.serviceType.name),
                weight: Number(formData.weight),
            }).unwrap();

            setPricingResult(result);

        } catch {
            alert(" An error occurred while calculating rate. Please try again.");

        }
    };

    // Helper function to convert cca2 to emoji
    const countryCodeToEmoji = (cca2?: string) => {
        if (!cca2) return "";
        return cca2
            .toUpperCase()
            .replace(/./g, (char) =>
                String.fromCodePoint(char.charCodeAt(0) + 127397)
            );
    };

    //Map the country list for the dropdown
    const mappedCountries = countryList?.map((item) => ({
        _id: item._id,
        name: `${item.cca2 ? countryCodeToEmoji(item.cca2) + " " : ""}${item.name}`,
        value: item.name,
        cca2: item.cca2,
        flagUrl: item.flagUrl,
    })) || [];


    //Refresh Handler
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    //Reset the pricng form 
    useFocusEffect(
        useCallback(() => {
            return () => {
                reset({
                    origin: "Nepal",
                    destination: { name: "Afghanistan" },
                    shipmentType: null,
                    serviceType: null,
                    weight: "",
                });
                setPricingResult(null);
            };
        }, [reset])
    );

    //Prefills the message in contact screen message
    const handleOrder = () => {
        const destination = watch("destination")?.name || "";
        const serviceType = watch("serviceType")?.name || "";
        const weight = watch("weight") || "";
        const estimatedPrice = pricingResult?.data?.finalRate || "";

        const message = `I am sending my parcel from Nepal to ${destination}, Service: ${serviceType}, Weight: ${weight}kg, Estimated Price: NPR ${estimatedPrice}`;

        navigation.navigate("PublicTabs", {
            screen: "Contact",
            params: {
                screen: "ContactScreen",
                 prefillMessage: message
                 },
        });
    };


    return (
        <ThemedView style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
                <ThemedText style={[styles.title, { color: theme.colors.brandColor }]}>
                    International Courier Pricing
                </ThemedText>

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
                        inputStyle={{
                            color: theme.dark ? "#FFFFFF" : "#000000",
                        }}
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
                    />

                    {/* SHIPMENT TYPE */}
                    <CustomFormDropdown
                        control={control}
                        name="shipmentType"
                        label="Shipment Type"
                        options={ShipmentType}
                        defaultValue=""
                        placeholder="Select Shipment Type"
                        storeFullObject
                        containerStyle={{ marginBottom: 0 }}
                    />
                    <ThemedText
                        style={{
                            color: theme.colors.textSecondary,
                            marginBottom: 12,
                            fontSize: 10,
                        }}
                    >
                        Choose what are you sending
                    </ThemedText>

                    {/* SERVICE TYPE */}
                    <CustomFormDropdown
                        control={control}
                        name="serviceType"
                        label="Service Type"
                        options={serviceOptions}
                        storeFullObject
                        defaultValue=""
                        placeholder="Select Shipment Type"
                        disabled={!selectedShipmentType}
                        containerStyle={{ marginBottom: 0 }}
                    />
                    <ThemedText
                        style={{
                            color: theme.colors.textSecondary,
                            marginBottom: 12,
                            fontSize: 10,
                        }}
                    >
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
                        rules={{ required: "Weight is required" }}
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
                {pricingResult?.success && (
                    <ThemedCard
                        isCard
                        radius
                        padding="md"
                        style={{
                            backgroundColor: "#FFE6EA",
                            marginTop: 16,
                        }}
                    >
                        <ThemedText
                            style={{
                                color: "#D7263D",
                                fontSize: 16,
                                fontFamily: "Montserrat-SemiBold",
                            }}
                        >
                            Rate: ₹ {pricingResult.data.finalRate}
                        </ThemedText>

                        <ThemedText
                            style={{
                                fontSize: 11,
                                color: theme.colors.textSecondary,
                                marginTop: 6,
                            }}
                        >
                            * Additional surcharges, remote area fees, or customs duties may apply based on destination and service type.
                        </ThemedText>

                        <ThemedButton
                            buttonName="Send Your Order"
                            style={{ marginTop: 10 }} isLoading={false} loadingText={""}
                            onPress={handleOrder} />
                    </ThemedCard>
                )}
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
    textField: {
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
});

export default PricingScreen;  