import { baseApi } from "@/api/baseApi";
export interface Coordinates {
    lat: number | null;
    long: number | null;
}
export interface WorkingHour {
    day?: string;
    startsAt?: string;
    closesAt?: string;
    isOpen?: boolean;
}
export interface ServiceType {
    _id: string;
    name: string;
}
export interface Service {
    _id: string;
    name?: string;
    code: string;
    type?: ServiceType; 
    description: string;
    isActive?: boolean;
}

export interface Branch {
    _id: string;
    code: string;
    name: string;
    address: string;
    phone: string;
    areasCovered: string;
    coordinates?: Coordinates;
    locationType?: string;
    district?: {
        _id?: string;
        name?: string;
    };
    province?: {
        _id?: string;
        name?: string;
    };
    municipality?: {
        _id?: string;
        name?: string;
    };
    pagination?: {
        limit: number;
        page: number;
        totalPages: number;
        totalItems: number;
    };
    service?: Service[];
    workingHours?: WorkingHour[];
}
export interface BranchResponse {
    data: Branch[],
    pagination?: {
        limit: number;
        page: number;
        totalPages: number;
        totalItems: number;
    };
}

export const branchesApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getDigitalStamps: builder.query<
            BranchResponse,
            { status: string; page: number; limit: number; keyword?: string }
        >({
            query: (params) => {
                return {
                    url: "/public/branch-list",
                    method: "GET",
                    params,
                };
            },
            providesTags: () => [{ type: "Branches", id: "LIST" }],
        }),

        getBranchList: builder.query<Branch[], { account?: string; entity?: string; search?: string }>({
            query: ({ account, entity, search = "" }) => ({
                url: "/public/branch-list",
                method: "GET",
                params: { search, account, entity },
            }),
            transformResponse: (response: any) => {
                return response?.data ?? [];
            },
        }),
        getBranchById: builder.query<
            {
                data: Branch;
                services: Service[];
            },
            string
        >({
            query: (id) => `/public/branch/${id}`,
            transformResponse: (response: any) => ({
                data: {
                    _id: response.data._id,
                    code: response.data.code,
                    name: response.data.name,
                    address: response.data.address,
                    phone: response.data.phone,
                    areasCovered: response.data.areasCovered,
                    coordinates: response.data.coordinates,
                    locationType: response.data.locationType,
                    district: response.data.district,
                    province: response.data.province,
                    municipality: response.data.municipality,
                    workingHours: response.data.workingHours ?? [],
                },
                services: response.services ?? [],
            }),
        }),
    }),
});

export const { useGetBranchListQuery, useGetBranchByIdQuery } = branchesApi;
