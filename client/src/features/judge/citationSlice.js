import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  citations: []
};

const citationSlice = createSlice({
  name: "citations",
  initialState,
  reducers: {
    addCitation(state, action) {
      state.citations.push(action.payload);
    },
    clearCitations(state) {
      state.citations = [];
    }
  }
});

export const { addCitation, clearCitations } = citationSlice.actions;
export default citationSlice.reducer;
