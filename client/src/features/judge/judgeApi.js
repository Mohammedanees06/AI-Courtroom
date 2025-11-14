import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const judgeApi = createApi({
  reducerPath: "judgeApi",
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
    submitArgument: builder.mutation({
      query: ({ caseId, side, text }) => ({
        url: `/arguments`,
        method: "POST",
        body: { caseId, side, text },
      }),
    }),

    requestVerdict: builder.mutation({
      query: (caseId) => ({
        url: `/judge/verdict`,
        method: "POST",
        body: { caseId },
      }),
    }),
  }),
});

export const {
  useSubmitArgumentMutation,
  useRequestVerdictMutation,
} = judgeApi;
