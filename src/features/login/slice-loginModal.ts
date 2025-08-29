import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export type ModalSwitchState = {
  buttonSwitchForRegistr: boolean;
};

const initialState: ModalSwitchState = {
  buttonSwitchForRegistr: false,
};

const modalsForRegistr = createSlice({
  name: "ModalForRegistr",
  initialState,
  reducers: {
    openR(state) {
      state.buttonSwitchForRegistr = true;
    },
    closeR(state) {
      state.buttonSwitchForRegistr = false;
    },
  },
});
export const sModalsForRegistr = (state: RootState) =>
  state.modalsForRegistr.buttonSwitchForRegistr;

export const { openR, closeR } = modalsForRegistr.actions;
export default modalsForRegistr.reducer;
