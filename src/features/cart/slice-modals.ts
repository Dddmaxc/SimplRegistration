import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export type ModalSwitchState = {
  buttonSwitch: boolean;
};

const initialState: ModalSwitchState = {
  buttonSwitch: false,
};

const modals = createSlice({
  name: "Modals",
  initialState,
  reducers: {
    openO(state) {
      console.log("openO", state);
      state.buttonSwitch = true;
    },
    closeC(state) {
      state.buttonSwitch = false;
    },
  },
});
export const selectorCartWatcher = (state: RootState) => state.modals.buttonSwitch;

export const { openO, closeC } = modals.actions;
export default modals.reducer;
