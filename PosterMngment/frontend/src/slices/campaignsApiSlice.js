import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const CAMPAIGNS_URL = 'http://localhost:3000/api/campaigns'; 
export const campaignsApi = createApi({
  reducerPath: 'campaignsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  endpoints: (builder) => ({
    fetchCampaigns: builder.query({
      query: () => 'campaigns',
    }),
    updateCampaign: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `${CAMPAIGNS_URL}/${id}`,
          method: 'PUT',
          body: data,
        }),
        // Invalidate specific tags to ensure the data is refetched
        invalidatesTags: ['Campaigns'],
      }),
    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `campaigns/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchCampaignsQuery,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignsApi;
