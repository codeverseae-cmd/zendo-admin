import api from "@/src/services/api";
import toast from "react-hot-toast";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BrandType } from "./slice";
import { handleAxiosError } from "@/src/utils/handleAxiosError";

export const fetchBrands = createAsyncThunk("brand/fetch", async () => {
  const res = await api.get("/brand");
  return res.data.data;
});

export const createBrand = createAsyncThunk(
  "brand/create",
  async (data: BrandType) => {
    try {
      const res = await api.post("/brand", data);
      toast.success("Brand created successfully");
      return res.data.data;
    } catch (err) {
      handleAxiosError(err);
      throw err;
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brand/update",
  async ({ id, data }: { id: string; data: Partial<BrandType> }) => {
    try {
      const res = await api.patch(`/brand/${id}`, data);
      toast.success("Brand updated successfully");
      return res.data.data;
    } catch (err) {
      handleAxiosError(err);
      throw err;
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brand/delete",
  async (id: string) => {
    try {
      await api.delete(`/brand/${id}`);
      toast.success("Brand deleted");
      return id;
    } catch (err) {
      handleAxiosError(err);
      throw err;
    }
  }
);
