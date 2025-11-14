import { createSlice } from "@reduxjs/toolkit";

const storedAuth = JSON.parse(localStorage.getItem("auth")) || {};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!storedAuth.token,
    token: storedAuth.token || null,
    user: storedAuth.user || null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;

      // Save both token and user to localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: state.token,
          user: state.user,
        })
      );
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
