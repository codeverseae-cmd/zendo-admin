import api from "@/src/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { OrderResponse } from "./type";

export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const res = await api.get<OrderResponse>(`/order?page=${page}&limit=${limit}`);
    return res.data;
  }
);

export const fetchSingleOrder = createAsyncThunk(
  "orders/single",
  async (id: string) => {
    const res = await api.get(`/order/${id}`);
    return res.data.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/status",
  async ({ id, status }: { id: string; status: string }) => {
    const res = await api.patch(`/order/${id}`, { status });
    return res.data.data;
  }
);

export const generatePaymentLink = createAsyncThunk(
  "orders/generatePaymentLink",
  async (id: string) => {
    const res = await api.post(`/order/${id}/payment-link`);
    return res.data.data;
  }
);
