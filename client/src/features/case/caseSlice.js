import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCase: null,
  selectedSide: null,
  partyId: null,

  // Pagination state
  cases: [],
  page: 1,
  limit: 10,
  totalPages: 1,

  isLoading: false,
  error: null,
};

const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    // Set current case with optional selectedSide and caseId
    setCase: (state, action) => {
      state.currentCase = action.payload;
      state.caseId = action.payload.caseId;
      state.selectedSide = action.payload.selectedSide;
    },

    setSelectedSide: (state, action) => {
      state.selectedSide = action.payload;
    },

    setPartyId: (state, action) => {
      state.partyId = action.payload;
    },

    clearCase: (state) => {
      state.currentCase = null;
      state.selectedSide = null;
      state.partyId = null;
    },

    // Pagination-related reducers
    setCases: (state, action) => {
      state.cases = action.payload.cases;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
      state.error = null;
    },

    setPage: (state, action) => {
      state.page = action.payload;
    },

    setLimit: (state, action) => {
      state.limit = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setCase,
  setSelectedSide,
  setPartyId,
  clearCase,

  setCases,
  setPage,
  setLimit,
  setLoading,
  setError,
} = caseSlice.actions;

export default caseSlice.reducer;
