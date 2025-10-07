  import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../../../app/store";

export type ModalSwitchState = {
  buttonSwitchForRegistr: boolean;
  otherAuthOpen: boolean;
};

const initialState: ModalSwitchState = {
  buttonSwitchForRegistr: false,
  otherAuthOpen: false,
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
    openOther: (state) => {
      state.otherAuthOpen = true;
    },
    closeOther: (state) => {
      state.otherAuthOpen = false;
    },
  },
});
export const sModalsForRegistr = (state: RootState) => state.modalsForRegistr;
export const otherAuthOpen = (state: RootState) =>
  state.modalsForRegistr.otherAuthOpen;

export const { openR, closeR, openOther, closeOther } =
  modalsForRegistr.actions;
export default modalsForRegistr.reducer;
