import { RootState, store } from "../store";
import { baseApi } from "@/api/baseApi";

interface DropdownItem {
  _id?: string;
  name?: string;
}

interface Branch {
  _id: string;
  name: string;
  areasCovered: string;
  district?: {
    _id?: string;
    name?: string;
  };
}

export const dropdwonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
      providesTags: [{ type: "Order", id: "LIST" }],
      transformResponse: (response: DropdownItem[]) => {
        const transformedResponse = response?.map((item: DropdownItem) => ({
          _id: item?._id,
          name: item.name,
        }));
        return transformedResponse;
      },
    }),

    getBranchList: builder.query<
      DropdownItem[],
      { account?: string; entity?: string }
    >({
      query: (params) => ({
        url: "/branches/active",
        method: "GET",
        params,
      }),
      transformResponse: (response: Branch[]) => {
        const transformedResponse = response.map((item) => ({
          _id: item._id,
          name: `${item.name}${
            item.district?.name ? ` - ${item.district.name}` : ""
          }`,
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
  useGetBranchListQuery,
  useGetAccountListQuery,
  useGetServiceProvidersDdlQuery,
  useGetPackageTypeDdlQuery,
} = dropdwonApi;
