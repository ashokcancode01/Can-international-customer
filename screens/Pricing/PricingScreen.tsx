import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    RefreshControl,
    View,
    Pressable,
    Image,
    Platform,
} from "react-native";
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
    destination: {
        _id?: string;
        name: string;
        value: string;
        cca2?: string;
    } | null;
    shipmentType: { _id: string; name: string } | null;
    serviceType: { _id: string; name: string } | null;
    weight: string;
};

const PricingScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<any>();
    const scrollRef = useRef<ScrollView>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pricingResult, setPricingResult] = useState<any>(null);

    /* FORM */
    const { control, handleSubmit, watch, reset, setValue } = useForm<FormData>({
        defaultValues: {
            origin: "🇳🇵 Nepal",
            destination: null,
            shipmentType: null,
            serviceType: null,
            weight: "",
        },
    });

    /* HELPERS  */
    const countryCodeToEmoji = (cca2?: string): string => {
        if (!cca2) return "";
        return cca2
            .toUpperCase()
            .replace(/./g, (char) =>
                String.fromCodePoint(char.charCodeAt(0) + 127397)
            );
    };

    /* API */
    const { data: countryList } = useGetCountryListQuery();
    const [getPricing, { isLoading }] = useGetPricingMutation();

    /* MAP COUNTRIES */
    const mappedCountries =
        countryList?.map((item) => ({
            _id: item._id,
            name: `${item.cca2 ? countryCodeToEmoji(item.cca2) + "" : ""}${item.name}`,
            value: item.name,
            cca2: item.cca2,
            flagUrl: item.flagUrl,
        })) || [];

    /* DEFAULT DESTINATION  */
    useEffect(() => {
        if (!countryList?.length) return;

        const afghanistan = countryList.find(
            (c) => c.name === "Afghanistan"
        );

        if (afghanistan) {
            setValue("destination", {
                _id: afghanistan._id,
                name: `${countryCodeToEmoji(afghanistan.cca2)}  ${afghanistan.name}`,
                value: afghanistan.name ?? "Afghanistan",
                cca2: afghanistan.cca2,
            });
        }
    }, [countryList, setValue]);

    /* WATCHERS */
    const selectedShipmentType = watch("shipmentType");
    const serviceOptions = getServiceTypeOptions(selectedShipmentType);

    /* SUBMIT */
    const onSubmit = async (formData: FormData) => {
        if (!formData.weight || Number(formData.weight) <= 0) return;
        if (!formData.destination) return;
        if (!formData.shipmentType) return;
        if (!formData.serviceType) return;

        try {
            const result = await getPricing({
                payload: {
                    destination: formData.destination.value,
                    type: formData.shipmentType.name.toLowerCase(),
                    service: formData.serviceType.name.toLowerCase(),
                    weight: Number(formData.weight),
                },
            }).unwrap();

            setPricingResult(result);
            setErrorMessage(null);
        } catch (error: any) {
            setErrorMessage(
                error?.data?.message ||
                "An error occurred while calculating rate. Please try again."
            );
            setPricingResult(null);
        }
    };

    /* REFRESH  */
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

    /* RESET ON BLUR  */
    useFocusEffect(
        useCallback(() => {
            return () => {
                const afghanistan = countryList?.find(c => c.name === "Afghanistan");
                reset({
                    origin: "🇳🇵 Nepal",
                    destination: afghanistan
                        ? {
                            _id: afghanistan._id,
                            name: `${countryCodeToEmoji(afghanistan.cca2)}  ${afghanistan.name}`,
                            value: afghanistan.name,
                            cca2: afghanistan.cca2,
                        }
                        : null,
                    shipmentType: null,
                    serviceType: null,
                    weight: "",
                });
                setPricingResult(null);
                setErrorMessage(null);
                scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
            };
        }, [reset, countryList])
    );

    /* CONTACT MESSAGE  */
    const handleOrder = () => {
        const destination = watch("destination")?.value ?? "";
        const serviceType = watch("serviceType")?.name ?? "";
        const weight = watch("weight") ?? "";
        const estimatedPrice = pricingResult?.data?.finalRate ?? "";

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
            <View style={[styles.HeaderBackground, { backgroundColor: theme.colors.cardBackground }]}>
                <Image
                    source={require("../../assets/app/appBar.png")}
                    resizeMode="cover"
                    style={styles.HeaderImage}
                />
            </View>
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressViewOffset={80}
                        tintColor={theme.colors.text}
                        colors={[theme.colors.text || "#fff"]}
                        style={{ backgroundColor: theme.colors.background }}
                    />}
            >
                <ThemedText style={[styles.title, { color: theme.colors.brandColor }]}>
                    International Courier Pricing
                </ThemedText>

                <ThemedCard
                    isCard
                    borderColor={"transparent"}
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
                        value="🇳🇵 Nepal"
                        editable={false}
                        containerStyle={{
                            borderWidth: 1,
                            borderColor: theme.dark ? "#FFFFFF" : theme.colors.border,
                            backgroundColor: "transparent",
                        }}
                        inputStyle={{ color: theme.dark ? "#FFFFFF" : "#000000", paddingLeft: 0 }}
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
                        textInputStyle={{ marginLeft: 0 }}
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
                        iconName="cube-sharp"
                        as={Ionicons}
                    />
                    <ThemedText style={{ color: theme.colors.textSecondary, marginBottom: 12, fontSize: 10 }}>
                        Choose what you are sending
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
                        iconName="briefcase"
                        as={Ionicons}
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
                            validate: (value: number) =>
                                value > 0 || "Please enter a valid weight"
                        }}
                        leftIcon={{
                            name: "monitor-weight",
                            color: theme.colors.brandColor,
                            size: 16
                        }}
                        inputStyle={{
                            paddingLeft: 5, 
                        }}
                    />

                    {/* BUTTON */}
                    <ThemedButton
                        leftIcon={{ name: "calculate", color: "#FFFFFF" }}
                        buttonName="Calculate Price"
                        loadingText="Calculating..."
                        isLoading={isLoading}
                        disabled={isLoading}
                        onPress={handleSubmit(onSubmit)}
                    />
                </ThemedCard>

                {/* PRICING RESULT */}
                {pricingResult?.success && (
                    <ThemedCard
                        isCard
                        borderColor={"transparent"}
                        borderWidth={1}
                        radius
                        shadow="md"
                        padding="md"
                        style={{ marginTop: 16, position: "relative" }}
                    >
                        {/* CLOSE BUTTON */}
                        <Pressable
                            style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                zIndex: 10,
                            }}
                            onPress={() => setPricingResult(null)}
                        >
                            <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
                        </Pressable>

                        {/* PRICE TITLE */}
                        <ThemedText style={[styles.cardTitle, { color: theme.colors.secondaryText }]}>
                            TOTAL ESTIMATED RATE
                        </ThemedText>

                        {/* PRICE */}
                        <ThemedText style={[styles.totalPrice, { color: theme.colors.text }]}>
                            ₹ {pricingResult?.data?.finalRate}
                        </ThemedText>

                        {/* INFO BOX */}
                        <View style={[styles.infoBox, { backgroundColor: theme.dark ? "#1F2933" : "#F3F4F6" }]}>
                            <Ionicons name="information-circle-outline" size={16} color={theme.colors.textSecondary} />
                            <ThemedText style={[styles.infoText, { color: theme.colors.secondaryText }]}>
                                Additional surcharges, remote area fees, or customs duties may apply based on destination.
                            </ThemedText>
                        </View>

                        {/* SEND ORDER BUTTON */}
                        <ThemedButton
                            buttonName="Send Your Order →"
                            style={[styles.orderButton, { backgroundColor: theme.colors.brandColor }]}
                            onPress={handleOrder}
                            isLoading={false}
                            loadingText=""
                        />
                    </ThemedCard>
                )}

                {/* ERROR MESSAGE */}
                {errorMessage && (
                    <ThemedCard
                        isCard
                        borderColor={"transparent"}
                        borderWidth={1}
                        radius
                        shadow="md"
                        padding="md"
                        style={{ marginTop: 16, position: "relative" }}
                    >
                        {/* CLOSE BUTTON */}
                        <Pressable
                            onPress={() => setErrorMessage(null)}
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                padding: 6,
                                zIndex: 10,
                            }}
                        >
                            <Ionicons name="close" size={18} color={theme.colors.textSecondary} />
                        </Pressable>

                        {/* ERROR MESSAGE */}
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingRight: 28 }}>
                            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                            <ThemedText
                                style={{
                                    fontSize: 12,
                                    fontFamily: "Montserrat-Medium",
                                    color: "#DC2626",
                                    flexShrink: 1,
                                }}
                            >
                                {errorMessage}
                            </ThemedText>
                        </View>
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
        marginTop: 80,
        paddingBottom: Platform.select({
            ios: 20,
            android: 90,
            default: 20,
        }),
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
    title: {
        fontSize: 18,
        fontFamily: "Montserrat-Bold",
        marginBottom: 20,
        textAlign: "center",
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
