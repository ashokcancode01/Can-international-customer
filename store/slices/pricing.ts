import { baseApi } from "@/api/baseApi";

export interface PricingItem {
    success: boolean;
    message: string;
    data?: {
        finalRate: number;
    };
}

export type getPricing = {
    destination: string;
    type: string;
    service: string;
    weight: number;
};


export const pricingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPricing: builder.mutation<
            PricingItem,
            { payload: getPricing }
        >({
            query: ({ payload }) => ({
                url: "/public/rates",
                method: "POST",
                body: payload,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useGetPricingMutation } = pricingApi; 