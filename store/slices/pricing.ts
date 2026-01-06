import { baseApi } from "@/api/baseApi";

export interface PricingItem {
    success: boolean;
    message: string;
    data: {
        type: string;
        service: string;
        physicalWeight: number;
        requestedWeight: number;
        matchedWeight: number;
        baseRate: number;
        finalRate: number;
        collectionUsed: string;
    };
}

export const pricingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPricing: builder.mutation<
            PricingItem,
            {
                destination: string;
                shipmentType: string;
                serviceType: string;
                weight: number;
            }
        >({
            query: ({ destination, shipmentType, serviceType, weight }) => ({
                url: "/public/rates",
                method: "POST",
                body: {
                    destination,
                    type: shipmentType.toLowerCase(), 
                    service: serviceType.toLowerCase(), 
                    weight,
                },
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useGetPricingMutation } = pricingApi; 