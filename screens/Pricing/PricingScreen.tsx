import React from "react";
import { ScrollView, StyleSheet } from "react-native";
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

type FormData = {
    origin: string;
    destination: any;
    shipmentType: { _id: string; name: string } | null;
    serviceType: { _id: string; name: string } | null;
    weight: string;
};

const PricingScreen = () => {
    const { theme } = useTheme();

    const { control, handleSubmit, watch } = useForm<FormData>({
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

    const onSubmit = (data: FormData) => {
        console.log("Pricing Form Data:", data);
    };

    const { data: countryList } = useGetCountryListQuery();

    return (
        <ThemedView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
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
                        options={countryList}
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
                        storeFullObject={true}
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
                        isLoading={false}
                        onPress={handleSubmit(onSubmit)}
                    />
                </ThemedCard>
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
