import { RootState, store } from "../store";
import { baseApi } from "@/api/baseApi";

export interface DropdownItem {
  _id?: string;
  name?: string;
}
export interface DropdownCountryItem {
  _id?: string;
  name?: string;
  cca2?: string;
  flagUrl: {
    png?: string
    svg?: string
  }
}


export const dropdwonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCountryList: builder.query<DropdownCountryItem[], void>({
      query: () => ({
        url: "/public/country/ddl",
        method: "GET",
      }),
      transformResponse: (response: any) => {
        const transformedResponse = response?.map((item: any) => ({
          _id: item._id,
          name: item.name,
        }));
        return transformedResponse;
      },
    }),

    getCustomerList: builder.query<DropdownItem[], void>({
      query: (params) => {
        const state = store.getState() as RootState;
        const customerId = state?.auth?.userData?.typeRef;

        return {
          url: `/customer-profile/ddl?vendor=${customerId}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const transformedResponse = response.map((item: any) => ({
          _id: item._id,
          name: item.name,
        }));
        return transformedResponse;
      },
    }),
    getCouponList: builder.query<DropdownItem[], void>({
      query: (params) => {
        const state = store.getState() as RootState;
        const customerId = state?.auth?.userData?.typeRef;
        return {
          url: `/vendor/coupons/ddl?vendor=${customerId}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const transformedResponse = response.map((item: any) => ({
          ...item,
          _id: item._id,
          name: item.code,
        }));
        return transformedResponse;
      },
    }),

    getPackageTypeDdl: builder.query({
      query: ({ keyword }: { keyword: string }) => {
        return {
          url: `/packagetype/ddl`,
          params: {
            keyword,
          },
        };
      },
      providesTags: [{ type: "TrackOrder", id: "LIST" }],
      transformResponse: (response: DropdownItem[]) => {
        const transformedResponse = response?.map((item: DropdownItem) => ({
          _id: item?._id,
          name: item.name,
        }));
        return transformedResponse;
      },
    }),

    getProductList: builder.query<DropdownItem[], void>({
      query: (params) => {
        const state = store.getState() as RootState;
        const customerId = state?.auth?.userData?.typeRef;
        return {
          url: `/vendor/products/ddl/vendor-product?customerId=${customerId}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const transformedResponse = response.map((item: any) => ({
          _id: item._id,
          name: item.productName,
          sellingPrice: item.sellingPrice,
        }));
        return transformedResponse;
      },
    }),

    getAccountList: builder.query({
      query: () => ({
        url: "/accounts/ddl/public",
      }),
    }),

    getServiceProvidersDdl: builder.query<DropdownItem[], void>({
      query: () => {
        return {
          url: `/entities/service-providers`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => {
        const transformedResponse = response.map((item: any) => ({
          _id: `${item?._id}`,
          name: `${item?.name}`,
        }));
        return transformedResponse;
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCustomerListQuery,
  useGetCouponListQuery,
  useGetProductListQuery,
  useGetAccountListQuery,
  useGetServiceProvidersDdlQuery,
  useGetPackageTypeDdlQuery,
  useGetCountryListQuery
} = dropdwonApi;
