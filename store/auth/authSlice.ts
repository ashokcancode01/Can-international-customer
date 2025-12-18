import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { saveAuthData, clearAuthData } from "../../api/asyncStorage";

export interface UserEntity {
  entity: {
    _id: string;
  };
  authorization: {
    _id: string;
  };
}

export interface UserData {
  _id?: string;
  email?: string;
  name?: string;
  token?: string;
  selectedEntity?: UserEntity;
  typeRef?: string;
  phone?: string;
}

interface AuthState {
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionId?: string;
}

const initialState: AuthState = {
  userData: null,
  isAuthenticated: false,
  isLoading: false,
  sessionId: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserData>) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.sessionId = Date.now().toString();

      saveAuthData({
        userData: action.payload,
        isAuthenticated: true,
        sessionId: state.sessionId,
      });
    },
    logout: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.sessionId = undefined;

      clearAuthData();
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearPreviousSession: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.sessionId = undefined;

      clearAuthData();
    },
    initFromStorage: (state, action: PayloadAction<AuthState>) => {
      return {
        ...action.payload,
      };
    },
  },
});

export const {
  setCredentials,
  logout,
  setAuthLoading,
  clearPreviousSession,
  initFromStorage,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.userData;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectToken = (state: RootState) => state.auth.userData?.token;
