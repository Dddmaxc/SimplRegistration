import { createSlice } from "@reduxjs/toolkit";
import type { Status } from "../features/cart/ui/products/products-slice";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    // themeMode: "light" as ThemeMode,
    status: "idle" as Status,
    error: null as string | null,
  },
  reducers: (create) => ({
    setAppStatus: create.reducer<{ status: Status }>((state, action) => {
      state.status = action.payload.status;
    }),
    // setAppError: create.reducer<{ error: string | null }>((state, action) => {
    //   state.error = action.payload.error
    // }),
    //     changeThemeMode: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
    //   state.themeMode = action.payload.themeMode
    // }),
  }),
  selectors: {
    // selectThemeMode: (state) => state.themeMode,
    selectStatus: (state) => state.status,
    // selectError: (state) => state.error,
  },
});

export const { setAppStatus } = appSlice.actions;
export const { selectStatus } = appSlice.selectors;
export default appSlice.reducer;

// export type ThemeMode = "dark" | "light"
