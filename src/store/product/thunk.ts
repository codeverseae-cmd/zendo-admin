import api from "@/src/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductType } from "./slice";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { handleAxiosError } from "@/src/utils/handleAxiosError";

export const fetchProducts = createAsyncThunk(
  "product/fetch",
  async (filters: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    brandId?: string;
    priceMin?: number;
    priceMax?: number;
  }) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });

    try {
      const res = await api.get(`/product?${params.toString()}`);
      return res.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/create",
  async (data: ProductType) => {
    try {
      const res = await api.post("/product", data);
      toast.success("Product created successfully");
      return res.data.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, data }: { id: string; data: ProductType }) => {
    try {
      const res = await api.patch(`/product/${id}`, data);
      toast.success("product updated successfully");
      return res.data.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id: string) => {
    try {
      await api.delete(`/product/${id}`);
      toast.success("Product deleted successsfully");
      return id;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }
);
