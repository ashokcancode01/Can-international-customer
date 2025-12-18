import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store/store";
import { TrackingOrder } from "../types/publicTypes";

export const BASE_URL = "https://can-logistic-vluop.ondigitalocean.app/api";

// API for authenticated requests (with headers)
export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const userData = state?.auth?.userData;

      if (userData?.token) {
        headers.set("Authorization", `Bearer ${userData?.token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Campaign",
    "Product",
    "Category",
    "Blog",
    "ServiceProvider",
    "Branch",
  ],
  endpoints: (builder) => ({
    // Get product detail (no auth required)
    getProductDetail: builder.query<any, string>({
      query: (slug: string) => `/public/productDetail/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
      keepUnusedDataFor: 600,
    }),

    // Get related products (no auth required)
    getRelatedProducts: builder.query<
      any[],
      { productId: string; categoryId: string; limit?: number }
    >({
      query: ({ productId, categoryId, limit = 8 }) => {
        const params = new URLSearchParams({
          productId,
          categoryId,
          limit: limit.toString(),
        });
        return `/public/categories/related-product?${params.toString()}`;
      },
      providesTags: ["Product"],
      transformResponse: (response: any[]) => response || [],
    }),

    // Get campaigns (no auth required)
    getCampaignList: builder.query<any[], void>({
      query: () => "/public/campaign/list",
      providesTags: ["Campaign"],
      transformResponse: (response: { data: any[]; totalItems: number }) => {
        return response.data || [];
      },
    }),

    // Get categories (no auth required) - Special case for categories
    getCategoryOptions: builder.query<string[], void>({
      query: () => "/packagetype/options?status=Active",
      providesTags: ["Category"],
      transformResponse: (response: { filterOptions?: { c1?: string[] } }) => {
        return response.filterOptions?.c1 || [];
      },
    }),

    // Get campaign detail
    getCampaignDetail: builder.query<any, string>({
      query: (slug: string) => `/public/campaign/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Campaign", id: slug }],
    }),

    // Get campaign products
    getCampaignProducts: builder.query<
      any,
      {
        slug: string;
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortDirection?: string;
      }
    >({
      query: ({
        slug,
        page = 1,
        limit = 8,
        search,
        sortBy = "createdAt",
        sortDirection = "-1",
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortDirection,
          slug,
        });
        if (search) params.append("search", search);
        return `/public/campaign-product/list?${params.toString()}`;
      },
      providesTags: ["Product"],
      transformResponse: (response: {
        data: any[];
        totalItems: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      }) => {
        return {
          products: response.data || [],
          totalItems: response.totalItems || 0,
          currentPage: response.currentPage || 1,
          totalPages: response.totalPages || 0,
          hasNextPage: response.hasNextPage || false,
          hasPrevPage: response.hasPrevPage || false,
        };
      },
    }),

    // Generic product query for any endpoint - handles all product endpoints
    getGenericProducts: builder.query<
      { data: any[]; totalItems: number },
      string
    >({
      query: (endpoint: string) => endpoint,
      providesTags: ["Product"],
      transformResponse: (response: any) => {
        // Handle different response formats
        if (response.data && Array.isArray(response.data)) {
          return {
            data: response.data,
            totalItems: response.totalItems || response.data.length,
          };
        }
        // If response is directly an array
        if (Array.isArray(response)) {
          return {
            data: response,
            totalItems: response.length,
          };
        }
        // Default case
        return {
          data: [],
          totalItems: 0,
        };
      },
    }),

    // Create order
    createOrder: builder.mutation<
      { success: boolean; message: string; orderId?: string },
      {
        fullName: string;
        email: string;
        phone: string;
        alternatePhone?: string;
        deliveryNote?: string;
        address: string;
        landmark?: string;
        cart: Array<{
          productId: string;
          variantId: string | null;
          quantity: number;
          sellingPrice: number;
          vendor: string;
        }>;
      }
    >({
      query: (orderData) => ({
        url: "/public/create-order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Product"],
    }),

    // Get marketplace tracking (no auth required)
    getMarketplaceTracking: builder.query<TrackingOrder, string>({
      query: (trackingCode: string) =>
        `/public/marketplace-tracker/${trackingCode}`,
      keepUnusedDataFor: 0,
    }),

    // Get blog list (no auth required)
    getBlogList: builder.query<
      import("../types/publicTypes").BlogListResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 15, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search.trim()) {
          params.append("search", search.trim());
        }
        return `/public/blog/list?${params.toString()}`;
      },
      providesTags: (result, error, arg) => [
        { type: "Blog", id: `LIST-${arg.page}-${arg.search}` },
        "Blog",
      ],
      keepUnusedDataFor: 600,
    }),

    // Get blog detail (no auth required)
    getBlogDetail: builder.query<import("../types/publicTypes").Blog, string>({
      query: (blogSlug: string) => `/public/blog/${blogSlug}`,
      providesTags: (result, error, blogSlug) => [
        { type: "Blog", id: blogSlug },
      ],
      keepUnusedDataFor: 600,
    }),

    // Get service providers (no auth required)
    getServiceProviders: builder.query<
      import("../types/publicTypes").ServiceProvidersResponse,
      { page?: number; limit?: number; search?: string; status?: string }
    >({
      query: ({ page = 1, limit = 100, search = "", status = "Active" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          status,
        });
        if (search.trim()) {
          params.append("search", search.trim());
        }
        return `/public-branches/list/service-providers?${params.toString()}`;
      },
      providesTags: ["ServiceProvider"],
      keepUnusedDataFor: 600,
    }),

    // Get branch list (no auth required)
    getBranchList: builder.query<
      import("../types/publicTypes").BranchListResponse,
      {
        accountId: string;
        entityId: string;
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
      }
    >({
      query: ({
        accountId,
        entityId,
        page = 1,
        limit = 10,
        search = "",
        status = "Active",
      }) => {
        const params = new URLSearchParams({
          accountId,
          entityId,
          page: page.toString(),
          limit: limit.toString(),
          status,
        });
        if (search.trim()) {
          params.append("search", search.trim());
        }
        return `/public-branches/list/public-branch?${params.toString()}`;
      },
      providesTags: (result, error, arg) => [
        { type: "Branch", id: `${arg.accountId}-${arg.entityId}` },
        "Branch",
      ],
      keepUnusedDataFor: 600,
    }),

    getProductReviews: builder.query<
      { data: any[]; totalSize: number; averageRating: number },
      { slug: string; page?: number; limit?: number }
    >({
      query: ({ slug, page, limit }) => ({
        url: "/review/public",
        params: { productSlug: slug, page, limit },
      }),
    }),
  }),
});

export const {
  useGetProductDetailQuery,
  useGetRelatedProductsQuery,
  useGetCampaignListQuery,
  useGetCampaignDetailQuery,
  useGetCampaignProductsQuery,
  useGetCategoryOptionsQuery,
  useGetGenericProductsQuery,
  useCreateOrderMutation,
  useGetMarketplaceTrackingQuery,
  useGetBlogListQuery,
  useGetBlogDetailQuery,
  useGetServiceProvidersQuery,
  useGetBranchListQuery,
  useGetProductReviewsQuery,
} = homeApi;
