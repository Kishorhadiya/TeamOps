import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import leaveReducer from "./slices/leaveSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    leave: leaveReducer,
  },
});

export default store;
