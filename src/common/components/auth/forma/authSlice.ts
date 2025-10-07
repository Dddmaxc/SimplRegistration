// features/auth/authSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../../app/store";

type User = {
  id: string | null;
  email: string | null;
  name: string | null;
  token: string | null;
  phoneNumber: string | null;
}

type AuthState = {
  user: User;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: {
    id: null,
    email: null,
    name: null,
    token: null,
    phoneNumber: null,
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = initialState.user;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserId = (state: RootState) => state.auth.user.id;

export default authSlice.reducer;
