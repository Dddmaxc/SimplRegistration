import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

type Fields = "name" | "email" | "password" | "token" | "id";

export type RegistrType = Record<Fields, string | null>;

const initialState: RegistrType = {
  name: null,
  email: null,
  password: null,
  token: null,
  id: null,
};

const login = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUser(state, action: { payload: RegistrType }) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    removeUser(state, _action) {
      state.name = null;
      state.email = null;
      state.password = null;
      state.token = null;
      state.id = null;
    },
  },
});
export const registrSelector = (state: RootState) => state.login;

export const { setUser, removeUser } = login.actions;
export default login.reducer;
