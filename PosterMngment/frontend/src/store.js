import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import { apiSlice } from './slices/apiSlice.jsx'
import { campaignsApi } from './slices/campaignsApiSlice'; 
// configureStore is a low-level of createStore
const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [campaignsApi.reducerPath]: campaignsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(apiSlice.middleware).concat(campaignsApi.middleware),
    devTools: true,
});
export default store;