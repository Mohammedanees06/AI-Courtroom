import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const caseApi = createApi({
  reducerPath: "caseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // GET cases with pagination
    getUserCases: builder.query({
      query: ({ page = 1, limit = 10 }) => `/cases?page=${page}&limit=${limit}`,
    }),

    // Create a new case
    createCase: builder.mutation({
      query: (caseData) => ({
        url: "/cases/create",
        method: "POST",
        body: caseData,
      }),
    }),

    // GET a single case details
    getCaseById: builder.query({
      query: (caseId) => `/cases/${caseId}`,
    }),

    // JOIN a case as Side A or Side B
    joinCase: builder.mutation({
      query: ({ caseId, side }) => ({
        url: `/cases/${caseId}/join`,
        method: "POST",
        body: { side },
      }),
    }),
  }),
});

export const {
  useGetUserCasesQuery,
  useCreateCaseMutation,
  useGetCaseByIdQuery,
  useJoinCaseMutation,
} = caseApi;
