import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRound: 1,
  maxRounds: 5
};

const roundLimitSlice = createSlice({
  name: "roundLimit",
  initialState,
  reducers: {
    nextRound(state) {
      if (state.currentRound < state.maxRounds) {
        state.currentRound++;
      }
    },
    resetRounds(state) {
      state.currentRound = 1;
    }
  }
});

export const { nextRound, resetRounds } = roundLimitSlice.actions;
export default roundLimitSlice.reducer;
