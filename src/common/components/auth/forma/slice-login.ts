import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../../../app/store";

export type UserFields =
  | "name"
  | "email"
  | "password"
  | "token"
  | "id"
  | "firstName"
  | "lastName"
  | "phoneNumber";

export type RegistrType = Record<UserFields, string | null>;

export type LoginModalState = {
  user: RegistrType;
  buttonSwitchForRegistr: boolean;
  buttonSwitchForOther: boolean;
};

const initialState: LoginModalState = {
  user: {
    name: null,
    email: null,
    password: null,
    token: null,
    id: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
  },
  buttonSwitchForRegistr: false,
  buttonSwitchForOther: false,
};

const loginModalSlice = createSlice({
  name: "modalsForRegistr",
  initialState,
  reducers: {
    setUser(state, action: { payload: Partial<RegistrType> }) {
      state.user = { ...state.user, ...action.payload };
    },
    updateUserField(
      state,
      action: { payload: { field: keyof RegistrType; value: string | null } }
    ) {
      const { field, value } = action.payload;
      state.user[field] = value;
    },
    removeUser(state) {
      state.user = { ...initialState.user };
    },
  },
});

export const { setUser, updateUserField, removeUser } = loginModalSlice.actions;
export const registrSelector = (state: RootState) => state.login.user;
export const idIsLoginedState = (state: RootState) => state.login.user.id;

export default loginModalSlice.reducer;
