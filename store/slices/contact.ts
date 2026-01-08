import { baseApi } from "@/api/baseApi";

export interface Message {
    message: string; 
    leadId: string;
}

export type CreateLeadPayload = {
    name: string;
    phone: string;
    description: string;
    inquiryOf: string;
    email?: string;    
    subject?: string;    
};

export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createLead: builder.mutation<Message, { payload: CreateLeadPayload }>({
            query: ({ payload }) => ({
                url: "/public/contact",
                method: "POST",
                body: payload,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useCreateLeadMutation } = messageApi;
