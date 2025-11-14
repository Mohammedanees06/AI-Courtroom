import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  verdict: "",
  loading: false
};

const judgeSlice = createSlice({
  name: "judge",
  initialState,
  reducers: {
    setVerdict(state, action) {
      state.verdict = action.payload;
    },
    setJudgeLoading(state, action) {
      state.loading = action.payload;
    },
    clearVerdict(state) {
      state.verdict = "";
    }
  }
});

export const { setVerdict, setJudgeLoading, clearVerdict } = judgeSlice.actions;
export default judgeSlice.reducer;
