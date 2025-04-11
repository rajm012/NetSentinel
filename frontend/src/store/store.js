// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'
import alertsReducer from './slices/alerts'
import packetsReducer from './slices/packets'

export const store = configureStore({
  reducer: {
    alerts: alertsReducer,
    packets: packetsReducer,
    // Add other reducers here
  },
  // Add middleware if needed
})