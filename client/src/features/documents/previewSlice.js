import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  previewText: "",
  previewFileName: ""
};

const previewSlice = createSlice({
  name: "documentPreview",
  initialState,
  reducers: {
    setPreview(state, action) {
      const { text, name } = action.payload;
      state.previewText = text;
      state.previewFileName = name;
    },
    clearPreview(state) {
      state.previewText = "";
      state.previewFileName = "";
    }
  }
});

export const { setPreview, clearPreview } = previewSlice.actions;
export default previewSlice.reducer;
