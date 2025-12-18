import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import authReducer, {
  clearPreviousSession,
  initFromStorage,
} from "./auth/authSlice";
import { baseApi, invalidateAllTags, resetBaseApiState } from "../api/baseApi";
import { authApi, resetAuthApiState } from "./auth/authApi";
import { listenerMiddleware } from "./auth/listenerMiddleware";
import { clearAuthData, loadAuthData } from "../api/asyncStorage";

// Root reducer combining all slice reducers
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Configure Redux store with middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific action types or paths for serializability checks if needed
      },
    }).concat(
      baseApi.middleware,
      authApi.middleware,
      listenerMiddleware.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;

/**
 * Load persisted authentication state from AsyncStorage
 */
export const loadPersistedState = async (): Promise<void> => {
  try {
    const authData = await loadAuthData();
    if (authData) {
      store.dispatch(initFromStorage(authData));
    }
  } catch (error) {
    console.error("Failed to load persisted state:", error);
    throw error; // Allow caller to handle the error
  }
};

/**
 * Hook to manage authentication session state
 */
export const useAuthSessionManager = () => {
  const dispatch = store.dispatch;

  /**
   * Clear all auth state and prepare for a new login
   */
  const prepareForNewLogin = async (): Promise<void> => {
    try {
      await clearAuthData();
      dispatch(resetBaseApiState());
      dispatch(resetAuthApiState());
      dispatch(invalidateAllTags());
      dispatch(clearPreviousSession());
    } catch (error) {
      console.error("Failed to prepare for new login:", error);
      throw error;
    }
  };

  return { prepareForNewLogin };
};
