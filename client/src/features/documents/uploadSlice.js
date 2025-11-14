import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  documents: [], // stores uploaded document objects (from backend)
  uploading: false,
};

const uploadSlice = createSlice({
  name: "documentsUpload",
  initialState,
  reducers: {
    addDocument(state, action) {
      state.documents.push(action.payload);
    },
    removeDocument(state, action) {
      state.documents = state.documents.filter(
        (doc) => doc._id !== action.payload
      );
    },
    setUploading(state, action) {
      state.uploading = action.payload;
    },
    clearDocuments(state) {
      state.documents = [];
    },
  },
});

export const { addDocument,removeDocument, setUploading, clearDocuments } =
  uploadSlice.actions;
export default uploadSlice.reducer;
