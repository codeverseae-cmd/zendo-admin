import api from "@/src/services/api";
import { handleAxiosError } from "@/src/utils/handleAxiosError";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const fetchCategories = createAsyncThunk("category/fetch", async () => {
  try {
    const res = await api.get("/category");
    return res.data.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
});

export const createCategory = createAsyncThunk(
  "category/create",
  async (data: any) => {
    try {
      const res = await api.post("/category", data);
      toast.success("Category created successfully");
      return res.data.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, data }: { id: string; data: any }) => {
    try {
      const res = await api.patch(`/category/${id}`, data);
      toast.success("Category updated successfuly");
      return res.data.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id: string) => {
    try {
      await api.delete(`/category/${id}`);
      toast.success("category deleted successfully");
      return id;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }
);
