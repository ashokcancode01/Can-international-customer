import { baseApi } from "@/api/baseApi";

export interface Branch {
    _id: string;
    code: string;
    name: string;
    address: string;
    phone: string;
    district?: {
        _id?: string;
        name?: string;
    };
    areasCovered: string;
    province?: {
        _id?: string;
        name?: string;
    };
    municipality?: {
        _id?: string;
        name?: string;
    };
}

export const branchesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBranchList: builder.query<
            {
                data: Branch[];
                pagination: { totalItems: number; page: number; limit: number; totalPages: number };
            },
            { account?: string; entity?: string; page?: number; search?: string }
        >({
            query: ({ account, entity, page = 1, search = "" }) => ({
                url: "/public/branch-list",
                method: "GET",
                params: { page, search, account, entity },
            }),
            transformResponse: (response: any) => {
                const dataArray = response?.data ?? [];
                const pagination = response?.pagination ?? { totalItems: 0, page: 1, limit: 10, totalPages: 1 };

                const transformedData: Branch[] = dataArray.map((item: any) => ({
                    _id: item._id,
                    code: item.code,
                    name: item.name,
                    address: item.address,
                    phone: item.phone,
                    district: item.district,
                    province: item.province,
                    municipality: item.municipality,
                    areasCovered: item.areasCovered,
                }));

                return { data: transformedData, pagination };
            },
        }),
        getBranchById: builder.query<{ data: Branch, services: any[] }, string>({
            query: (id) => `/public/branch/${id}`,
        }),

    }),
});

export const { useGetBranchListQuery, useGetBranchByIdQuery } = branchesApi;