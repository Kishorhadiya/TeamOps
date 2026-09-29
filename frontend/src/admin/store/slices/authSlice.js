import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ADMIN_API as API } from "../../../config/api";

// ── Restore saved authentication state from localStorage on page load
const getSavedAdmin = () => {
  try {
    const a = localStorage.getItem("adminUser") || localStorage.getItem("admin");
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
};

const getSavedToken = (key) => {
  try {
    return localStorage.getItem(key) || null;
  } catch {
    return null;
  }
};

const savedAdmin = getSavedAdmin();
const savedAccessToken = getSavedToken("adminAccessToken") || getSavedToken("adminToken") || getSavedToken("token");
const savedRefreshToken = getSavedToken("adminRefreshToken");

// ── LOGIN → get access + refresh tokens and persist
export const adminLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API}/adminsignin`, { email, password });
      
      // Persist to localStorage
      if (data?.admin) localStorage.setItem("adminUser", JSON.stringify(data.admin));
      if (data?.accessToken) localStorage.setItem("adminAccessToken", data.accessToken);
      if (data?.refreshToken) localStorage.setItem("adminRefreshToken", data.refreshToken);

      return data; // { admin, accessToken, refreshToken }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ── SIGNUP
export const adminSignup = createAsyncThunk(
  "auth/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API}/adminsignup`, { email, password });
      
      if (data?.admin) localStorage.setItem("adminUser", JSON.stringify(data.admin));
      if (data?.accessToken) localStorage.setItem("adminAccessToken", data.accessToken);
      if (data?.refreshToken) localStorage.setItem("adminRefreshToken", data.refreshToken);

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

// ── REFRESH TOKEN → generates new access token from refresh token
export const refreshToken = createAsyncThunk(
  "auth/refresh",
  async (_, { getState, rejectWithValue }) => {
    try {
      const currentRefresh = getState().auth.refreshToken || localStorage.getItem("adminRefreshToken");
      if (!currentRefresh) return rejectWithValue("No refresh token available");

      const { data } = await axios.post(`${API}/refresh-token`, {
        refreshToken: currentRefresh,
      });

      if (data?.admin) localStorage.setItem("adminUser", JSON.stringify(data.admin));
      if (data?.accessToken) localStorage.setItem("adminAccessToken", data.accessToken);

      return data; // { admin, accessToken }
    } catch (err) {
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");
      return rejectWithValue("Session expired. Please login again.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: savedAdmin || (savedAccessToken ? { email: "admin@teamops.com" } : null),
    accessToken: savedAccessToken,
    refreshToken: savedRefreshToken,
    isAuthenticated: Boolean(savedAdmin || savedAccessToken),
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials(state, action) {
      const { admin, accessToken, refreshToken } = action.payload;
      if (admin) {
        state.admin = admin;
        localStorage.setItem("adminUser", JSON.stringify(admin));
      }
      if (accessToken) {
        state.accessToken = accessToken;
        localStorage.setItem("adminAccessToken", accessToken);
      }
      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem("adminRefreshToken", refreshToken);
      }
      state.isAuthenticated = true;
    },
    logout(state) {
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");
      localStorage.removeItem("admin");

      state.admin = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // SIGNUP
    builder
      .addCase(adminSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(adminSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // REFRESH
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
