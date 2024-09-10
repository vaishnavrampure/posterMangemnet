import { apiSlice } from './apiSlice';
const USERS_URL = '/api/users';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),    
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useupdateUserMutation,
} = userApiSlice;
