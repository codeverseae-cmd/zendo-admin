import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/src/services/api";
import { setAuth } from "./slice";

export const adminLogin = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { dispatch }) => {
    const res = await api.post("/admin/login", data);

    dispatch(setAuth(res.data.token));
    return res.data;
  }
);