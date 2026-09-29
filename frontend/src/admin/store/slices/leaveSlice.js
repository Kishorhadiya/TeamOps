import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LEAVE_API as API } from "../../../config/api";

// ── GET all leaves from backend
export const fetchLeaves = createAsyncThunk(
  "leave/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;
      const { data } = await axios.get(`${API}/all-leave`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // Map backend rows → frontend shape
      const leaves = (data.AllLeave || [])
        .filter((r) => r.fromdate || r.todate)
        .map((r, i) => ({
          id: r.leaveid || i + 1,
          userid: r.userid,
          name: r.username || "Employee",
          role: "Staff Member",
          type: r.reason || "Leave",
          dates: `${String(r.fromdate || "").slice(0, 10)} to ${String(r.todate || "").slice(0, 10)}`,
          status: r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1).toLowerCase() : "Pending",
          reason: r.reason || "",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.username || "E")}&background=3b82f6&color=fff`,
        }));

      return leaves;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch leaves");
    }
  }
);

// ── APPROVE or REJECT a leave
export const updateLeaveStatus = createAsyncThunk(
  "leave/updateStatus",
  async ({ id, userid, status, adminid }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.accessToken;
      await axios.post(
        `${API}/approve-leave`,
        { id, leaveid: id, adminid, userid, status },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return { id, status }; // return to update local state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update leave");
    }
  }
);

const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    list: [],       // all leave requests
    loading: false,
    error: null,
  },
  reducers: {
    // For adding leave locally (when creating from form)
    addLeaveLocal(state, action) {
      state.list.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    // FETCH ALL
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // APPROVE / REJECT
    builder
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const leave = state.list.find((l) => l.id === id);
        if (leave) leave.status = status;
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addLeaveLocal } = leaveSlice.actions;
export default leaveSlice.reducer;
