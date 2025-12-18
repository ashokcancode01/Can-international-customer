import { baseApi } from "@/api/baseApi";

export const doSpaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadToDoSpace: builder.mutation({
      query: (body) => {
        const formData = new FormData();
        formData.append("file", {
          uri: body.file.uri,
          name: body.file.name,
          type: body.file.type,
        } as any);
        formData.append("accountId", body.accountId);
        formData.append("filePath", body.filePath);

        return {
          url: "/doSpace",
          method: "POST",
          body: formData,
        };
      },
    }),

    deleteFromDoSpace: builder.mutation({
      query: (body) => {
        return {
          url: "/doSpace",
          method: "DELETE",
          body,
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const { useUploadToDoSpaceMutation, useDeleteFromDoSpaceMutation } =
  doSpaceApi;
