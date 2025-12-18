import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  isLoading: boolean;
  // Add more app state properties as needed
}

const initialState: AppState = {
  isLoading: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Add more reducers as needed
  },
});

export const { setLoading } = appSlice.actions;
export default appSlice.reducer;
