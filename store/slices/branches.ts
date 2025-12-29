import { baseApi } from "@/api/baseApi";
export interface Coordinates {
    lat: number | null;
    long: number | null;
}

export interface WorkingHour {
    day?: string;
    openTime?: string;
    closeTime?: string;
    isOpen?: boolean;
}

export interface Service {
    _id: string;
    name?: string;
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

    service?: Service[];
    workingHours?: WorkingHour[];
}


export const branchesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getBranchList: builder.query<
            {
                data: Branch[];
                pagination: {
                    totalItems: number;
                    page: number;
                    limit: number;
                    totalPages: number;
                };
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
                const pagination = response?.pagination ?? {
                    totalItems: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                };

                const transformedData: Branch[] = dataArray.map((item: any) => ({
                    _id: item._id,
                    code: item.code,
                    name: item.name,
                    address: item.address,
                    phone: item.phone,
                    areasCovered: item.areasCovered,
                    district: item.district,
                    province: item.province,
                    municipality: item.municipality,
                }));

                return { data: transformedData, pagination };
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
                    service: response.data.service ?? [],
                    workingHours: response.data.workingHours?.map((wh: any) => ({
                        day: wh.day,
                        openTime: wh.startsAt,
                        closeTime: wh.closesAt,
                        isOpen: wh.startsAt != null && wh.closesAt != null,
                    })) ?? [],
                },
                services: response.services ?? [],
            }),
        }),
    }),
});


export const {
    useGetBranchListQuery,
    useGetBranchByIdQuery,
} = branchesApi;
